import {TextField} from "../../containers/TextField.ts";
import {Button} from "../../containers/Button.ts";
import {SCENES} from "../../constants/scenes.ts";
import {URLS} from "../../constants/urls.ts";

export class HighscoreScene extends Phaser.Scene {
    levelData: any;
    buttonText: string;

    constructor() {
        super({
            key: SCENES.HIGHSCORE
        });
        this.buttonText = "uhm..";

    }

    init(data: any) {
        this.levelData = data.level;
        this.buttonText = data.buttonText;
    }

    preload() {
        this.load.json('level_highscore', URLS.HIGHSCORE + this.levelData.levelId);
    }

    create() {
        new TextField(this, 2, this.levelData.name + " Highscore", 3);

        new TextField(this, 3, "RANK | SCORE | NAME", 2);

        const data = JSON.parse(JSON.stringify(this.cache.json.get('level_highscore')));

        if (data.highscoreEntries != undefined) {
            for (let index = 0; index < data.highscoreEntries.length; index++) {
                let element = data.highscoreEntries[index];
                new TextField(this, 4 + index, index + " | " + element.points + " | " + element.name);
            }
        }

        new Button(this, 9, this.buttonText);
    }

}