import {REGISTRY} from "../../constants/registry.ts";
import {SCENES} from "../../constants/scenes.ts";
import {Button} from "../../containers/Button.ts";
import {TextField} from "../../containers/TextField.ts";

export class HighscoreSelectMenuScene extends Phaser.Scene {
    buttonText: string;


    constructor() {
        super({
            key: SCENES.HIGHSCORESELECT, active: false
        })
        this.buttonText = "Durr!";
    }

    init(data: any) {
        this.buttonText = data.buttonText;
    }

    create() {
        new TextField(this, 2, "Highscore Select", 2);

        var levelOverviewData = this.registry.get(REGISTRY.OVERVIEW);

        let counter = 3;

        levelOverviewData.forEach((levelData: { name: string; size: string; }) => {
            var content = "level: " + levelData.name + "; size: " + levelData.size;

            new Button(this, counter, content, levelData.name + "_HIGHSCORE");

            counter++;
        });

        new Button(this, 9, this.buttonText);
    }
}