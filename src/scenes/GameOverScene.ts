import {SCENES} from "../constants/scenes.ts";
import {REGISTRY} from "../constants/registry.ts";
import {TextField} from "../containers/TextField.ts";
import {Button} from "../containers/Button.ts";
import {constUtils} from "../utils/constUtils.ts";

export class GameOverScene extends Phaser.Scene {
    buttonText: string;

    constructor() {
        super({
            key: SCENES.GAMEOVER, active: false
        });
        this.buttonText = "Durr!";
    }

    init(data: any) {
        this.buttonText = data.buttonText;
    }

    create() {
        if (!this.scene.isActive(SCENES.MENUBACKGROUND)) {
            this.scene.launch(SCENES.MENUBACKGROUND); // Making fancy background FX
        }

        new TextField(this, 2, "Game Over", 2);

        new TextField(this, 4, "Points: " + this.registry.get(REGISTRY.SCORE).toString(), 2);

        new TextField(this, 6, this.generateGameOverMessage());

        new Button(this, 8, this.buttonText);
    }

    private generateGameOverMessage() {

        var texts = [
            "Houston, we had a problem!",
            "Looks like you spaced out!",
            "You did great, or something like that...",
            "Your diary's final entry:\n\n'Should've taken that left turn'",
            "In space, no one can hear you scream...\n\nbut they definitely saw that crash.",
            "Warning:\n\nSudden stops can be harmful to your body's structural integrity!",
            "Achievement Unlocked: \n\nGalactic Pancake. Try not to flatten your ship next time.",
            "You've boldly gone where many have gone before...\n\nthe game-over screen.",
            "Pro Tip:\n\nSpacecraft are not designed for head-on introductions to obstacles.",
            "It's not a bug, it's a feature:\n\nInstant spaceship recycling!"
        ];
        var randomInt = constUtils.getRandomInt(texts.length);
        return texts[randomInt];
    }
}