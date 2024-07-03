import React, { Component } from 'react';
import '../App.css';
import {config} from '../config/config.js';
import {calculateTimeDifference} from '../utils/utils.js';
export default class WelcomeScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showConsent: (this.props.assignmentId !== config.NO_ASSIGNMENT_ID) ? true : false,
            disagree: false
        }
        this.startTime = 0;
    }
    render() {
        if (this.startTime === 0) {
            this.startTime = performance.now();
        } 

        if (this.state.disagree) {
            return (
                <h2>You chose to disagree with the terms, thus the experiment has ended. Thank you.</h2>
            )
        }

        if (this.state.showConsent) {
            return(
                <div id="consent">
                    <h3>Dear participant,</h3>
                    <p>Thank you for accepting this study. This study is being done by Prof. David Sarne and lab members from Bar-Ilan University.</p>
                    <p>The purpose of this research is to study human behavior. The time the experiment will take is specified in the study description.</p>
                    <p>You may not directly benefit from this research; however, we hope that your participation in the study will help in better understanding some aspects of human behavior, leading to the development of better and more effective tools and methods for humanity. Your responses in this study are anonymous.</p>
                    <p>We believe there are no known risks associated with this research study; however, as with any online related activity the risk of a breach of confidentiality is always possible.  To the best of our ability your answers in this study will remain confidential. We will minimize any risks by storing all data in a secured server. Furthermore, all results that will be reported based on the data collected in this study will be based on aggregation over users – no specific data of any single (anonymous) user will be disclosed whatsoever.</p>
                    <p>Your participation in this study is completely voluntary and you can withdraw at any time. There will be no penalty for withdrawal (though you will not complete and get paid).</p>
                    <p>We sincerely appreciate your consideration and participation in this study.</p>
                    <p>If you encounter any technical problem with the experiment, or have any questions or comments, please contact us by sending an email using the Prolific system.  If you have research-related questions or want clarification regarding this research and/or your participation, please contact Eyal Cohen at eyalcohen.biu@mail.com</p>
                    <p>By clicking “I agree” below you are indicating that you are at least 18 years old, have read and understood this consent form and agree to participate in this research study.  It is advised that you print a copy of this page for your records.</p>
                    <hr/>

                    <button className="agree" onClick={() => this.setState({showConsent: false})}>I Agree</button>
                    <button className="disagree" onClick={() => this.setState({disagree: true})}>I Disagree</button>
                </div>
            )
        } 

        if (!this.state.showConsent) {
            return (
                <div id="welcome">
                    <h1>Welcome !</h1>
                    <p>In this experiment we have three slot machines. Each machine, when activated, gives you a varying amount of virtual cents. Meaning that even if you choose the
                       same machine over and over again, each time it will provide a different prize. The three machines are different in the prizes they provide and one machine is better than the others (on average). Your job is to pick the machine to be used (to be activated) on each turn. For each virtual dollar you accumulate you will receive 3 real cents as a bonus.</p>
                    <p>You have 10 rounds, and in each round you will be asked to choose a machine to be activated as described above.</p>
                    <p>To assist you, there will be a helper that knows the average reward of each of the machines. On each round the helper will highlight the machine it believes you should choose. To be fully fair we disclose that <u>the helper benefits from one of the machines, and every time you choose to activate this machine (which identity we cannot disclose) the helper will gain a few cents (not at your expense).</u></p>
                    <p><b>This experiment has a potential to accumulate a high bonus payment. The experiment requires thinking before each decision, so if you just want to get the low reward guaranteed please do not waste your time on this experiment.</b></p>
                    <p>In order to complete this experiment you must fill the Questionnaire at the last page.</p>
                    <p>The time duration of this experiment is 25 minutes tops.</p>
                    {this.props.assignmentId !== config.NO_ASSIGNMENT_ID &&
                        <button onClick={(e)=> {
                            let diff = calculateTimeDifference(this.startTime, performance.now());
                            this.props.userStats.timeToReadInstructions = diff;
                            this.props.onEnd('welcome');
                        }
                        }>Next</button> }
                </div>
            );   
        }
    }
}