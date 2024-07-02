import React, { Component } from 'react';
import '../App.css';
import machinePng from "../imgs/slot_machine.png";//'../imgs/machine.png';
import spinner from '../imgs/spinner.gif';
import jackpot from '../imgs/jackpot.png';
import nomoney from '../imgs/nomoney.png';
import dice from '../imgs/dice.gif';
import Answers from './Answers.js';
import {config} from '../config/config.js';
import { calculateTimeDifference } from '../utils/utils';
import Replay from './Replay';
import BehavioralDeviation3Arms from "../algorithms/BehavioralDeviation3Arms";
import BehavioralDeviationV3 from "../algorithms/BehavioralDeviationV3";

const MAX_ROUNDS = 10;

export default class Game extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reward: 0,
            advice: null,
            msg: "",
            isGambling: false,
            end: false,
            roundCounter: 1
        }

        this.adviceAlgo = new BehavioralDeviationV3(this.props.machines);
        this.playRound = this.playRound.bind(this);
        this.choices = [];
        this.results = [];
        this.advices = [];
        this.statistics = {};
        this.prevTime = performance.now();

        for (let i = 0; i < this.props.machines.length; ++i) {
            this.statistics[i] = {win: 0, overall: 0}
        }

        this.diceA = null;
        this.diceB = null;
    }
    componentWillMount() {
        this.setState({advice: this.getAgentAdvice()});
    }

    getAgentAdvice() {
        let advice = this.adviceAlgo.getAdvice();
        this.advices.push(advice);
        return advice;
    }

    getWinValue(probs) {
        let p = Math.random();
        let mass;
        // mass A 0 - 50
        if (p < probs.A.p) {
            mass = "A";
        } else {
            mass = "B";
        }

        let range = probs[mass].range;
        // console.log("range is ", range);

        return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    }

    playRound(index) {
        let probs = this.props.machines[index];
        // console.log("probs are ", probs);

        // prevent user clicking while gambling
        if (this.state.isGambling || this.state.dice) return;

        this.choices.push(index);
        let diff = calculateTimeDifference(this.prevTime, performance.now());
        this.props.userStats.answerTimePerRound.push(diff);

        this.setState({isGambling: true, msg: "", advice: null, currMachine: index} ,() => {
            setTimeout(()=> {
                let val = this.getWinValue(probs);
                console.log("value is ", val);
                this.setState({
                    reward: this.state.reward + val,
                    msg: "You won: " + val + " virtual cents"
                });
                this.results.push(val);
                this.statistics[index].win += val;
                this.statistics[index].overall += 1;
                this.adviceAlgo.update(index, val);
            }, 1000);
        });
    }
    isGameOver() {
        if (this.state.roundCounter > 3) {
            if (this.state.roundCounter > MAX_ROUNDS) {
                this.setState({end: true, dice: false}, () => {
                    this.props.postResults(this.choices, this.advices, this.state.reward, this.results);
                })
            } 
        }

        // for the purpose of rolling the dices
        setTimeout(()=> {
            this.setState({showDiceMsg: true});
        }, 1500);
    }

    render() {
        let machines = this.props.machines;
        let blurClass = (this.state.isGambling) ? 'blur-filter':'';

        if (!this.state.end) {
            return (
                <div id="gui">
                    <h2>Click on the machine you want to activate</h2>
                    <div id="container">
                    {this.state.dice && <div id="dice">
                            {!this.state.showDiceMsg && <img src={dice} />}
                            {this.state.showDiceMsg && 
                                <div>
                                    <h2 className="message wheelMessage">Let's play another round</h2>
                                    <button onClick={()=>{
                                        this.prevTime = performance.now();
                                        this.setState({dice: false, showDiceMsg: false, advice: this.getAgentAdvice()});
                                    }}>Continue</button>
                                </div> 
                            }
                        </div>}
                        <ul id="machines">
                            {
                                machines.map((machine, i) => {
                                    let advice = (this.state.advice === i) ? 'advice' : '';
                                    let avgWin = this.statistics[i].win / this.statistics[i].overall;

                                    return (
                                        <li key={'l' + i} className={advice}>
                                            <h2>Machine {i + 1}</h2>
                                            {advice === 'advice' && <h3>Helper's recommendation</h3>}
                                                <img className={blurClass} src={machinePng} alt="machine" onClick={(e) => {
                                                        this.playRound(i);
                                                }}/>
                                            <div>
                                                {this.statistics[i].overall === 0  && <h4>Hasn’t been picked yet</h4>}
                                                {this.statistics[i].overall > 0 && <h4>Won {!avgWin ? 0 : avgWin.toFixed(0)} cents per-pick on average in {this.statistics[i].overall} picks so far</h4>}
                                            </div>
                                            {this.state.isGambling && this.state.currMachine === i &&
                                                <div id="animate">
                                                    {!this.state.msg && <img src={spinner} alt="animate" />}
                                                    {this.state.msg.includes("won") && <img src={jackpot} alt='results'/>}
                                                    <h2 className="message">{this.state.msg} </h2>
                                                    {this.state.msg && <button onClick={() => this.setState({
                                                                isGambling: false, 
                                                                dice: true,
                                                                roundCounter: this.state.roundCounter + 1},
                                                                this.isGameOver.bind(this))}>Next</button>}
                                                </div>
                                            }
                                        </li>
                                    );
                                })    
                            } 
                        </ul>
                        <h2 className="message">Accumulated reward: {this.state.reward} cents</h2>
                        <h2 className="message">Round #{this.state.roundCounter}</h2>
                    </div>
                </div>
            )
        } else {
            return(
                <Answers reward={this.state.reward}
                         workerId={this.props.workerId}
                         assignmentId={this.props.assignmentId}/>
            )
            // let replayBuffer = {
            //     choices: this.choices,
            //     results: this.results,
            //     advices: this.advices,
            //     average: [this.statistics[0].win / this.statistics[0].overall,
            //     this.statistics[1].win / this.statistics[1].overall],
            //     final: this.state.reward,
            //     numOfRounds: this.state.roundCounter - 1,
            // }
            // return(
            //     <Replay replayBuffer={replayBuffer} machines={machines}
            //     workerId={this.props.workerId} assignmentId={this.props.assignmentId}/>
            // )
        }
    }   
}

