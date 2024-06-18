import React, { Component } from 'react';
import '../App.css';
import machinePng from "../imgs/slot_machine.png";//'../imgs/machine.png';
import spinner from '../imgs/spinner.gif';
import {config} from '../config/config.js';
import {centsToDollars} from '../utils/utils.js';
export default class Replay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currIdx: 0,
            answers: [],
            roundCounter: 1,
            reward: 0,
            review: true,
            currAnswer: "",
            loadMsg: ""
        }

        this.statistics = [];

        for (let i = 0; i < this.props.machines.length; ++i) {
            this.statistics[i] = {win: 0, overall: 0}
        }
    }

    saveAnswer(e, currChoice, currReward) {
        let words = this.state.currAnswer.split(' ').length;
        if (words < 5) {
            e.preventDefault();
            alert("Please elaborate your choice.");
            return;
        }

        if (this.state.answers.includes(this.state.currAnswer)) {
            e.preventDefault();
            alert("You already provided this answer.");
            return;
        }
        
        this.setState({loadMsg: "Saving..."}, () => {
            console.log(this.statistics, currChoice);
            this.statistics[currChoice].win += currReward;
            this.statistics[currChoice].overall += 1;

            setTimeout(() => {
                this.setState({
                    currIdx: this.state.currIdx + 1,
                    loadMsg: "",
                    reward: this.state.reward + currReward,
                    roundCounter: this.state.roundCounter + 1,
                    answers: this.state.answers.concat([this.state.currAnswer]),
                    currAnswer: ""
                }, () => console.log(this.state.answers));
            }, 700);
        })
    }

    postResults() {     
        let obj = {
            workerId: this.props.workerId,
            assignmentId: this.props.assignmentId,
            answers: this.state.answers
        }   
        fetch(config.apiUrl + "postReplay", {
            method: 'POST',
            body: JSON.stringify(obj),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          })
          .then((data) => data.json())
          .then((data) => {
              console.log(data);
          })
          .catch((e) => console.log(e));
    }

    render() {
        let machines = this.props.machines;

        let currAdvice = this.props.replayBuffer.advices[this.state.currIdx];
        let currReward = this.props.replayBuffer.results[this.state.currIdx];
        let currChoice = this.props.replayBuffer.choices[this.state.currIdx];

        if (this.state.review) {
            return(
                <div id="gui">
                <h2 id="reviewHeader">Unfortunately, the recent dice rolling ended in 6/6, so we need to stop. Please review your results. Press the button to continue.</h2>
                <div id="container">
                    <ul id="machines">
                                {
                                    machines.map((machine, i) => {
                                        return (
                                            <li key={'l' + i}>
                                                <h2>Machine {i + 1}</h2>
                                                <img src={machinePng} alt="machine" />
                                            </li>
                                        );
                                    })    
                                } 
                            </ul>
                            <h2 className="message">Accumulated reward: {this.props.replayBuffer.final} cents</h2>
                            <button className="replayButton" onClick={(e) => this.setState({review: false, instructions: true})}>To Replay Mode</button>
                    </div>
            </div>
            )
        }

        if (this.state.instructions) {
            return (
                <div id="gui">
                    <h2>Instructions to replay mode</h2>
                    <p>We would like you to briefly explain your decisions as reflected in the choices you made. Please explain in a few words what made you choose the machine you chose on each stage.</p>

                    <button className="replayButton" onClick={(e) => this.setState({instructions: false})}>
                        Start
                    </button>
                </div>
            )
        }
        
        if (this.state.loadMsg) {
            return (
                <div id="gui">
                    <h1>{this.state.loadMsg}</h1>
                    <img src={spinner} alt="loading"/>
                </div>
            )
        }

        if (this.state.currIdx < this.props.replayBuffer.numOfRounds) {
            return (
                <div id="gui" className="replay">
                    <h2>Replay Mode</h2>
                    <div id="container">
                        <ul id="machines">
                            {
                                machines.map((machine, i) => {
                                    let advice = (currAdvice == i) ? 'advice' : '';
                                    let avgWin = this.statistics[i].win / this.statistics[i].overall;

                                    return (
                                        <li key={'l' + i} className={advice}>
                                            <h2>Machine {i + 1}</h2>
                                            {advice == 'advice' && <h3>Helper's recommendation</h3>}
                                                <img src={machinePng} alt="machine"/>
                                            <div>
                                            {this.statistics[i].overall == 0  && <h4>Hasn’t been picked yet</h4>}
                                            {this.statistics[i].overall > 0 && <h4>Won {!avgWin ? 0 : avgWin.toFixed(0)} cents per-pick on average in {this.statistics[i].overall} picks so far</h4>}
                                            </div>
                                        </li>
                                    );
                                })    
                            } 
                        </ul>
                        <h2 className="message">Accumulated reward: {this.state.reward} </h2>
                        <h2 className="message">Round #{this.state.roundCounter}</h2>
                    </div>
                    <div id="answerBox">
                            <h3>You chose machine number {currChoice + 1}</h3>
                            {currAdvice === currChoice && <h3>You chose <span class="adopt">to adopt</span> the helper's advice.</h3>}
                            {currAdvice !== currChoice && <h3>You chose <span class="noAdopt">not to adopt</span> the helper's advice.</h3>}
                            <h4>Please elaborate on your choice (at least 5 words):</h4>
                            <textarea onChange={(e) => this.setState({currAnswer: e.target.value})}></textarea>
                            <button id="nextReplay" onClick={(e)=> this.saveAnswer(e, currChoice, currReward)}>Save and Continue</button>
                    </div>
                </div>
            )
        } else {
            // end of game
            let finalReward = centsToDollars(this.state.reward);

            this.postResults();
            return(
                <div id="endResults">
                    <h2>Thank you for participating.</h2>
                    <h2>You won {finalReward} virtual dollars.</h2>
                    {(finalReward >= 6) &&  <h3>You will receive {finalReward * 10} real cents bonus.</h3>}
                    {(finalReward < 6) &&  <h3>You will receive 60 real cents bonus.</h3>}
                    <form id="hiddenForm" method="POST" action={config.ProlificRedirectURL}>
                        <input type="hidden" value={this.props.assignmentId} name="assignmentId"/>
                        <input type="hidden" value={this.props.workerId} name="workerId"/>
                        <input className="replayButton" type="submit" value="Finish !" />
                    </form>
                </div>
            )
        }
    }   
}