import {SCENES} from "../constants/scenes.ts";
import {CONTENT} from "../constants/content.ts";
import {FLOW} from "../constants/flow.ts";
import {LOCALSTORAGE} from "../constants/localstorage.ts";
import {constUtils} from "../utils/constUtils.ts";

export class SceneFlowManager extends Phaser.Scene {

    flowMap: Map<any, any>;
    position: number;
    currentFlow: string;


    constructor() {
        super({
            key: SCENES.FLOWMANAGER, active: true
        });
        this.flowMap = new Map();
        this.position = 0;
        this.currentFlow = FLOW.STARTUP;
    }

    create() {
        localStorage.setItem(LOCALSTORAGE.FIRST_PLAY, "1");


        this.flowMap.set(FLOW.STARTUP, this.addStartupFlow());
        this.flowMap.set(FLOW.FIRSTGAME, this.addFirstGameFlow());

    }

    public getNextScene(newFLOW: string = FLOW.NOFLOW) {
        if (newFLOW != FLOW.NOFLOW) {
            this.currentFlow = newFLOW;
        }

        var flowArray = this.flowMap.get(this.currentFlow);

        var flow = flowArray[this.position];

        if (this.position < flowArray.length) {
            this.position += 1;
        }

        if (flow.key == SCENES.MAINMENU) {
            this.position = 0;
            this.currentFlow = FLOW.NOFLOW;
            if (this.currentFlow == FLOW.FIRSTGAME) {
                localStorage.setItem(LOCALSTORAGE.FIRST_PLAY, "0");
            }
        }
        

        return {
            key: flow.key,
            data: flow.data
        }
    }

    private addStartupFlow() {
        return [
            {
                key: SCENES.INFOMENU,
                data: {contentKey: CONTENT.INFO, buttonText: this.generateButtonText()}
            },
            {
                key: SCENES.INPUTMENU,
                data: {contentKey: CONTENT.SETNAME, buttonText: this.generateButtonText()}
            },
            {
                key: SCENES.MAINMENU,
                data: {}
            }
        ]
    }

    private addFirstGameFlow() {
        return [
            {
                key: SCENES.INFOMENU,
                data: {contentKey: CONTENT.FIRST_TIME_START, buttonText: this.generateButtonText()}
            },
            {
                key: SCENES.PLAY,
                data: {levelId: 0, gameTime: 15} // TODO proper id via overview?
            },
            {
                key: SCENES.INFOMENU,
                data: {contentKey: CONTENT.FIRST_TIME_MIDDLE, buttonText: this.generateButtonText()}
            },
            {
                key: SCENES.GAMEOVER,
                data: {contentKey: CONTENT.FIRST_TIME_GAMEOVER, buttonText: "Back to Menu!"}
            },
            {
                key: SCENES.MAINMENU,
                data: {}
            }
        ]
    }

    private generateButtonText() {
        var texts = ["Let's go!", "Next!", "Continue", "Let's see!", "Hussar!", "Hurray!", "Go! Go!"];
        var randomInt = constUtils.getRandomInt(texts.length);
        return texts[randomInt];
    }
}