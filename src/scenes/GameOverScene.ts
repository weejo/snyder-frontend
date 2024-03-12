import {SCENES} from "../constants/scenes.ts";
import {REGISTRY} from "../constants/registry.ts";
import {URLS} from "../constants/urls.ts";
import {TextField} from "../containers/TextField.ts";
import {Button} from "../containers/Button.ts";

export class GameOverScene extends Phaser.Scene {
    levelId: number;
    content: string;
    buttonText: string;

    constructor() {
        super({
            key: SCENES.GAMEOVER, active: false
        });
        this.levelId = 0;
        this.content = "Hurr Durr!?";
        this.buttonText = "Durr!";

    }

    init(data: any) {
        this.levelId = data.levelId;
        this.content = data.content;
        this.buttonText = data.buttonText;
    }

    create(){
        if (!this.scene.isActive(SCENES.MENUBACKGROUND)) {
            this.scene.launch(SCENES.MENUBACKGROUND); // Making fancy background FX
        }
        this.publishData();



        new TextField(this, 2, "Game Over", 3);

        new TextField(this, 4, this.content);

        new TextField(this, 6, "Points: " + this.registry.get(REGISTRY.SCORE).toString(), 3);

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