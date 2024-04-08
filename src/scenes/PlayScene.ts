import {SCENES} from "../constants/scenes.ts";
import eventUtils from "../utils/eventUtils.ts";
import {EVENTS} from "../constants/events.ts";
import {REGISTRY} from "../constants/registry.ts";
import {IMAGE} from "../constants/image.ts";
import {TILESET} from "../constants/tilesets.ts";
import {SceneFlowManager} from "./SceneFlowManager.ts";
import {LOCALSTORAGE} from "../constants/localstorage.ts";
import {URLS} from "../constants/urls.ts";
import {GameOverScene} from "./GameOverScene.ts";
import {TrackingScene} from "./TrackingScene.ts";

export class PlayScene extends Phaser.Scene {

    player: any;
    emitter: any;
    cursors: any;
    map: any;
    tileset: any;
    gameStarted: boolean;
    levelId: number;
    gameTime: number;
    inputData: {countUp: number, timeUp: number, timeLeft: number, countLeft: number, timeRight: number, countRight: number, timeSpace: number, countSpace: number};
    inputToggles: {up: boolean, left: boolean, right: boolean, space: boolean}
    publishToggle: boolean;
    blackDeathToggle: boolean;
    asteroidsToggle: boolean;

    constructor() {
        super({
            key: SCENES.PLAY, active: false
        });
        this.gameStarted = false;
        this.blackDeathToggle = false;
        this.levelId = 0;
        this.gameTime = 60;
        this.publishToggle = true;
        this.asteroidsToggle = false;
        this.inputData = {countUp: 0, timeUp: 0, countSpace: 0, timeSpace: 0, countRight: 0, timeRight: 0, countLeft: 0, timeLeft: 0}
        this.inputToggles = {up: false, left: false, right: false, space: false}
    }

    init(data: {
        levelId: number,
        gameTime: number | null,
        publishToggle: boolean | null,
        blackDeathToggle: boolean | null,
        asteroidsToggle: boolean | null
    }) {
        this.levelId = data.levelId;
        if (data.gameTime != null) {
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
        //this.load.tilemapTiledJSON('tilemap', 'assets/hurz.json')
    }

    create() {

        this.prepareMap();

        this.initializeRegistry();

        this.setupPlayer();

        this.setupScenes();

        this.setupEventListeners();
        var help = this.add.text(0, 0, '', {font: '48px monospace'});

        this.setupDebugInput(help);
    }

    private initializeRegistry() {
        this.registry.set(REGISTRY.CLUSTER, []);
        this.registry.set(REGISTRY.CLUSTERPOINTS, []);
        this.registry.set(REGISTRY.SCORE, 0);
    }

    private setupScenes() {
        this.scene.launch(SCENES.HUD, {gameTime: this.gameTime});
        this.scene.launch(SCENES.TRACKING, {
            player: this.player,
            map: this.map,
            blackDeathToggle: this.blackDeathToggle
        });
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

        this.player = this.physics.add.image((this.map.width * this.tileset.tileWidth /2), (this.map.height * this.tileset.tileHeight/2), IMAGE.SHIP);

        this.emitter.startFollow(this.player);


        // movement stuff
        if (this.asteroidsToggle) {
            this.player.setDamping(true);
            this.player.setDrag(0.99);
            this.player.setMaxVelocity(800);
        } else {
            this.player.setDrag(300);
            this.player.setAngularDrag(400);
            this.player.setMaxVelocity(400);
        }

        this.physics.world.setBounds(0, 0, this.map.width * this.tileset.tileWidth, this.map.height * this.tileset.tileHeight);

        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(0.35, 0.35);
    }

    private prepareMap() {
        this.map = this.make.tilemap({key: 'tilemap'})

        this.tileset = this.map.addTilesetImage('backgroundtileset', TILESET.BASE);

        this.map.createLayer('base_layer', this.tileset, 0, 0);
    }

    private setupEventListeners() {
        eventUtils.on(EVENTS.GAMEOVER, this.gameOver, this);
    }

    update(time: number, delta: number) { //delta ~16.66 @ 60fps
        if (!this.gameStarted) {
            this.gameStarted = true;
            eventUtils.emit(EVENTS.GAMESTART, true);
        }

        const {left, right, up, space} = this.cursors;


        if (left.isDown) {
            this.inputToggles.right = false;

            if (!this.inputToggles.left) {
                this.inputData.countLeft +=1;
                this.inputToggles.left = true;

            } else {
                this.inputData.timeLeft += delta;
            }

            this.player.setAngularVelocity(-150);
        } else if (right.isDown) {
            this.inputToggles.left = false;

            if(!this.inputToggles.right) {
                this.inputData.countRight +=1;
                this.inputToggles.right = true;
            } else {
                this.inputData.timeRight += delta;
            }

            this.player.setAngularVelocity(150);
        } else {
            this.inputToggles.left = false;
            this.inputToggles.right = false;
            this.player.setAngularVelocity(0);
        }

        if (up.isDown) {
            if (!this.inputToggles.up) {
                this.inputData.countUp +=1;
                this.inputToggles.up = true;
            } else {
                this.inputData.timeUp += delta;
            }
            this.physics.velocityFromRotation(this.player.rotation, 600, this.player.body.acceleration);
        } else {
            this.inputToggles.up = false;
            this.player.setAcceleration(0);

        }

        if (space.isDown) {
            if (!this.inputToggles.space) {
                this.inputData.countSpace += 1;
                this.inputToggles.space = true;
            } else {
                this.inputData.timeSpace += delta;
            }
            this.emitter.start();
            this.player.setMaxVelocity(1000);
        } else {
            this.inputToggles.space = false;
            this.emitter.stop();
            this.player.setMaxVelocity(600);
        }
    }

    private gameOver() {
        if (this.gameStarted) {
            this.gameStarted = false;

            var flowmanager = this.scene.get(SCENES.FLOWMANAGER) as SceneFlowManager;

            const {key, data} = flowmanager.getNextScene();

            let nextScene = this.scene.get(key);

            if (nextScene == undefined) {
                if (key == SCENES.GAMEOVER) {
                    var gameOverScene = new GameOverScene();
                    this.scene.add(key, gameOverScene, true);
                } else {
                    console.error("Scene is undefined - shit hit the fan");
                }
            }
            if (this.publishToggle) {
                this.publishData();
            }

            this.scene.start(key, data);

            this.scene.stop(SCENES.TRACKING);
            this.scene.stop(SCENES.HUD);
            this.scene.stop(SCENES.PLAY);
        }
    }


    private publishData() {
        var entry = {
            points: parseInt(this.registry.get(REGISTRY.SCORE)),
            name: localStorage.getItem(LOCALSTORAGE.USERNAME)
        }

        var cluster = this.registry.get(REGISTRY.CLUSTER);
        var clusterpoints = this.registry.get(REGISTRY.CLUSTERPOINTS);
        var clusters = [];
        for (let i = 0; i < cluster.length; i++) {
            cluster[i]
            clusters.push({points: cluster[i], score: clusterpoints[i]});
        }

        var playerData = {
            pathLength: (this.scene.get(SCENES.TRACKING) as TrackingScene).pathLength,
            clusterData: clusters,
            inputData: this.inputData
        }


        fetch(URLS.ADDRESULT, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "entry": entry,
                "playerData": playerData,
                "levelId": this.levelId,
            })
        }).then();
    }

    private setupDebugInput(help: Phaser.GameObjects.Text) {
        var layer = this.map;

        this.input.on('pointermove', function onPointerMove(pointer: any) {
            var tile = layer.getTileAtWorldXY(pointer.worldX, pointer.worldY, true);

            if (!tile) return;

            help.setText(tile.index).setPosition(tile.pixelX, tile.pixelY);
        });
    }
}
