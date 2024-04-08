/** @type {import("../typings/phaser")} */

import { LoadScene } from "./scenes/LoadScene.ts";
import { PlayScene } from "./scenes/PlayScene.ts";
import {HUDScene} from "./scenes/HUDScene.ts";
import {TrackingScene} from "./scenes/TrackingScene.ts";
import {GameOverScene} from "./scenes/GameOverScene.ts";
import {MainMenuScene} from "./scenes/menu/MainMenuScene.ts";
import {MenuBackgroundScene} from "./scenes/BackgroundScene.ts";
import {InfoMenuScene} from "./scenes/menu/InfoMenuScene.ts";
import {LevelSelectMenuScene} from "./scenes/menu/LevelSelectMenuScene.ts";
import {SceneFlowManager} from "./scenes/SceneFlowManager.ts";
import {InputMenuScene} from "./scenes/menu/InputMenuScene.ts";
import {HighscoreScene} from "./scenes/menu/HighscoreScene.ts";
import {HighscoreSelectMenuScene} from "./scenes/menu/HighscoreSelectMenuScene.ts";

new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [
        LoadScene,
        PlayScene,
        HUDScene,
        TrackingScene,
        GameOverScene,
        MainMenuScene,
        MenuBackgroundScene,
        InfoMenuScene,
        LevelSelectMenuScene,
        HighscoreSelectMenuScene,
        SceneFlowManager,
        InputMenuScene,
        HighscoreScene,

    ],
    render: {
        // so it doesn't default sharpen images. I hope.
        //pixelArt: true
    },
    physics: {
        default: "arcade",
        arcade: {
            fixedStep: true,
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
