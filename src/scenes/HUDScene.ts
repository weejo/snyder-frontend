import { SCENES } from "../constants/scenes";
import {CONFIG} from "../constants/config.ts";
import eventUtils from "../utils/eventUtils.ts";
import {EVENTS} from "../constants/events.ts";


export class HUDScene extends Phaser.Scene {
    // @ts-ignore
    scoreDisplay: Phaser.GameObjects.Text;
    // @ts-ignore
    timeDisplay: Phaser.GameObjects.Text;
    bIsGameRunning: boolean;
    timer: number;

    constructor() {
        super({ key: SCENES.HUD, active: false });
        this.bIsGameRunning = false;
        this.timer = CONFIG.ROUNDTIME;
    }

    create() {
        this.setupEventListeners();

        this.setupDisplays();
    }

    private setupDisplays() {
        let { width, height } = this.sys.game.canvas;

        this.scoreDisplay = this.add.text(width / 2, height / 10, "0")
            .setScale(2)
            .setColor('#FF0000');

        this.timeDisplay = this.add.text(width / 2, height - 100, (this.timer/1000).toString())
            .setScale(2)
            .setColor('#FF0000');
    }

    private setupEventListeners() {
        eventUtils.on(EVENTS.GAMESTART, this.changeGameState, this);

        eventUtils.on(EVENTS.SCORECHANGE, this.changeScoreDisplay, this);
    }

    update(time: number, delta: number) {
        if(this.bIsGameRunning) {
            if (this.timer > 0) {
                this.timer -= delta;
                this.timeDisplay.setText( (this.timer/1000).toFixed(1).toString()).setColor('#FF0000')
            } else {
                eventUtils.emit(EVENTS.GAMEOVER);
            }
        }
    }

    private changeGameState(bIsRunning: boolean) {
        this.bIsGameRunning = bIsRunning;
    }

    private changeScoreDisplay(points: number) {
        this.scoreDisplay.setText(points.toFixed(0).toString()).setColor('#FF0000')
    }
}