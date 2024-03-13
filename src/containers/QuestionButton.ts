import {IMAGE} from "../constants/image.ts";
import eventUtils from "../utils/eventUtils.ts";

export class QuestionButton extends Phaser.GameObjects.Container {
    name!: string;
    x!: number;
    y!: number;
    scene!: Phaser.Scene;
    renderWidth!: number;
    renderHeight!: number;
    content!: string;
    scale: number;
    fixed: boolean;
    group: string;
    spaceshipLeft: any;
    spaceshipRight: any;

    constructor(scene: Phaser.Scene, lineNumber: number, columnNumber: number, content: string, group: string, scale: number = 2) {
        super(scene, undefined);
        let {width, height} = this.scene.sys.game.canvas;

        this.y = (height / 10) * lineNumber;
        this.scene = scene;
        this.content = content;
        this.x = (width / 10) * columnNumber;
        this.scale = scale;
        this.fixed = false;
        this.group = group;


        // scale * 16 => default scale is 1.5, to make the renderwidth fit we go for *16, otherwise not all of the scaled up text would be displayed.
        this.renderWidth = content.length * (scale * 16);

        this.renderHeight = 75;

        this.setSize(this.renderWidth, this.renderHeight)
        this.setInteractive();
        this.create();
    }

    create() {
        this.spaceshipLeft = this.scene.add.image(50, 50, IMAGE.SHIP);
        this.spaceshipRight = this.scene.add.image(50, 50, IMAGE.SHIP);
        this.spaceshipLeft.setScale(0.4);
        this.spaceshipLeft.setAngle(-90);
        this.spaceshipRight.setScale(0.4);
        this.spaceshipRight.setAngle(-90);
        this.spaceshipLeft.setVisible(false);
        this.spaceshipRight.setVisible(false);


        this.on("pointerover", () => {
            this.spaceshipLeft.setVisible(true);
            this.spaceshipRight.setVisible(true);

            this.spaceshipLeft.x = this.x - (this.width / 2) - 75;
            this.spaceshipRight.x = this.x + (this.width / 2) + 75;

            this.spaceshipLeft.y = this.y;
            this.spaceshipRight.y = this.y;

        })

        this.on("pointerout", () => {
            if (!this.fixed) {
                this.spaceshipLeft.setVisible(false);
                this.spaceshipRight.setVisible(false);
            }
        })

        this.on("pointerup", () => {
            this.fixed = true;
            eventUtils.emit(this.group, this.x, this.content);
        })

        this.scene.add.text(this.x, this.y, this.content, {fontFamily: 'atari'})
            .setScale(this.scale)
            .setColor('#ffffff')
            .setOrigin(0.5);

        this.setupEventListeners();
    }

    private setupEventListeners() {
        eventUtils.on(this.group, this.changeState, this);
    }

    private changeState(x_slot: number, content: string) {
        if (x_slot != this.x) {
            this.fixed = false;
            this.spaceshipLeft.setVisible(false);
            this.spaceshipRight.setVisible(false);
        }
    }
}