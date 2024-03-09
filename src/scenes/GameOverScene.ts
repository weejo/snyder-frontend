import {SCENES} from "../constants/scenes.ts";
import {REGISTRY} from "../constants/registry.ts";
import {URLS} from "../constants/urls.ts";

export class GameOverScene extends Phaser.Scene {
    levelId: number;

    constructor() {
        super({
            key: SCENES.GAMEOVER, active: false
        });
        this.levelId = 61;
    }

    init(data: any) {
        // TODO: USE NONE STATIC LEVELID
        //this.levelId = data.levelId;
    }


    create(){
        let { width, height } = this.sys.game.canvas;

        this.add.text(width / 2, height / 10, "Game Over!")
            .setScale(5)
            .setColor('#FFFFFF');

        this.add.text(width / 2, height / 2, "Points: " + this.registry.get(REGISTRY.SCORE).toString())
            .setScale(5)
            .setColor('#FFFFFF');

        this.publishData();
    }

    private publishData() {
        fetch(URLS.ADDRESULT, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "entry": null,// TODO: ADD REAL PLAYER DATA HERE
                "levelId": this.levelId,
                "data": this.registry.get(REGISTRY.CLUSTER)
            })

        }).then();
    }
}