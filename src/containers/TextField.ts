export class TextField extends Phaser.GameObjects.Container {
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

        this.renderHeight = 75 * scale;

        this.scene.add.text(this.x, this.y, this.content, {fontFamily: 'atari'})
            .setScale(scale, scale)
            .setColor('#ffffff')
            .setOrigin(0.5);
    }
}