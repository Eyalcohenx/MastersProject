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
        if (this.startTime == 0) {
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
                    <p>Thank you for accepting this HIT. This study is being done by Prof. David Sarne and lab members from Bar-Ilan University.</p>
                    <p>The purpose of this research is to study human behavior. The time the experiment will take is specified in the HIT description.</p>
                    <p>You may not directly benefit from this research; however, we hope that your participation in the study will help in better understanding some aspects of human behavior, leading to the development of better and more effective tools and methods for humanity. Your responses in this study are anonymous.</p>
                    <p>We believe there are no known risks associated with this research study; however, as with any online related activity the risk of a breach of confidentiality is always possible.  To the best of our ability your answers in this study will remain confidential. We will minimize any risks by storing all data in a secured server. Furthermore, all results that will be reported based on the data collected in this study will be based on aggregation over users – no specific data of any single (anonymous) user will be disclosed whatsoever.</p>
                    <p>Your participation in this study is completely voluntary and you can withdraw at any time. There will be no penalty for withdrawal (though you will not complete the HIT and get paid).</p>
                    <p>We sincerely appreciate your consideration and participation in this study.</p>
                    <p>If you encounter any technical problem with the HIT, or have any questions or comments, please contact us by sending an email using the AMT system.  If you have research-related questions or want clarification regarding this research and/or your participation, please contact Prof. David Sarne at david.sarne@biu.ac.il</p>
                    <p>By clicking “I agree” below you are indicating that you are at least 18 years old, have read and understood this consent form and agree to participate in this research study.  It is adviced that you print a copy of this page for your records.</p>
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
                    <p>In this HIT we have two slot machines. Each machine, when activated, gives you a varying amount of virtual cents. Meaning that even if you chose the
                       same machine over and over again, each time it will provide a different prize. The two machines are different in the prizes they provide and one machine is better than the other (on average). Your job is to pick the machine to be used (activated) on each turn. After each turn we will roll two dices and continue for an additional turn as long as the dices don’t both show “6”. For each virtual dollar you accumulate you will receive 10 real cent as a bonus.</p>
                    <p>To assist you, there will be a helper that knows the average reward of each of the two machines. On each round the helper will highlight the machine she believes you should choose. To be fully fair we disclose that <u>the helper benefits from one of the machines, and every time you pick this machine (which identity we cannot disclose) the helper will gain few cent (not at your expense).</u></p>
                    <p><b>This HIT is a potentially high accumulated bonus payment HIT. The HIT requires thinking before each decision, so if you just want to get the low reward guaranteed please do not waste your time on this HIT.</b></p>
                    {/* <p>In order to complete this HIT you must perform the Replay mode at the end of the HIT. In this mode, you will have to explain - in a few words, each decision you took at each round.</p> */}
                    <p>In order to complete this HIT you must fill the Questionnaire at the end of the HIT.</p>
                    <p>The time duration of this HIT is 10 minutes top.</p>
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