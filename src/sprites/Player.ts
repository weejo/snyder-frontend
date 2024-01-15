import {PlayScene} from "../scenes/PlayScene.ts";

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: PlayScene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
    }
}