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
    // @ts-ignore
    map: Phaser.Tilemaps.Tilemap;
    coords: any;
    bIsGameRunning: boolean;
    currentPolygon: Phaser.Tilemaps.Tile[];

    constructor() {
        super({
            key: SCENES.TRACKING, active: true
        });
        this.path = new Set();
        this.lastTile = undefined;
        this.coords = this.resetCoords();
        this.bIsGameRunning = false;
        this.currentPolygon = [];
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

            if (tile == null) {
                eventUtils.emit(EVENTS.GAMEOVER);
            } else if (this.lastTile != tile) {
                console.log(this.path);
                if (this.path.contains(tile)) {
                    console.log("finished path");
                    this.currentPolygon = this.extractPolygon(tile);
                    this.computePointsForGeneratedCluster();
                    this.coords = this.resetCoords();
                    this.path = new Set();

                } else {
                    console.log("adding to path");
                    this.lastTile = tile;
                    this.path.set(tile);
                    this.updateCoords(tile);
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
        for (let x = this.coords.lowestX; x < this.coords.highestX + 1; x++) {
            for (let y = this.coords.lowestY; y < this.coords.highestY + 1; y++) {
                if (this.isPointInsidePolygon(x, y)) {
                    tiles.push(constUtils.resolvePoint(x, y, this.map.width));
                    console.log(this.map.getTileAt(x, y)?.index)
                    // @ts-ignore
                    points += this.map.getTileAt(x, y)?.index;
                    counter++;
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
        var score = this.registry.get(REGISTRY.SCORE);
        score += average * CONFIG.SCORESCALE;
        score.toFixed(2);
        this.registry.set(REGISTRY.SCORE, score);
        eventUtils.emit(EVENTS.SCORECHANGE, score);
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

    private resetCoords() {
        return {
            highestX: Number.MIN_SAFE_INTEGER,
            lowestX: Number.MAX_SAFE_INTEGER,
            highestY: Number.MIN_SAFE_INTEGER,
            lowestY: Number.MAX_SAFE_INTEGER
        }
    }

    private updateCoords(tile: Phaser.Tilemaps.Tile) {
        if (tile.x > this.coords.highestX) {
            this.coords.highestX = tile.x;
        }
        if (tile.x < this.coords.lowestX) {
            this.coords.lowestX = tile.x;
        }
        if (tile.y > this.coords.highestY) {
            this.coords.highestY = tile.y;
        }
        if (tile.y < this.coords.lowestY) {
            this.coords.lowestY = tile.y;
        }
    }

    private setupEventListeners() {
        eventUtils.on(EVENTS.GAMESTART, this.changeGameState, this);
    }

    private changeGameState(bIsRunning: boolean) {
        this.bIsGameRunning = bIsRunning;
    }
}