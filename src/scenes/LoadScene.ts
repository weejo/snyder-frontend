import {SCENES} from "../constants/scenes.ts";
import {IMAGE} from "../constants/image.ts";
import {TILESET} from "../constants/tilesets.ts";
import {CONTENT} from "../constants/content.ts";


export class LoadScene extends Phaser.Scene {
    // overviewData!: any;

    constructor() {
        super({
            key: SCENES.LOAD
        })
    }

    loadImages() {
        this.load.setPath("./assets/image");

        for (let prop in IMAGE) {
            //@ts-ignore
            this.load.image(IMAGE[prop], IMAGE[prop]);
        }

    }

    loadTilesets() {
        this.load.setPath('./assets/tilesets');

        for (let prop in TILESET) {
            //@ts-ignore
            this.load.image(TILESET[prop], TILESET[prop])
        }
    }

    loadSprites(frameConfig?: Phaser.Types.Loader.FileTypes.ImageFrameConfig) {
        /* this.load.setPath("./assets/sprite");

         for(let prop in Scenes.SPRITE) {
             //@ts-ignore
             this.load.spritesheet(Scenes.SPRITE[prop], Scenes.SPRITE[prop], frameConfig);
         } */
    }

    preload() {
        //this.load.json('overviewData', Scenes.URLS.OVERVIEW);

        //load images, spritesheet, sounds
        this.loadImages();

        this.loadTilesets();

        this.loadSprites({
            frameHeight: 100,
            frameWidth: 100
        });

        //create loading bar
        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xffffff
            }
        })

        this.load.on("progress", (percent: number) => {
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
        })

    }

    create() {
        // this.overviewData = JSON.parse(JSON.stringify(this.cache.json.get('overviewData')));

        this.createAnims();
        this.scene.start(SCENES.INFOMENU, {contentKey: CONTENT.INFO, nextSceneKey: SCENES.MAINMENU, buttonText: "Continue"});
    }

    private createAnims() {
        /*   for(let prop in Scenes.SPRITE) {
               this.createAnimations(prop, Scenes.SPRITE[prop]);
           } */
    }

    private createAnimations(name: string, refString: string) {
        /*   this.anims.create({
               key: Scenes.SPRITE_ANIM[name],
               frames: this.anims.generateFrameNumbers(refString, { start: 0, end: 49 }),
               frameRate: 20,
               repeat: -1,
           }); */
    }
}