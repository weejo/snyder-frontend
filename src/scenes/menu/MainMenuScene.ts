import {SCENES} from "../../constants/scenes.ts";
import {Button} from "../../containers/Button.ts";
import {LOCALSTORAGE} from "../../constants/localstorage.ts";
import {FLOW} from "../../constants/flow.ts";
import {TextField} from "../../containers/TextField.ts";


export class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENES.MAINMENU, active: false
        });
    }

    create() {
        //create images (z order)
        if (!this.scene.isActive(SCENES.MENUBACKGROUND)) {
            this.scene.launch(SCENES.MENUBACKGROUND); // Making fancy background FX
        }

        this.createInterface();
    }

    private createInterface() {

        var username = localStorage.getItem(LOCALSTORAGE.USERNAME);
        if (username == null) {
            localStorage.setItem(LOCALSTORAGE.USERNAME, "anon");
            username = "anon";
        }

        if (localStorage.getItem(LOCALSTORAGE.FIRST_PLAY) == "1") {

            new TextField(this, 1, "Welcome " + username + "! Please start by hitting free play!");


            new Button(this, 4, "Free Play", FLOW.FIRSTGAME);
        } else {
            if (localStorage.getItem(LOCALSTORAGE.ASKFORSURVEY) == null) {
                new TextField(this, 1,"Welcome back " + username+ "!");
                new TextField(this, 2,"Now that you know the game, please start the survey!");
                localStorage.setItem(LOCALSTORAGE.ASKFORSURVEY, "HURZ");
            } else {
                new TextField(this, 1,"Welcome back " + username+ "!");
            }

            new Button(this, 3, " Survey  ", FLOW.SURVEY);
            new Button(this, 4, "Free Play", FLOW.LEVELSELECT);
        }

        new Button(this, 5, "Highscore", FLOW.HIGHSCORESELECT);
        new Button(this, 6, "  About  ", FLOW.ABOUT);
    }
}