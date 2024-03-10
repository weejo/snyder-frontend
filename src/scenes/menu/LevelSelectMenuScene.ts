import {REGISTRY} from "../../constants/registry.ts";
import {SCENES} from "../../constants/scenes.ts";
import {Button} from "../../containers/Button.ts";
import {CONTEXT} from "../../constants/context.ts";
import {Text} from "../../containers/Text.ts";

export class LevelSelectMenuScene extends Phaser.Scene {
    sceneContext: String;


    constructor() {
        super({
            key: SCENES.LEVELSELECT, active: false
        })
        this.sceneContext = "";
    }

    init(data: any) {
        this.sceneContext = data.sceneContext;
    }

    create() {
        this.createHeader();

        var levelOverviewData = this.registry.get(REGISTRY.OVERVIEW);

        let counter = 2;

        levelOverviewData.forEach((levelData: { name: string; size: string; }) => {
            var content = "level: " + levelData.name + "; size: " + levelData.size;

            if (this.sceneContext == CONTEXT.LEVEL) {
                new Button(this, counter, content, SCENES.PLAY, {level: levelData})
            } else {
                new Button(this, counter, content, SCENES.HIGHSCORE, {level: levelData})
            }

            counter++;
        });
    }

    private createHeader() {
        if (this.sceneContext == "LEVEL") {
            new Text(this, 1, "Level Select");
        } else if (this.sceneContext == "HIGHSCORE") {
            new Text(this, 1, "Higscore Select");
        }
    }
}