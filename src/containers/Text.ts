export class Text extends Phaser.GameObjects.Container {
    name!: string;
    x!: number;
    y!: number;
    scene!: Phaser.Scene;
    renderWidth!: number;
    renderHeight!: number;
    content!: string;
    scale: number;


    constructor(scene: Phaser.Scene, lineNumber: number, content: string, scale: number = 2) {
        super(scene, undefined);
        let {width, height} = this.scene.sys.game.canvas;

        this.y = (height / 10) * lineNumber;
        this.scene = scene;
        this.content = content;
        this.x = (width / 2);
        this.scale = scale;
        // scale * 16 => default scale is 1.5, to make the renderwidth fit we go for *16, otherwise not all of the scaled up text would be displayed.
        this.renderWidth = content.length * (scale * 16);

        this.renderHeight = 75;

        this.setSize(this.renderWidth, this.renderHeight)
        this.setInteractive();
        this.create();
    }

    create() {
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