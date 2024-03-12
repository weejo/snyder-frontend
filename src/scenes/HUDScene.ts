import {SCENES} from "../constants/scenes";
import eventUtils from "../utils/eventUtils.ts";
import {EVENTS} from "../constants/events.ts";
import {REGISTRY} from "../constants/registry.ts";


export class HUDScene extends Phaser.Scene {
    // @ts-ignore
    scoreDisplay: Phaser.GameObjects.Text;
    // @ts-ignore
    timeDisplay: Phaser.GameObjects.Text;
    bIsGameRunning: boolean;
    gameTime: number;

    constructor() {
        super({key: SCENES.HUD, active: false});
        this.bIsGameRunning = false;
        this.gameTime = 0;
    }

    init(data: any) {
        this.gameTime = data.gameTime;
    }

    create() {
        this.setupEventListeners();

        this.setupDisplays();
    }

    private setupDisplays() {
        let {width, height} = this.sys.game.canvas;

        this.scoreDisplay = this.add.text(width / 2, height / 10, this.registry.get(REGISTRY.SCORE))
            .setScale(2)
            .setColor('#FF0000');

        this.timeDisplay = this.add.text(width / 2, height - 100, (this.gameTime / 1000).toString())
            .setScale(2)
            .setColor('#FF0000');
    }

    private setupEventListeners() {
        eventUtils.on(EVENTS.GAMESTART, this.changeGameState, this);

        eventUtils.on(EVENTS.SCORECHANGE, this.changeScoreDisplay, this);
    }

    update(time: number, delta: number) {
        if (this.bIsGameRunning) {
            if (this.gameTime > 0) {
                this.gameTime -= delta;
                this.timeDisplay.setText((this.gameTime / 1000).toFixed(1).toString()).setColor('#FF0000')
            } else {
                eventUtils.emit(EVENTS.GAMEOVER);
            }
        }
    }

    private changeGameState(bIsRunning: boolean) {
        this.bIsGameRunning = bIsRunning;
    }

    private changeScoreDisplay() {
        this.scoreDisplay.setText(this.registry.get(REGISTRY.SCORE)).setColor('#FF0000');
    }
}