import {SCENES} from "../../constants/scenes.ts";


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
        if(!this.scene.isActive(SCENES.MENUBACKGROUND)) {
            this.scene.launch(SCENES.MENUBACKGROUND); // Making fancy background FX
        }

        /*
        let {width, height} = this.sys.game.canvas;

        var deathOnBlackFields = this.add.text(width / 2 - 200, 200, "Start Game")
            .setScale(2.0, 2.0)
            .setColor('#ffffff');
        deathOnBlackFields.setInteractive();

        deathOnBlackFields.on("pointerup", () => {
            this.scene.start(SCENES.PLAY);
            this.scene.stop(SCENES.MENUBACKGROUND);
        })*/

    }
}