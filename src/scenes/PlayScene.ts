import {SCENES} from "../constants/scenes.ts";
import eventUtils from "../utils/eventUtils.ts";
import {EVENTS} from "../constants/events.ts";
import {REGISTRY} from "../constants/registry.ts";
import {IMAGE} from "../constants/image.ts";
import {TILESET} from "../constants/tilesets.ts";
import {SceneFlowManager} from "./SceneFlowManager.ts";
import {LOCALSTORAGE} from "../constants/localstorage.ts";
import {URLS} from "../constants/urls.ts";

export class PlayScene extends Phaser.Scene {

    player: any;
    emitter: any;
    cursors: any;
    map: any;
    tileset: any;
    gameStarted: boolean;
    levelId: number;
    gameTime: number;

    publishToggle: boolean;
    blackDeathToggle: boolean;
    asteroidsToggle: boolean;

    constructor() {
        super({
            key: SCENES.PLAY, active: false
        });
        this.gameStarted = false;
        this.blackDeathToggle = true;
        this.levelId = 0;
        this.gameTime = 60;
        this.publishToggle = true;
        this.asteroidsToggle = false;
    }

    init(data: { levelId: number, gameTime: number | null, publishToggle: boolean | null, blackDeathToggle: boolean | null, asteroidsToggle: boolean | null}) {
        this.levelId = data.levelId;
        if(data.gameTime != null) {
            this.gameTime = data.gameTime;
        }
        if (data.publishToggle != null) {
            this.publishToggle = data.publishToggle;
        }
        if (data.blackDeathToggle != null) {
            this.blackDeathToggle = data.blackDeathToggle;
        }
        if (data.asteroidsToggle != null) {
            this.asteroidsToggle = data.asteroidsToggle;
        }
    }

    preload() {
        this.load.tilemapTiledJSON('tilemap', URLS.LEVELDATA + this.levelId);
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
        this.scene.launch(SCENES.HUD, {gameTime: this.gameTime});
        this.scene.launch(SCENES.TRACKING, {player: this.player, map: this.map, blackDeathToggle: this.blackDeathToggle});
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
        if (this.asteroidsToggle) {
            this.player.setDamping(true);
            this.player.setDrag(0.99);
            this.player.setMaxVelocity(800);
        } else {
            this.player.setDrag(300);
            this.player.setAngularDrag(400);
            this.player.setMaxVelocity(600);
        }

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
        if (this.gameStarted) {
            this.gameStarted = false;

        var flowmanager = this.scene.get(SCENES.FLOWMANAGER) as SceneFlowManager;

        const {key, data} = flowmanager.getNextScene();

        let nextScene = this.scene.get(key);

        if (nextScene == undefined) {
            console.error("Scene is undefined - shit hit the fan");
        }

        this.scene.stop(SCENES.TRACKING);
        this.scene.stop(SCENES.HUD);
        this.scene.stop(SCENES.PLAY);

        if(this.publishToggle) {
            this.publishData();
        }

        this.scene.start(key, data);
        }
    }


    private publishData() {
        var entry = {
            points: parseInt(this.registry.get(REGISTRY.SCORE)),
            name: localStorage.getItem(LOCALSTORAGE.USERNAME)
        }

        fetch(URLS.ADDRESULT, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "entry": entry,
                "levelId": this.levelId,
                "data": this.registry.get(REGISTRY.CLUSTER)
            })
        }).then();
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
