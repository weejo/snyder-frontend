import {SCENES} from "../../constants/scenes.ts";
import {CONTENT} from "../../constants/content.ts";


export class InfoMenuScene extends Phaser.Scene {

    contentKey: string;
    content: string;
    nextSceneKey: string;
    buttonText: string;


    constructor() {
        super({
            key: SCENES.INFOMENU, active: false
        });
        this.contentKey = "";
        this.content = "";
        this.nextSceneKey = "";
        this.buttonText = "";

    }

    init(data: any) {
        this.contentKey = data.contentKey;
        this.nextSceneKey = data.nextSceneKey;
        this.buttonText = data.buttonText;
    }

    preload() {
        this.createLoadingBar();

        this.load.setPath('assets/content');
        // @ts-ignore
        this.load.text(this.contentKey, this.contentKey);

    }

    private createLoadingBar() {
        //create loading bar
        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff
            }
        });

        this.load.on("progress", (percent: number) => {
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
        });

        this.load.on('complete', function () {
            loadingBar.destroy();
        });
    }

    create() {
        //create images (z order)
        if(!this.scene.isActive(SCENES.MENUBACKGROUND)) {
            this.scene.launch(SCENES.MENUBACKGROUND); // Making fancy background FX
        }

        this.content = this.cache.text.get(this.contentKey);

        this.displayContent();

        this.addButton();
    }

    displayContent() {
        let {width, height} = this.sys.game.canvas;

        this.add.text(width / 4, 200, this.content)
            .setScale(2.5, 2.5)
            .setColor('#ffffff');
    }

    private addButton() {
        let {width, height} = this.sys.game.canvas;

        var nextButton = this.add.text(width / 2 - 100, height - 200, this.buttonText)
            .setScale(2.0, 2.0)
            .setColor('#ffffff');
        nextButton.setInteractive();

        nextButton.on("pointerup", () => {
            this.scene.start(this.nextSceneKey);
            if (this.nextSceneKey == SCENES.PLAY) {
                this.scene.stop(SCENES.MENUBACKGROUND);
            }
        })
    }
}