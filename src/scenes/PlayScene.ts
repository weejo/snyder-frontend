import {SCENES} from "../constants/scenes.ts";
import eventUtils from "../utils/eventUtils.ts";
import {EVENTS} from "../constants/events.ts";
import {REGISTRY} from "../constants/registry.ts";
import {IMAGE} from "../constants/image.ts";
import {TILESET} from "../constants/tilesets.ts";

export class PlayScene extends Phaser.Scene {

    player: any;
    emitter: any;
    cursors: any;
    map: any;
    tileset: any;
    gameStarted: boolean;
    blackDeathToggle: boolean;


    constructor() {
        super({
            key: SCENES.PLAY, active: false
        });
        this.gameStarted = false;
        this.blackDeathToggle = false;
    }

    init(data: any) {

    }

    preload() {
        //this.load.tilemapTiledJSON('map', "http://localhost:8080/level?levelId=8" );

        this.load.tilemapTiledJSON('tilemap', 'assets/hurz.json')
    }

    create() {

        this.prepareMap();

        this.initializeRegistry();

        this.setupPlayer();

        this.setupScenes();

        this.setupEventListeners();
        var help = this.add.text(0, 0, '', { font: '48px monospace' });

        this.setupDebugInput(help);
    }

    private initializeRegistry() {

        this.registry.set(REGISTRY.CLUSTER, new Array(this.map.width * this.map.height).fill(0));
        this.registry.set(REGISTRY.SCORE, 0);
    }

    private setupScenes() {
        this.scene.launch(SCENES.HUD);
        this.scene.launch(SCENES.TRACKING, {player: this.player, map: this.map});
    }

    private setupPlayer() {
        // @ts-ignore
        this.cursors = this.input.keyboard.createCursorKeys();


        // emitter
        this.emitter = this.add.particles(0, 0, IMAGE.BRUSH, {
            frame: 'blue',
            speed: 100,
            blendMode: 'ADD',

        });
        this.player = this.physics.add.image(100, 100, IMAGE.SHIP);

        this.emitter.startFollow(this.player);



        // movement stuff
        this.player.setDrag(300);
        this.player.setAngularDrag(400);
        this.player.setMaxVelocity(600);

        this.physics.world.setBounds(0,0, this.map.width * this.tileset.tileWidth, this.map.height * this.tileset.tileHeight);

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(0.5, 0.5);
    }

    private prepareMap() {
        this.map = this.make.tilemap({key: 'tilemap'})

        this.tileset = this.map.addTilesetImage('backgroundtileset', TILESET.BASE);

        this.map.createLayer('umap_iris', this.tileset, 0,0);
    }

    private setupEventListeners() {
        eventUtils.on(EVENTS.GAMEOVER, this.gameOver, this);
    }

    update(time: number, delta: number) { //delta ~16.66 @ 60fps
        if (!this.gameStarted) {
            this.gameStarted = true;
            eventUtils.emit(EVENTS.GAMESTART, true);
        }

        const { left, right, up } = this.cursors;

        if (left.isDown)
        {
            this.player.setAngularVelocity(-150);
        }
        else if (right.isDown)
        {
            this.player.setAngularVelocity(150);
        }
        else
        {
            this.player.setAngularVelocity(0);
        }

        if (up.isDown)
        {
            this.emitter.start();
            this.physics.velocityFromRotation(this.player.rotation, 600, this.player.body.acceleration);
        }
        else
        {
            this.player.setAcceleration(0);
            this.emitter.stop();
        }

    }

    private gameOver() {
        this.scene.stop(SCENES.TRACKING);
        this.scene.stop(SCENES.HUD);
        this.scene.stop(SCENES.PLAY);
        this.scene.start(SCENES.GAMEOVER);
    }

    private setupDebugInput(help: Phaser.GameObjects.Text) {
        var layer = this.map;

        this.input.on('pointermove', function onPointerMove(pointer: any) {
            var tile =  layer.getTileAtWorldXY(pointer.worldX, pointer.worldY, true);

            if (!tile) return;

            help.setText(tile.index).setPosition(tile.pixelX, tile.pixelY);
        });
    }
}
