import {REGISTRY} from "../../constants/registry.ts";
import {SCENES} from "../../constants/scenes.ts";
import {Button} from "../../containers/Button.ts";
import {TextField} from "../../containers/TextField.ts";

export class LevelSelectMenuScene extends Phaser.Scene {
    buttonText: string;

    constructor() {
        super({
            key: SCENES.LEVELSELECT, active: false
        })
        this.buttonText = "Durr!";
    }

    init(data: any) {
        this.buttonText = data.buttonText;
    }

    create() {
        new TextField(this, 2, "Level Select", 3);

        var levelOverviewData = this.registry.get(REGISTRY.OVERVIEW);

        let counter = 3;

        new Button(this, 9, this.buttonText);

        levelOverviewData.forEach((levelData: { name: string; size: string; }) => {
            var content = "level: " + levelData.name + "| size: " + levelData.size;

            new Button(this, counter, content, levelData.name);

            counter++;
        });
    }
}