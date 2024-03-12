import {SCENES} from "../../constants/scenes.ts";
import {InputKey} from "../../containers/InputKey.ts";
import {IMAGE} from "../../constants/image.ts";
import {Button} from "../../containers/Button.ts";
import {LOCALSTORAGE} from "../../constants/localstorage.ts";

export class InputMenuScene extends Phaser.Scene {
    chars!: any[];
    cursor!: Phaser.Math.Vector2;
    block: Phaser.GameObjects.Image;
    charLimit!: number;
    contentKey: string;
    buttonText: string;
    nameField: Phaser.GameObjects.Text;


    constructor() {
        super({key: SCENES.INPUTMENU, active: false});

        this.chars = [
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
            'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
            'U', 'V', 'W', 'X', 'Y', 'Z', '.', '-', '<', '>',
            '%', '@', 'DEL'
        ];

        this.cursor = new Phaser.Math.Vector2();
        this.charLimit = 5;
        this.contentKey = "";
        this.buttonText = "";
    }

    init(data: any) {
        this.contentKey = data.contentKey;
        this.buttonText = data.buttonText;
    }

    preload() {
        this.load.setPath('assets/content');
        // @ts-ignore
        this.load.text(this.contentKey, this.contentKey);
    }

    create() {
        let {width, height} = this.sys.game.canvas;
        this.displayContent();

        // this block is used to mark the currently selected character drawn to the screen.
        this.block = this.add.image(100, 100, IMAGE.BLOCK).setOrigin(0);

        this.nameField = this.add.text(width / 2 - 200, (height / 10 * 4), "", {fontFamily: 'atari'})
            .setScale(3)
            .setColor('#ffffff')

        this.createInputField();

        new Button(this, 9, this.buttonText);
    }

    private createInputField() {
        let {width, height} = this.sys.game.canvas;
        let y_offset = 0;
        for (let index = 0; index < this.chars.length; index++) {
            const element = this.chars[index];

            if (index % 10 == 0) y_offset += 50;

            if (index == 0) {
                this.block.setX(width / 2 - 300 + ((index % 10) * 50));
                this.block.setY(height / 2 + y_offset);
            }

            let key = new InputKey(this, width / 2 - 250 + ((index % 10) * 50), height / 2 + y_offset, element);

            if (element == 'DEL') {
                key.on("pointerover", () => {
                    this.block.setX(key.x - 25);
                    this.block.setY(key.y - 10);
                });

                key.on("pointerup", () => {
                    let currentText = this.nameField.text;
                    this.nameField.text = currentText.substring(0, currentText.length - 1);
                    localStorage.setItem(LOCALSTORAGE.USERNAME, this.nameField.text);
                });
            } else {
                key.on("pointerover", () => {
                    this.block.setX(key.x - 40);
                    this.block.setY(key.y - 10);
                });

                key.on("pointerup", () => {
                    if (this.nameField.text.length < this.charLimit) {
                        this.nameField.text += element;
                        localStorage.setItem(LOCALSTORAGE.USERNAME, this.nameField.text);
                    }
                });
            }
        }

        this.tweens.add({
            targets: this.block,
            alpha: 0.2,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            duration: 350
        });
    }

    displayContent() {
        let {width} = this.sys.game.canvas;
        var content = this.cache.text.get(this.contentKey);

        this.add.text(width / 4, 200, content, {fontFamily: 'atari'})
            .setScale(1.5, 1.5)
            .setColor('#ffffff');
    }
}