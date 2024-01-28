import {SCENES} from "../constants/scenes.ts";


export class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: SCENES.MENU, active: true
        });
    }

    create() {
        //create images (z order)
        this.scene.launch(SCENES.MENUBACKGROUND); // Making fancy background FX

        let {width, height} = this.sys.game.canvas;

        var deathOnBlackFields = this.add.text(width / 2 - 200, 200, "Death on black fields")
            .setScale(2.0, 2.0)
            .setColor('#ffffff');
        deathOnBlackFields.setInteractive();

        deathOnBlackFields.on("pointerup", () => {
            this.scene.start(SCENES.PLAY, {blackDeathToggle: true})
            this.scene.stop(SCENES.MENUBACKGROUND);
        })


        var noDeathOnBlackFields = this.add.text(width / 2 - 200, 300, "Ignore black fields")
            .setScale(2.0, 2.0)
            .setColor('#ffffff');
        noDeathOnBlackFields.setInteractive();

        noDeathOnBlackFields.on("pointerup", () => {
            this.scene.start(SCENES.PLAY, {blackDeathToggle: false})
            this.scene.stop(SCENES.MENUBACKGROUND);
        })

    }
}