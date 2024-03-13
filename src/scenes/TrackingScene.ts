import {SCENES} from "../constants/scenes.ts";
import {REGISTRY} from "../constants/registry.ts";
import {constUtils} from "../utils/constUtils.ts";
import eventUtils from "../utils/eventUtils.ts";
import {EVENTS} from "../constants/events.ts";
import {CONFIG} from "../constants/config.ts";
import Set = Phaser.Structs.Set;

export class TrackingScene extends Phaser.Scene {
    player: any;
    lastTile?: Phaser.Tilemaps.Tile;
    path: Set<Phaser.Tilemaps.Tile>;
    pathLights: Phaser.GameObjects.Sprite[];
    // @ts-ignore
    map: Phaser.Tilemaps.Tilemap;
    coordsOfRectangle: any;
    bIsGameRunning: boolean;
    currentPolygon: Phaser.Tilemaps.Tile[];
    currentPolygonContent: Phaser.Tilemaps.Tile[];
    blackDeathToggle: boolean;
    isOnRecentlyCleanedPath: boolean;

    constructor() {
        super({
            key: SCENES.TRACKING, active: true
        });
        this.path = new Set();
        this.pathLights = [];
        this.lastTile = undefined;
        this.coordsOfRectangle = this.resetCoordsOfRectangle();
        this.bIsGameRunning = false;
        this.currentPolygon = [];
        this.currentPolygonContent = [];
        this.blackDeathToggle = false;
        this.isOnRecentlyCleanedPath = false;
    }

    init(data: any) {
        this.player = data.player;
        this.map = data.map;
    }

    create() {
        this.setupEventListeners();
    }


    update(time: number, delta: number) {
        if (this.bIsGameRunning) {
            var tile = this.map.getTileAtWorldXY(this.player.x, this.player.y);

            if (this.checkIfGameIsOver(tile)) return;

            tile = tile!;

            if (this.lastTile != tile) {
                if (this.path.contains(tile)) {
                    this.currentPolygon = this.extractPolygon(tile);
                    this.computePointsForGeneratedCluster();
                    this.updateVisitedTiles();
                    this.cleanUp();
                    this.isOnRecentlyCleanedPath = true;
                } else {
                    this.extendPath(tile);
                }
            }
        }
    }

    private checkIfGameIsOver(tile: Phaser.Tilemaps.Tile | null): boolean {
        if (tile == null) {
            eventUtils.emit(EVENTS.GAMEOVER);
            return true;
        }

        if (tile.tint == 0 && this.lastTile != tile) {
            if (!this.isOnRecentlyCleanedPath) {
                eventUtils.emit(EVENTS.GAMEOVER);
                return true;
            }
        }

        return false;
    }


    /**
     * Remove all elements before the one that matches. We want the circle to begin and End at the same positon.
     * @param matchingTile the tile that matched.
     * @private
     */
    private extractPolygon(matchingTile: Phaser.Tilemaps.Tile) {
        let bMeetingPoint = false;
        let polygon: Phaser.Tilemaps.Tile[] = [];
        for (let tile of this.path.getArray()) {
            if (tile == matchingTile) {
                bMeetingPoint = true;
            }
            if (bMeetingPoint) {
                polygon.push(tile);
            }
        }
        return polygon;
    }

    private computePointsForGeneratedCluster() {
        let points = 0;
        let counter = 0;
        let tiles = [];
        for (let x = this.coordsOfRectangle.lowestX; x < this.coordsOfRectangle.highestX + 1; x++) {
            for (let y = this.coordsOfRectangle.lowestY; y < this.coordsOfRectangle.highestY + 1; y++) {
                if (this.isPointInsidePolygon(x, y)) {
                    var tileAtPosition = this.map.getTileAt(x, y);
                    if (tileAtPosition) {
                        this.currentPolygonContent.push(tileAtPosition);
                        tiles.push(constUtils.resolvePoint(x, y, this.map.width));
                        console.log(tileAtPosition.index);
                        // @ts-ignore
                        points += tileAtPosition.index;
                        counter++;
                    }
                }
            }
        }
        let average = points / counter;
        var cluster = this.registry.get(REGISTRY.CLUSTER);
        for (let tile of tiles) {
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

    private updateVisitedTiles() {
        for (let tile of this.currentPolygonContent) {
            tile.tint = 0;
        }
        for (let tile of this.path.getArray()) {
            tile.tint = 0;
        }
    }

    private cleanUp() {
        this.coordsOfRectangle = this.resetCoordsOfRectangle();
        this.path = new Set(); // TODO don't reset path, remove only that part that is in the circle.
        this.currentPolygonContent = [];
        for (let pathLight of this.pathLights) {
            pathLight.destroy(true);
        }
        this.pathLights = [];
    }

    private extendPath(tile: Phaser.Tilemaps.Tile) {
        this.lastTile = tile;
        this.path.set(tile);

        tile.tint = 0.9;

        this.updateCoordsOfRectangle(tile);
        this.isOnRecentlyCleanedPath = false;
    }


}