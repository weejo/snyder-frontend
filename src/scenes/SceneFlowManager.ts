import {SCENES} from "../constants/scenes.ts";
import {CONTENT} from "../constants/content.ts";
import {FLOW} from "../constants/flow.ts";
import {LOCALSTORAGE} from "../constants/localstorage.ts";
import {constUtils} from "../utils/constUtils.ts";
import {REGISTRY} from "../constants/registry.ts";

export class SceneFlowManager extends Phaser.Scene {

    flowMap: Map<any, any>;
    position: number;
    currentFlow: string;
    overviewData: any;

    constructor() {
        super({
            key: SCENES.FLOWMANAGER, active: true
        });
        this.flowMap = new Map();
        this.position = 0;
        this.currentFlow = FLOW.STARTUP;
    }

    create() {
        if (localStorage.getItem(LOCALSTORAGE.FIRST_PLAY) == null) {
            localStorage.setItem(LOCALSTORAGE.FIRST_PLAY, "1");
        }

    }

    public getNextScene(newFLOW: string = FLOW.NOFLOW) {
        if (newFLOW != FLOW.NOFLOW) {
            this.currentFlow = newFLOW;
            this.position = 0;
        }

        var flowArray = this.flowMap.get(this.currentFlow);

        var flow = flowArray[this.position];

        if (this.position < flowArray.length) {
            this.position += 1;
        }

        if (flow.key == SCENES.MAINMENU) {
            this.position = 0;
            if (this.currentFlow == FLOW.FIRSTGAME) {
                localStorage.setItem(LOCALSTORAGE.FIRST_PLAY, "0");
            }
            this.currentFlow = FLOW.NOFLOW;
        }

        return {
            key: flow.key,
            data: flow.data
        }
    }

    private addStartupFlow() {
        if (localStorage.getItem(LOCALSTORAGE.USERNAME) != null) {
            return [
                {
                    key: SCENES.INFOMENU,
                    data: {contentKey: CONTENT.INFO, buttonText: this.generateButtonText()}
                },
                {
                    key: SCENES.MAINMENU,
                    data: {}
                }
            ]
        }
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
        var levelData;
        for (let data of this.overviewData) {
            if (data.name == "Three Islands") {
                levelData = data;
                break;
            }
        }

        return [
            {
                key: SCENES.INFOMENU,
                data: {contentKey: CONTENT.FIRST_TIME_START, buttonText: this.generateButtonText()}
            },
            {
                key: SCENES.PLAY,
                data: {levelId: levelData.levelId, gameTime: 15, publishToggle: false}
            },
            {
                key: SCENES.INFOMENU,
                data: {contentKey: CONTENT.FIRST_TIME_MIDDLE, buttonText: this.generateButtonText()}
            },
            {
                key: SCENES.PLAY,
                data: {levelId: levelData.levelId, gameTime: 60}
            },
            {
                key: SCENES.GAMEOVER,
                data: {buttonText: this.generateButtonText(), levelData: levelData}
            },
            {
                key: SCENES.MAINMENU,
                data: {}
            }
        ]
    }

    private generateButtonText() {
        var texts = ["Let's go!", "Next!", "Continue", "Hussar!", "Hurray!", "Go! Go!", "NEXT!", "NEEEEXT!", "Up! Up and away!"];
        var randomInt = constUtils.getRandomInt(texts.length);
        return texts[randomInt];
    }

    private addLevelSelectFlow() {
        return [
            {
                key: SCENES.LEVELSELECT,
                data: {buttonText: this.generateButtonText()}
            },
            {
                key: SCENES.MAINMENU,
                data: {}
            }
        ]
    }

    private addHighscoreSelectFlow() {
        return [
            {
                key: SCENES.HIGHSCORESELECT,
                data: {buttonText: this.generateButtonText()}
            },
            {
                key: SCENES.MAINMENU,
                data: {}
            }
        ]
    }


    generateLevelFlows() {
        this.overviewData = this.registry.get(REGISTRY.OVERVIEW);

        this.flowMap.set(FLOW.FIRSTGAME, this.addFirstGameFlow());
        this.flowMap.set(FLOW.STARTUP, this.addStartupFlow());
        this.flowMap.set(FLOW.LEVELSELECT, this.addLevelSelectFlow());
        this.flowMap.set(FLOW.HIGHSCORESELECT, this.addHighscoreSelectFlow());

        this.overviewData.forEach((levelData: { name: string; levelId: number }) => {
            this.flowMap.set(levelData.name, this.addLevelFlow(levelData))
            this.flowMap.set(levelData.name + "_HIGHSCORE", this.addHighscoreFlow(levelData));
        });
    }

    private addLevelFlow(levelData: {name: string; levelId: number}) {
        return [
            {
                key: SCENES.PLAY,
                data: {levelId: levelData.levelId, gameTime: 60, publishToggle: true}
            },
            {
                key: SCENES.GAMEOVER,
                data: {buttonText: this.generateButtonText(), levelData: levelData}
            },
            {
                key: SCENES.HIGHSCORE,
                data: {levelData: levelData, buttonText: this.generateButtonText()}
            },
            {
                key: SCENES.MAINMENU,
                data: {}
            }
        ]
    }
    private addHighscoreFlow(levelData: {name: string; levelId: number}) {
        return [
            {
                key: SCENES.HIGHSCORE,
                data: {levelData: levelData, buttonText: this.generateButtonText()}
            },
            {
                key: SCENES.MAINMENU,
                data: {}
            }
        ]
    }
}