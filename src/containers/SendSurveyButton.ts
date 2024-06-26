import {IMAGE} from "../constants/image.ts";
import {SCENES} from "../constants/scenes.ts";
import {SceneFlowManager} from "../scenes/SceneFlowManager.ts";
import {FLOW} from "../constants/flow.ts";
import {PlayScene} from "../scenes/PlayScene.ts";
import {HighscoreScene} from "../scenes/menu/HighscoreScene.ts";
import {URLS} from "../constants/urls.ts";

export class SendSurveyButton extends Phaser.GameObjects.Container {
    name!: string;
    x!: number;
    y!: number;
    scene!: Phaser.Scene;
    renderWidth!: number;
    renderHeight!: number;
    content!: string;
    scale: number;
    flow: string;
    surveyId: number;
    data: any;

    constructor(scene: Phaser.Scene, lineNumber: number, content: string, data: any, surveyId: number, flow: string = FLOW.NOFLOW, scale: number = 2) {
        super(scene, undefined);
        let {width, height} = this.scene.sys.game.canvas;

        this.y = (height / 10) * lineNumber;
        this.scene = scene;
        this.content = content;
        this.x = (width / 2);
        this.scale = scale;
        this.flow = flow;
        this.surveyId = 0;

        // scale * 16 => default scale is 1.5, to make the renderwidth fit we go for *16, otherwise not all of the scaled up text would be displayed.
        this.renderWidth = content.length * (scale * 16);

        this.renderHeight = 75;

        this.setSize(this.renderWidth, this.renderHeight)
        this.setInteractive();
        this.create();
    }

    create() {
        var spaceshipLeft = this.scene.add.image(50, 50, IMAGE.SHIP);
        var spaceshipRight = this.scene.add.image(50, 50, IMAGE.SHIP);
        spaceshipLeft.setScale(0.4);
        spaceshipLeft.setAngle(-90);
        spaceshipRight.setScale(0.4);
        spaceshipRight.setAngle(-90);
        spaceshipLeft.setVisible(false);
        spaceshipRight.setVisible(false);


        this.on("pointerover", () => {
            spaceshipLeft.setVisible(true);
            spaceshipRight.setVisible(true);

            spaceshipLeft.x = this.x - (this.width / 2) - 75;
            spaceshipRight.x = this.x + (this.width / 2) + 75;

            spaceshipLeft.y = this.y;
            spaceshipRight.y = this.y;

        })

        this.on("pointerout", () => {
            spaceshipLeft.setVisible(false);
            spaceshipRight.setVisible(false);
        })

        this.on("pointerup", () => {
            var flowmanager = this.scene.scene.get(SCENES.FLOWMANAGER) as SceneFlowManager;

            const {key, data} = flowmanager.getNextScene(this.flow);

            let nextScene = this.scene.scene.get(key);

            if (nextScene == undefined) {
                if (key == SCENES.PLAY) {
                    var playScene = new PlayScene();
                    this.scene.scene.add(key, playScene, true);
                } else if (key == SCENES.HIGHSCORE) {
                    var highscoreScene = new HighscoreScene();
                    this.scene.scene.add(key, highscoreScene, true);
                } else {
                    console.error("Scene is undefined - shit hit the fan");
                }
            }
            this.publishData();

            this.scene.scene.start(key, data);

            if (key == SCENES.PLAY) {
                this.scene.scene.stop(SCENES.MENUBACKGROUND);
            }

        })

        this.scene.add.text(this.x, this.y, this.content, {fontFamily: 'atari'})
            .setScale(this.scale)
            .setColor('#ffffff')
            .setOrigin(0.5);
    }

    private publishData() {

        fetch(URLS.SURVEY, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "surveyId": this.surveyId,
                "data": this.data
            })
        }).then();
    }
}