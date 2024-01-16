import {SCENES} from "../constants/scenes.ts";
import {REGISTRY} from "../constants/registry.ts";

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENES.GAMEOVER, active: false
        });
    }


    create(){
        let { width, height } = this.sys.game.canvas;

        this.add.text(width / 2, height / 10, "Game Over!")
            .setScale(5)
            .setColor('#FFFFFF');

        this.add.text(width / 2, height / 2, "Points: " + this.registry.get(REGISTRY.SCORE).toFixed(0).toString())
            .setScale(5)
            .setColor('#FFFFFF');
    }
}