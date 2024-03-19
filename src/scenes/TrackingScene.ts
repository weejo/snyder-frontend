import {SCENES} from "../constants/scenes.ts";
import {REGISTRY} from "../constants/registry.ts";
import {constUtils} from "../utils/constUtils.ts";
import eventUtils from "../utils/eventUtils.ts";
import {EVENTS} from "../constants/events.ts";
import {CONFIG} from "../constants/config.ts";
import Set = Phaser.Structs.Set;

export class TrackingScene extends Phaser.Scene {
    player: any;
    lastTiles: Set<Phaser.Tilemaps.Tile>;
    path: Set<Phaser.Tilemaps.Tile>;
    tilesInsidePolygon: number[];
    // @ts-ignore
    map: Phaser.Tilemaps.Tilemap;
    coordsOfRectangle: any;
    bIsGameRunning: boolean;
    currentPolygon: Phaser.Tilemaps.Tile[];
    blackDeathToggle: boolean;

    hasVisitedNewTiles: boolean;
    pathLength: number;

    constructor() {
        super({
            key: SCENES.TRACKING, active: true
        });
        this.path = new Set();
        this.lastTiles = new Set();
        this.coordsOfRectangle = this.resetCoordsOfRectangle();
        this.bIsGameRunning = false;
        this.currentPolygon = [];
        this.blackDeathToggle = true;
        this.hasVisitedNewTiles = false;
        this.pathLength = 0;
        this.tilesInsidePolygon = [];
    }

    init(data: any) {
        this.player = data.player;
        this.map = data.map;
        this.blackDeathToggle = data.blackDeathToggle;
    }

    create() {
        this.setupEventListeners();
    }


    update(time: number, delta: number) {
        if (this.bIsGameRunning) {
            var tile = this.map.getTileAtWorldXY(this.player.x, this.player.y);

            if (tile && !this.lastTiles.contains(tile)) {
                if (this.hasVisitedNewTiles && this.path.contains(tile)) {
                    this.currentPolygon = this.extractPolygon(tile);
                    this.computePointsForGeneratedCluster();
                    this.cleanUp(tile);
                    this.hasVisitedNewTiles = false;
                } else {
                    if (tile.tint != 0) {
                        this.hasVisitedNewTiles = true;
                    }
                    this.extendPath(tile);
                }
            }
        }
    }

    /**
     * Remove all elements before the one that matches. We want the circle to begin and End at the same positon.
     * @param matchingTile the tile that matched.
     * @private
     */
    private extractPolygon(matchingTile: Phaser.Tilemaps.Tile) {
        var number = this.path.getArray().indexOf(matchingTile);
        return this.path.getArray().slice(number);
    }

    private computePointsForGeneratedCluster() {
        let points = 0;
        let counter = 0;

        for (let x = this.coordsOfRectangle.lowestX; x < this.coordsOfRectangle.highestX + 1; x++) {
            for (let y = this.coordsOfRectangle.lowestY; y < this.coordsOfRectangle.highestY + 1; y++) {
                if (this.isPointInsidePolygon(x, y)) {
                    var tileAtPosition = this.map.getTileAt(x, y);
                    if (tileAtPosition && tileAtPosition.tint != 0) {
                        tileAtPosition.tint = 0;
                        this.tilesInsidePolygon.push(constUtils.resolvePoint(x, y, this.map.width));
                        // @ts-ignore
                        points += tileAtPosition.index;
                        counter++;
                    }
                }
            }
        }
        this.computePoints(points / counter);
    }

    private computePoints(average: number) {
        if (isNaN(average)) return;

        var cluster = this.registry.get(REGISTRY.CLUSTER);
        for (let tile of this.tilesInsidePolygon) {
            cluster[tile] = average;
        }
        this.registry.set(REGISTRY.CLUSTER, cluster);

        this.updateScore(average);
    }

    private updateScore(average: number) {
        if (average <= 0) return;
        let score = parseInt(this.registry.get(REGISTRY.SCORE));
        score += average * CONFIG.SCORESCALE;
        this.registry.set(REGISTRY.SCORE, score.toFixed(2));
        eventUtils.emit(EVENTS.SCORECHANGE);
    }

    /**
     * This is how we check if a point is inisde our path
     */
    private isPointInsidePolygon(x: number, y: number): boolean {
        var inside = false;

        for (let i = 0, j = this.currentPolygon.length - 1; i < this.currentPolygon.length; j = i++) {
            const xi = this.currentPolygon[i].x, yi = this.currentPolygon[i].y;
            const xj = this.currentPolygon[j].x, yj = this.currentPolygon[j].y;

            const intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
            if (intersect) inside = !inside;
        }

        return inside;
    }

    private resetCoordsOfRectangle() {
        return {
            highestX: Number.MIN_SAFE_INTEGER,
            lowestX: Number.MAX_SAFE_INTEGER,
            highestY: Number.MIN_SAFE_INTEGER,
            lowestY: Number.MAX_SAFE_INTEGER
        }
    }

    /**
     * wtf?
     * @param tile
     * @private
     */
    private updateCoordsOfRectangle(tile: Phaser.Tilemaps.Tile) {
        if (tile.x > this.coordsOfRectangle.highestX) {
            this.coordsOfRectangle.highestX = tile.x;
        }
        if (tile.x < this.coordsOfRectangle.lowestX) {
            this.coordsOfRectangle.lowestX = tile.x;
        }
        if (tile.y > this.coordsOfRectangle.highestY) {
            this.coordsOfRectangle.highestY = tile.y;
        }
        if (tile.y < this.coordsOfRectangle.lowestY) {
            this.coordsOfRectangle.lowestY = tile.y;
        }
    }

    private setupEventListeners() {
        eventUtils.on(EVENTS.GAMESTART, this.changeGameState, this);
    }

    private changeGameState(bIsRunning: boolean) {
        this.bIsGameRunning = bIsRunning;
    }

    private cleanUp(tile: Phaser.Tilemaps.Tile) {
        this.coordsOfRectangle = this.resetCoordsOfRectangle();
        this.updateCoordsOfRectangle(tile);
        this.tilesInsidePolygon.length = 0;
    }

    private extendPath(tile: Phaser.Tilemaps.Tile) {
        this.path.set(tile);
        this.lastTiles.clear();
        this.addAdditionalTiles(tile);
        this.pathLength++;

        tile.tint = 0;

        this.updateCoordsOfRectangle(tile);
    }

    private addAdditionalTiles(tile: Phaser.Tilemaps.Tile) {
        this.lastTiles.set(tile);
        for (let y = -2; y < 2; y++) {
            for (let x = -2; x < 2; x++) {
                var additionalTile = this.map.getTileAt(tile.x + x, tile.y + y);
                if (additionalTile != null) {
                    this.lastTiles.set(additionalTile);
                    this.path.set(additionalTile);
                    additionalTile.tint = 0;
                }
            }
        }

    }
}