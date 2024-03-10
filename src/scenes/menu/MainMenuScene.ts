import {SCENES} from "../../constants/scenes.ts";
import {Button} from "../../containers/Button.ts";
import {LOCALSTORAGE} from "../../constants/localstorage.ts";
import {CONTENT} from "../../constants/content.ts";
import {CONTEXT} from "../../constants/context.ts";


export class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENES.MAINMENU, active: false
        });
    }

    init(data: any) {

    }

    create() {
        //create images (z order)
        if (!this.scene.isActive(SCENES.MENUBACKGROUND)) {
            this.scene.launch(SCENES.MENUBACKGROUND); // Making fancy background FX
        }


        this.createInterface();
    }

    private createInterface() {

        let {width, height} = this.sys.game.canvas;
        var percentHeight = height / 10;


        if (localStorage.getItem(LOCALSTORAGE.FIRST_PLAY) == "1") {
            this.add.text(width / 4, percentHeight * 2, "Please start by hitting free play!")
                .setScale(2.5, 2.5)
                .setColor('#ffffff');
            // TODO korrekte LevelID hinzufügen
            new Button(this, 4, "Free Play", SCENES.INFOMENU, { contentKey: CONTENT.FIRST_TIME, nextSceneKey: SCENES.PLAY, nextSceneData: {levelId:0}, buttonText: "Let's play!"});
        } else {
            this.add.text(width / 5, percentHeight * 2, "Now that you know the game, please take the survey!")
                .setScale(2.5, 2.5)
                .setColor('#ffffff');
            new Button(this, 4, "Free Play", SCENES.LEVELSELECT, {sceneContext: CONTEXT.LEVEL});
        }

        new Button(this, 3, " Survey  ", SCENES.INFOMENU, {contentKey: CONTENT});
        new Button(this, 5, "Highscore", SCENES.LEVELSELECT, {sceneContext: CONTEXT.HIGHSCORE});
        new Button(this, 6, "  About  ", SCENES.ABOUT);
    }
}