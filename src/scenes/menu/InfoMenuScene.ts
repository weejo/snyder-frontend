import {SCENES} from "../../constants/scenes.ts";
import {Button} from "../../containers/Button.ts";
import {TextField} from "../../containers/TextField.ts";


export class InfoMenuScene extends Phaser.Scene {

    contentKey: string;
    content: string;
    buttonText: string;

    constructor() {
        super({
            key: SCENES.INFOMENU, active: false
        });
        this.contentKey = "";
        this.content = "";
        this.buttonText = "";

    }

    init(data: any) {
        this.contentKey = data.contentKey;
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
        this.content = this.cache.text.get(this.contentKey);

        new TextField(this, 4, this.content);

        new Button(this, 9, this.buttonText);
    }

    displayContent() {
        let {width} = this.sys.game.canvas;

        this.add.text(width / 5, 200, this.content, {fontFamily: 'atari'})
            .setScale(2, 2)
            .setColor('#ffffff');
    }
}