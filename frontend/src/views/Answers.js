import React, { Component } from 'react';
import '../App.css';
import {config} from '../config/config.js';
import {centsToDollars} from '../utils/utils.js';

export default class Answers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            workerId: this.props.workerId,
            assignmentId: this.props.assignmentId,
            showForm: true
        }

        this.postResults = this.postResults.bind(this);
    }

    postResults() {
        if (Object.keys(this.state).length < 8) {
            alert("please fill all the questions.");
            return;
        }
        
        fetch(config.apiUrl + "postAnswers", {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          })
          .then((data) => data.json())
          .then((data) => {
              if (data.msg === "ok") {
                  this.setState({showForm: false});
              }
          })
          .catch((e) => console.log(e));
    }

    render() { 
        let finalReward = centsToDollars(this.props.reward);

        return (
            <div>
                {this.state.showForm && <form id="answers">
                    <h1>Questionnaire</h1>
                    <label>
                        <span>How helpful was the helper (1 - not at all, 5 - very much)?</span>
                        <select onChange={(e) => this.setState({q1: e.target.options[e.target.selectedIndex].value})}>
                            <option value={0}>-</option>                        
                            <option value={1}>1 not helpful at all</option>
                            <option value={2}>2 not very helpful</option>
                            <option value={3}>3 moderately helpful</option>
                            <option value={4}>4 helpful</option>
                            <option value={5}>5 very helpful</option>
                        </select>
                    </label>
                    <label>
                        <span>Are you happy/satisfied with the helper (1 - not at all, 5 - very much)?</span>
                        <select onChange={(e) => this.setState({q2: e.target.options[e.target.selectedIndex].value})}>
                            <option value={0}>-</option>                        
                            <option value={1}>1 not happy at all</option>
                            <option value={2}>2 not very happy</option>
                            <option value={3}>3 moderately happy</option>
                            <option value={4}>4 happy </option>
                            <option value={5}>5 very happy</option>
                        </select>
                    </label>
                    <label>
                        <span>Will you be interested in using the helper again in the future (1 - no way, 5 - sure will)?</span>
                        <select onChange={(e) => this.setState({q3: e.target.options[e.target.selectedIndex].value})}>
                            <option value={0}>-</option>                        
                            <option value={1}>1 not interested at all</option>
                            <option value={2}>2 not very interested</option>
                            <option value={3}>3 moderately interested</option>
                            <option value={4}>4 interested </option>
                            <option value={5}>5 very interested</option>
                        </select>
                    </label>
                    <label>
                        <span>Will you recommend the helper to a friend (1 - no way, 5 - sure will)?</span>
                        <select onChange={(e) => this.setState({q4: e.target.options[e.target.selectedIndex].value})}>
                            <option value={0}>-</option>                        
                            <option value={1}>1 no way</option>
                            <option value={2}>2 will think about it</option>
                            <option value={3}>3 moderately recommend</option>
                            <option value={4}>4 will recommend </option>
                            <option value={5}>5 surly will recommend</option>
                        </select>
                    </label>
                    <label>
                        <span>How much do you trust the helper (1 - absolutely don't, 5 - absolutely do)?</span>
                        <select onChange={(e) => this.setState({q5: e.target.options[e.target.selectedIndex].value})}>
                            <option value={0}>-</option>                        
                            <option value={1}>1 absolutely don't trust</option>
                            <option value={2}>2 not very trusting</option>
                            <option value={3}>3 moderately trust</option>
                            <option value={4}>4 trust </option>
                            <option value={5}>5 absolute trust</option>
                        </select>
                    </label>
                    <button onClick={(e)=> {
                        e.preventDefault();
                        this.postResults();
                    }}>Send</button>
                </form>}
                {!this.state.showForm && 
                <div id="endResults">
                    <h2>Thank you for participating.</h2>
                    <h2>You won {finalReward} virtual dollars.</h2>
                    {<h3>You will receive {Math.ceil(finalReward * 3)} real cents bonus.</h3>}
                    <h1>Your Prolific completion code is <strong>C18ODKPF</strong></h1>
                </div>
                }
            </div>
        ); 
    }
}