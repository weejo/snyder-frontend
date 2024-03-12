import {SCENES} from "../constants/scenes.ts";
import {REGISTRY} from "../constants/registry.ts";
import {URLS} from "../constants/urls.ts";
import {TextField} from "../containers/TextField.ts";
import {Button} from "../containers/Button.ts";
import {LOCALSTORAGE} from "../constants/localstorage.ts";

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
        this.levelId = data.levelData.levelId;
        this.content = data.content;
        this.buttonText = data.buttonText;
    }

    create(){
        if (!this.scene.isActive(SCENES.MENUBACKGROUND)) {
            this.scene.launch(SCENES.MENUBACKGROUND); // Making fancy background FX
        }
        this.publishData();

        new TextField(this, 2, "Game Over", 3);

        new TextField(this, 4, "Points: " + this.registry.get(REGISTRY.SCORE).toString(), 3);

        new TextField(this, 6, this.content);

        new Button(this, 8, this.buttonText);
    }

    private publishData() {
        var entry = {
            points: this.registry.get(REGISTRY.SCORE),
            name: localStorage.getItem(LOCALSTORAGE.USERNAME)
        }

        fetch(URLS.ADDRESULT, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "entry": entry,
                "levelId": this.levelId,
                "data": this.registry.get(REGISTRY.CLUSTER)
            })
        }).then();
    }
}