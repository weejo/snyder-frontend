import {SCENES} from "../../constants/scenes.ts";
import {TextField} from "../../containers/TextField.ts";
import {LOCALSTORAGE} from "../../constants/localstorage.ts";
import {QuestionButton} from "../../containers/QuestionButton.ts";
import {EVENTS} from "../../constants/events.ts";
import {SendSurveyButton} from "../../containers/SendSurveyButton.ts";
import eventUtils from "../../utils/eventUtils.ts";


export class QUESTION1 extends Phaser.Scene {

    buttonText: string;
    question1: QuestionButton[];
    question2: QuestionButton[];
    question3: QuestionButton[];
    data: any;

    question1_event: string;
    question2_event: string;
    question3_event: string;

    constructor() {
        super({
            key: SCENES.QUESTION1, active: false
        });
        this.buttonText = "";

        this.data = {answer1: "", answer2: "", answer3:""};

        this.question1_event = EVENTS.QUESTION1;
        this.question2_event = EVENTS.QUESTION2;
        this.question3_event = EVENTS.QUESTION3;
    }

    init(data: any) {
        this.buttonText = data.buttonText;
    }

    create() {
        //create images (z order)
        if (!this.scene.isActive(SCENES.MENUBACKGROUND)) {
            this.scene.launch(SCENES.MENUBACKGROUND); // Making fancy background FX
        }
        var username = localStorage.getItem(LOCALSTORAGE.USERNAME);

        new TextField(this, 2, username + ", how do you like the game so far?");

        this.question1 = [
            new QuestionButton(this, 3, 3, "It sucks", this.question1_event),
            new QuestionButton(this, 3, 5, "It's ok", this.question1_event),
            new QuestionButton(this, 3, 7, "Awesome", this.question1_event)
        ];


        new TextField(this, 4, "How do the controls feel?");
        this.question2 = [
            new QuestionButton(this, 3, 3, "Terrible", this.question2_event),
            new QuestionButton(this, 3, 5, "Ok", this.question2_event),
            new QuestionButton(this, 3, 7, "Awesome", this.question2_event)
        ]

        new TextField(this, 6, "Is the objective of the game clear?");
        this.question3 = [
            new QuestionButton(this, 3, 3, "No clue", this.question3_event),
            new QuestionButton(this, 3, 5, "Somewhat", this.question3_event),
            new QuestionButton(this, 3, 7, "100%", this.question3_event)
        ]

        new SendSurveyButton(this, 9, this.buttonText, this.data, 1);

        this.setupEventListeners();
    }

    private setupEventListeners() {
        eventUtils.on(this.question1_event, this.updateAnswer1, this);
        eventUtils.on(this.question2_event, this.updateAnswer2, this);
        eventUtils.on(this.question3_event, this.updateAnswer3, this);
    }

    private updateAnswer1(x_slot: number, content: string) {
        this.data.answer1 = content;
    }

    private updateAnswer2(x_slot: number, content: string) {
        this.data.answer2 = content;
    }

    private updateAnswer3(x_slot: number, content: string) {
        this.data.answer3 = content;
    }
}