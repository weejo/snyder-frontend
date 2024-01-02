import {CONSTANTS} from "../constants.ts";


export class PlayScene extends Phaser.Scene {

    player: any;
    cursors: any;
    map: any;

    constructor() {
        super({
            key: CONSTANTS.SCENES.PLAY, active: true
        });

    }

    preload() {
        //this.load.tilemapTiledJSON('map', "http://localhost:8080/level?levelId=8" );

        this.load.image('base_tiles', 'assets/tileset.png')

        this.load.tilemapTiledJSON('tilemap', 'assets/hurz.json')
    }

    create() {

        //this.cameras.main.centerOn(0, 0);


        this.map = this.make.tilemap({key: 'tilemap'})

        const tileset = this.map.addTilesetImage('backgroundtileset', 'base_tiles')

        this.map.createLayer('umap_iris', tileset)


        // @ts-ignore
        this.cursors = this.input.keyboard.createCursorKeys();

        this.player = this.physics.add.image(0, 0, 'block')

        //this.player.setCollideWorldBounds(true)

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(0.5,0.5);
    }

    update(time: number, delta: number) { //delta ~16.66 @ 60fps
        this.player.setVelocity(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-300);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(300);
        }

        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-300);
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(300);
        }
    }

}
