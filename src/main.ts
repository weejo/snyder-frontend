/** @type {import("../typings/phaser")} */

import { LoadScene } from "./scenes/LoadScene.ts";
import { PlayScene } from "./scenes/PlayScene.ts";

new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        height: 1080,
        width: 1920
    },
    scene: [
        LoadScene, PlayScene
    ],
    render: {
        // so it doesn't default sharpen images. I hope.
        pixelArt: true
    },
    physics: {
        default: "arcade",
        arcade: {
             fixedStep: false,
            /*debug: true,
            debugShowBody: true,
            debugShowStaticBody: true,
            debugShowVelocity: true,
            debugVelocityColor: 0xffff00,
            debugBodyColor: 0x0000ff,
            debugStaticBodyColor: 0xffffff */
        }
    },
    dom: {
        createContainer: true
    }
});
