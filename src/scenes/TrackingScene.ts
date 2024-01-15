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

    constructor() {
        super({
            key: SCENES.TRACKING, active: true
        });
        this.path = new Set();
        this.lastTile = undefined;
        this.coords = this.resetCoords();
        this.bIsGameRunning = false;
    }

    init(data: any) {
        this.player = data.player;
        this.map = data.map;
    }

    create() {
        this.setupEventListeners();
    }


    update(time: number, delta: number) {
        if(this.bIsGameRunning) {
            var tileAtWorldXY = this.map.getTileAtWorldXY(this.player.x, this.player.y);

            if (tileAtWorldXY == null) {
                eventUtils.emit(EVENTS.GAMEOVER);
            } else if (this.lastTile != tileAtWorldXY) {
                console.log(this.path);
                if (this.path.contains(tileAtWorldXY)) {
                    console.log("finished path");
                    this.cleanUpPath(tileAtWorldXY);
                    this.computePointsForGeneratedCluster();
                    this.coords = this.resetCoords();
                    this.path = new Set();

                } else {
                    console.log("adding to path");
                    this.lastTile = tileAtWorldXY;
                    this.path.set(tileAtWorldXY);
                    this.updateCoords(tileAtWorldXY);
                }
            }
        }
    }


    /**
     * Remove all elements before the one that matches. We want the circle to begin and End at the same positon.
     * @param matchingTile the tile that matched.
     * @private
     */
    private cleanUpPath(matchingTile: Phaser.Tilemaps.Tile) {
        for (let tile of this.path.getArray()) {
            if (tile != matchingTile) {
                this.path.delete(tile);
            } else {
                break;
            }
        }
    }

    private computePointsForGeneratedCluster() {
        let points = 0;
        let counter = 0;
        let tiles = [];
        for (let x = this.coords.lowestX; x < this.coords.highestX + 1; x++) {
            for (let y = this.coords.lowestY; y < this.coords.highestY + 1; y++) {
                let currentTile = this.map?.getTileAtWorldXY(x, y);
                // TODO: This doesn't find anything inside the polygon... figure out why.
                if (currentTile != null && this.isPointInsidePolygon(currentTile)) {
                    tiles.push(constUtils.resolvePoint(currentTile.x, currentTile.y, this.map.width));
                    points += currentTile.index;
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
        var score = this.registry.get(REGISTRY.SCORE);
        score += average * CONFIG.SCORESCALE;
        this.registry.set(REGISTRY.SCORE);
        eventUtils.emit(EVENTS.SCORECHANGE, score);
    }

    /**
     * This is how we check if a point is inisde our path
     */
    private isPointInsidePolygon(tile: Phaser.Tilemaps.Tile): boolean {
        var polygon = this.path.getArray();
        const x = tile.x;
        const y = tile.y;

        var inside = false;
        for (let i = 0, j = this.path.size - 1; i < this.path.size; j = i++) {
            const xi = polygon[i].x, yi = polygon[i].y;
            const xj = polygon[j].x, yj = polygon[j].y;

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