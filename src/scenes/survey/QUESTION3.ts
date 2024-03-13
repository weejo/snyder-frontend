import {SCENES} from "../../constants/scenes.ts";
import {TextField} from "../../containers/TextField.ts";
import {QuestionButton} from "../../containers/QuestionButton.ts";
import {EVENTS} from "../../constants/events.ts";
import {SendSurveyButton} from "../../containers/SendSurveyButton.ts";
import eventUtils from "../../utils/eventUtils.ts";


export class QUESTION3 extends Phaser.Scene {

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
            key: SCENES.QUESTION3, active: false
        });
        this.buttonText = "";

        this.data = {answer1: "", answer2: "", answer3: ""};

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

        new TextField(this, 2, "Did it feel easier without getting killed on black fields?");

        this.question1 = [

            new QuestionButton(this, 3, 3, "Yes", this.question1_event),
            new QuestionButton(this, 3, 5, "Somewhat", this.question1_event),
            new QuestionButton(this, 3, 7, "Nope", this.question1_event),
        ];


        new TextField(this, 4, "Was the time sufficient?");
        this.question2 = [
            new QuestionButton(this, 3, 3, "Yes", this.question2_event),
            new QuestionButton(this, 3, 5, "Somewhat", this.question2_event),
            new QuestionButton(this, 3, 7, "Nope", this.question2_event)
        ]

        new TextField(this, 6, "Did you manage to score more points than before?");
        this.question3 = [
            new QuestionButton(this, 3, 3, "Yes", this.question3_event),
            new QuestionButton(this, 3, 5, "No clue", this.question3_event),
            new QuestionButton(this, 3, 7, "Nope", this.question3_event)
        ]

        new SendSurveyButton(this, 9, this.buttonText, this.data, 3);

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