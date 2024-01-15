import { SCENES } from "../constants/scenes";
import {CONFIG} from "../constants/config.ts";
import eventUtils from "../utils/eventUtils.ts";
import {EVENTS} from "../constants/events.ts";


export class HUDScene extends Phaser.Scene {
    scoreDisplay: Phaser.GameObjects.Text;
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
        this.scoreDisplay = this.add.text(width / 2, height / 10, "0")
            .setScale(1.5)
            .setColor('#ffffff');

        this.timeDisplay = this.add.text(width / 2, height - 100, this.timer)
            .setScale(1.5)
            .setColor('#ffffff');
    }

    private setupEventListeners() {
        eventUtils.on(EVENTS.GAMESTART, this.changeGameState, this);

        eventUtils.on(EVENTS.ADDPOINTS, this.changePointDisplay, this);
    }

    update(time: number, delta: number) {
        if(this.bIsGameRunning) {
            if (this.timer > 0) {
                this.timer -= delta;
                this.timeDisplay.setText(this.timer.toFixed(1),toString()).setColor('#ffffff')
            } else {
                eventUtils.emit(EVENTS.GAMEOVER);
            }
        }
    }

    private changeGameState(bIsRunning: boolean) {
        this.bIsGameRunning = bIsRunning;
    }

    private changePointDisplay(points: number) {
        this.scoreDisplay.setText(points.toString()).setColor('#FFFFFF')
    }
}