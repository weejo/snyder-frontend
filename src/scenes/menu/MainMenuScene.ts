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

        let {width, height} = this.sys.game.canvas;
        var percentHeight = height / 10;
        var username = localStorage.getItem(LOCALSTORAGE.USERNAME);
        if (username == null) {
            localStorage.setItem(LOCALSTORAGE.USERNAME, "anon");
            username = "anon";
        }

        if (localStorage.getItem(LOCALSTORAGE.FIRST_PLAY) == "1") {

            new TextField(this, 2, "Welcome " + username + "! Please start by hitting free play!");


            new Button(this, 4, "Free Play", FLOW.FIRSTGAME);
        } else {
            this.add.text(width / 5, percentHeight * 2, "Welcome back " + username + "! Now that you know the game, please start the survey!")
                .setScale(2.5, 2.5)
                .setColor('#ffffff');
            new Button(this, 3, " Survey  ", FLOW.SURVEY);
            new Button(this, 4, "Free Play", FLOW.NORMALGAME);
        }

        new Button(this, 5, "Highscore", FLOW.HIGHSCORE);
        new Button(this, 6, "  About  ", FLOW.ABOUT);
    }
}