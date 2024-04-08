import {SCENES} from "../constants/scenes.ts";
import {REGISTRY} from "../constants/registry.ts";
import {constUtils} from "../utils/constUtils.ts";
import eventUtils from "../utils/eventUtils.ts";
import {EVENTS} from "../constants/events.ts";
import {CONFIG} from "../constants/config.ts";
import Set = Phaser.Structs.Set;

export class TrackingScene extends Phaser.Scene {
    player: any;
    lastTile: Phaser.Tilemaps.Tile;
    lastPosition: {x: number, y: number};
    path: Set<Phaser.Tilemaps.Tile>;
    // @ts-ignore
    map: Phaser.Tilemaps.Tilemap;
    coordsOfRectangle: any;
    bIsGameRunning: boolean;
    currentPolygon: Phaser.Tilemaps.Tile[];
    blackDeathToggle: boolean;

    hasVisitedNewTiles: boolean;
    pathLength: number;

    counterella: number;
    pointerella: number;

    constructor() {
        super({
            key: SCENES.TRACKING, active: false
        });
        this.path = new Set();
        this.coordsOfRectangle = this.resetCoordsOfRectangle();
        this.bIsGameRunning = false;
        this.currentPolygon = [];
        this.blackDeathToggle = true;
        this.hasVisitedNewTiles = false;
        this.pathLength = 0;
        this.pointerella = 0;
        this.counterella = 0;
    }

    init(data: any) {
        this.player = data.player;
        this.lastPosition = {x: data.player.x, y: data.player.y};
        this.map = data.map;
        this.blackDeathToggle = data.blackDeathToggle;
    }

    create() {
        this.setupEventListeners();
    }


    update(time: number, delta: number) {
        if (this.bIsGameRunning) {
            var tile = this.map.getTileAtWorldXY(this.player.x, this.player.y);

            if (tile && this.lastTile != tile) {
                if (this.hasVisitedNewTiles && this.path.contains(tile)) {
                    this.currentPolygon = this.extractPolygon(tile);
                    this.computePointsForGeneratedCluster();
                    this.cleanUp(tile);
                    this.hasVisitedNewTiles = false;
                } else {
                    if (tile.tint != 0) {
                        this.hasVisitedNewTiles = true;
                    }
                    this.extendPath(tile, this.player.x, this.player.y);
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
        let tilesInsidePolygon = [];

        for (let x = this.coordsOfRectangle.lowestX; x < this.coordsOfRectangle.highestX + 1; x++) {
            for (let y = this.coordsOfRectangle.lowestY; y < this.coordsOfRectangle.highestY + 1; y++) {
                if (this.isPointInsidePolygon(x, y)) {
                    var tileAtPosition = this.map.getTileAt(x, y);
                    if (tileAtPosition && tileAtPosition.tint != 0) {
                        tileAtPosition.tint = 0;
                        tilesInsidePolygon.push(constUtils.resolvePoint(x, y, this.map.width));
                        // @ts-ignore
                        points += tileAtPosition.index;
                        counter++;
                    }
                }
            }
        }
        this.computePoints(points / counter, tilesInsidePolygon);
    }

    private computePoints(average: number, tilesInsidePolygon: any[]) {
        if (isNaN(average)) return;

        var cluster = this.registry.get(REGISTRY.CLUSTER);
        var clusterpoints = this.registry.get(REGISTRY.CLUSTERPOINTS);

        cluster.push(tilesInsidePolygon);
        clusterpoints.push(average);

        this.registry.set(REGISTRY.CLUSTERPOINTS, clusterpoints);
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
        this.updateCoordsOfRectangle(tile);
    }

    private extendPath(tile: Phaser.Tilemaps.Tile, x:number, y:number) {
        this.path.set(tile);
        var result= this.map.getTilesWithinShape(new Phaser.Geom.Line(x, y, this.lastPosition.x, this.lastPosition.y));

        this.lastPosition = {x: x, y: y};
        if (result !=  null && result.length > 0) {
            this.pathLength += result.length;
            for (let eachTile of result) {
                if (eachTile) {
                    eachTile.tint = 0;
                    this.path.set(eachTile);
                }

            }
        }

        this.lastTile = tile;
        tile.tint = 0;

        this.updateCoordsOfRectangle(tile);
    }
}