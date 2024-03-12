import {SCENES} from "../constants/scenes.ts";
import {REGISTRY} from "../constants/registry.ts";
import {URLS} from "../constants/urls.ts";
import {TextField} from "../containers/TextField.ts";
import {Button} from "../containers/Button.ts";

export class GameOverScene extends Phaser.Scene {
    levelId: number;
    contentKey: string;
    buttonText: string;

    constructor() {
        super({
            key: SCENES.GAMEOVER, active: false
        });
        this.levelId = 0;
        this.contentKey = "Hurr Durr!?";
        this.buttonText = "Durr!";

    }

    init(data: any) {
        this.levelId = data.levelId;
        this.contentKey = data.contentKey;
        this.buttonText = data.buttonText;
    }

    preload() {
        this.load.setPath('assets/content');
        // @ts-ignore
        this.load.text(this.contentKey, this.contentKey);
    }

    create(){
        this.publishData();

        var content = this.cache.text.get(this.contentKey);

        new TextField(this, 2, "Game Over", 3);

        new TextField(this, 4, content);

        new TextField(this, 6, "Points: " + this.registry.get(REGISTRY.SCORE).toString(), 4);

        new Button(this, 8, this.buttonText);
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