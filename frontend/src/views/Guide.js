import React, { Component } from 'react';
import '../App.css';
import guide from '../imgs/guide.png';
import { calculateTimeDifference } from '../utils/utils';

export default class Guide extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mode: "guide",
            tries: 1,
            cor: [2, 1, 2, 1]
        }

        this.startTime = 0;
    }

    checkQuiz(e) {
        let err = [];

        e.preventDefault();

        for (let i = 0; i < this.state.cor.length; ++i) {
            if (this.state["q" + (i + 1)] != this.state.cor[i]) {
                err.push(i + 1);
            }
        }

        if (err.length > 0) {
            let msg = "Answers to questions ";
            msg += err.join(",");
            msg += " are wrong - please try again."

            this.props.userStats.quizWrongTriesCounter += 1;

            this.setState({tries: this.state.tries + 1, msg: msg}, () => {
                // check for number of tries
                if (this.state.tries > 3) {
                    this.props.onEnd('error');
                } 
            });
            return;
        }

        // move to game if everything is ok.
        let diff = calculateTimeDifference(this.startTime, performance.now());
        this.props.userStats.timeToTakeQuiz = diff;

        console.log(this.props.userStats);
        this.props.onEnd('guide');
    }

    getAnswer(e) {
        let q = e.target.name;
        let a = e.target.value;

        let obj = {};
        obj[q] = a; 

        this.setState(obj);
    }
    render() { 
        if (this.state.mode === "quiz" && this.startTime === 0) {
            this.startTime = performance.now();
        }

        return (
            <div id="guide">
                {this.state.mode === "guide" &&
                <div>
                    <h1>Guide</h1>
                    <div id="info">
                        <img src={guide} />
                        <div>
                            <h2>Please Notice:</h2>
                            <ul>
                                <li>The average reward of each machine is pre-fixed and does not change between rounds.</li>
                                <li>Virtual dollars you gain will award you a bonus in this experiment (3 cents for each virtual dollar).</li>
                                <li>You do not have to follow the helper’s advice but do keep in mind it does know the winning probabilities of the different machines.</li>
                                <li>The Helper gets an award each time you pick a certain machine (pre-chosen).</li>
                                <li>The experiment terminates after 10 rounds.</li>
                            </ul>
                        </div>
                    </div>
                    <button onClick={(e) => this.setState({mode: "quiz"})}>Next</button>                
                </div>
                }
                {this.state.mode === "quiz" &&
                <form id="quiz">
                    <h1>Quiz</h1>
                    <p>To check whether you are ready to start, please answer the quiz below.</p>
                    <p>You are allowed to try answering correctly <b>3</b> times.</p>
                    <p>Status : {this.state.tries} / 3 attempts</p>
                    <label>
                        <span>1. How many turns will you play?</span>
                        <div><input type="radio" onChange={this.getAnswer.bind(this)} name="q1" value={0} />20</div>
                        <div><input type="radio" onChange={this.getAnswer.bind(this)} name="q1" value={1} />As many as I like</div>
                        <div><input type="radio" onChange={this.getAnswer.bind(this)} name="q1" value={2} />10</div>
                    </label>
                    <label>
                        <span>2. What does the helper know that you don't know?</span>
                        <div><input type="radio" onChange={this.getAnswer.bind(this)} name="q2" value={0} />When will the game end</div>
                        <div><input type="radio" onChange={this.getAnswer.bind(this)} name="q2" value={1} />The average of prizes awarded by each of the two machines</div>
                        <div><input type="radio" onChange={this.getAnswer.bind(this)} name="q2" value={2} />How much bonus I will get in this experiment</div>
                    </label>
                    <label>
                        <span>3. Will the helper benefit from the machine I choose?</span>
                        <div><input type="radio" onChange={this.getAnswer.bind(this)} name="q3" value={0} />No</div>
                        <div><input type="radio" onChange={this.getAnswer.bind(this)} name="q3" value={1} />Always</div>
                        <div><input type="radio" onChange={this.getAnswer.bind(this)} name="q3" value={2} />Only if I choose a specific machine (which identity I do not know)</div>
                    </label>
                    <label>
                        <span>4. What kind of participants do we want to participate in the game?</span>
                        <div><input type="radio" onChange={this.getAnswer.bind(this)} name="q4" value={0} />Anyone</div>
                        <div><input type="radio" onChange={this.getAnswer.bind(this)} name="q4" value={1} />Participants that seek a high bonus (they think before they act)</div>
                        <div><input type="radio" onChange={this.getAnswer.bind(this)} name="q4" value={2} />Participants that want to gain the low reward</div>
                    </label>
                    <span id="result">{this.state.msg}</span>
                    <button onClick={this.checkQuiz.bind(this)}>Start</button>                
                </form>
                }
            </div>
        ); 
    }
}