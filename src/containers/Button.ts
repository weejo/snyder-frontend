import {IMAGE} from "../constants/image.ts";
import {SCENES} from "../constants/scenes.ts";

export class Button extends Phaser.GameObjects.Container {
    name!: string;
    x!: number;
    y!: number;
    scene!: Phaser.Scene;
    renderWidth!: number;
    renderHeight!: number;
    content!: string;
    scale: number;
    nextSceneKey: string;
    nextSceneData: any;

    constructor(scene: Phaser.Scene, lineNumber: number, content: string, nextSceneKey: string, nextSceneData: any = {}, scale: number = 2) {
        super(scene, undefined);
        let {width, height} = this.scene.sys.game.canvas;

        this.y = (height /10) * lineNumber;
        this.scene = scene;
        this.content = content;
        this.x = (width / 2);
        this.scale = scale;
        this.nextSceneKey = nextSceneKey;
        this.nextSceneData = nextSceneData;
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

            spaceshipLeft.x = this.x - (this.width / 2) - 125;
            spaceshipRight.x = this.x + (this.width / 2) + 50;

            spaceshipLeft.y = this.y;
            spaceshipRight.y = this.y;

        })

        this.on("pointerout", () => {
            spaceshipLeft.setVisible(false);
            spaceshipRight.setVisible(false);
        })

        this.on("pointerup", () => {

            let nextScene = this.scene.scene.get(this.nextSceneKey);

            if (nextScene == undefined) {
                //this.scene.scene.add(this.nextSceneKey, PlayScene, false, );
                console.error("Scene is undefined - shit hit the fan");
            }

            this.scene.scene.start(this.nextSceneKey, this.nextSceneData);

            if (this.nextSceneKey == SCENES.PLAY) {
                this.scene.scene.stop(SCENES.MENUBACKGROUND);
            }
        })


        let graphics = this.scene.make.graphics();
        graphics.lineStyle(1, 0xff0000);
        graphics.fillStyle(0x02455f, .5);

        let text = this.scene.add.text(0, 40, this.content)
            .setScale(this.scale)
            .setColor('#ffffff');

        let renderTexture = this.scene.add.renderTexture(this.x, this.y, this.renderWidth, this.renderHeight);

        renderTexture.draw(graphics);
        renderTexture.draw(text);
        let imgName = 'levelOptionImage' + Math.random();

        renderTexture.saveTexture(imgName);

        graphics.destroy();
        text.destroy();
        renderTexture.destroy();

        this.scene.add.image(this.x, this.y, imgName).setOrigin(.5);

    }
}