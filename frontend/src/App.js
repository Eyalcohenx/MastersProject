import React, { Component } from 'react';
import './App.css';
import Game from './views/Game.js';
import WelcomeScreen from './views/WelcomeScreen.js';
import Guide from './views/Guide.js';
import {config} from './config/config.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.wasFetched = false;

    this.state =  {
      currScreen: "welcome",
    }

    this.userStats = {
      timeToReadInstructions: 0,
      timeToTakeQuiz: 0,
      quizWrongTriesCounter: 0,
      answerTimePerRound: []
    }

    this.mobileDetection = this.mobileDetection.bind(this);
  }

  componentWillMount() {
    // read worker's parameters
    const urlParams = new URLSearchParams(window.location.search);
    const workerId = urlParams.get('PROLIFIC_PID');
    const assignmentId = urlParams.get('STUDY_ID');
    const hitId = urlParams.get('SESSION_ID');

    this.setState({
      workerId: workerId,
      assignmentId: assignmentId,
      hitId: hitId,
      data: ""
    });

    if ((assignmentId !== config.NO_ASSIGNMENT_ID) && (!this.wasFetched)) {
      this.wasFetched = true;
      fetch(config.apiUrl + "getDistributions?workerId=" + workerId)
      .then((response) => response.json())
      .then((data) => {
        if (data.repeatedWorker === true) {
          this.setState({repeatedWorker: true})
        } else {
          this.setState({machines: data.machines})
        }
      })
      .catch((err) => console.log(err)); 
    }
  }

  nextScreen(prevScreen) {
    if (prevScreen === "welcome") {
      this.setState({currScreen: "guide"});
    } else if (prevScreen === "guide") {
      this.setState({currScreen: "game"});
    } else if (prevScreen === "error") {
      this.setState({currScreen: "error"});
    }
  }

  mobileDetection() {
      var check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
  }

  postResults(choices, advice, reward, results) {
    let obj = {
      workerId: this.state.workerId,
      assignmentId: this.state.assignmentId,
      hitId: this.state.hitId,
      advice: advice,
      choices: choices,
      reward: reward,
      results: results,
      userStats: this.userStats
    }

    fetch(config.apiUrl + "postResults", {
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((data) => data.json())
    .then((data) => console.log(data))
    .catch((e) => console.log(e));
  }

  render() {
    // check if mobile agent
    if (this.mobileDetection()) {
      return (
        <div>
          <h2>
            No mobile allowed.
            Thanks.
          </h2>
        </div>
      );
    }

    // check if repeated worker
    if (this.state.repeatedWorker) {
      return (
        <div>
          <h2>
            You have already participated in this HIT.
            Thanks.
          </h2>
        </div>
      );
    }

    return (
      <div className="App">
        {this.state.currScreen === "welcome" && <WelcomeScreen userStats={this.userStats} assignmentId={this.state.assignmentId} onEnd={this.nextScreen.bind(this)} />}
        {this.state.currScreen === "game" && <Game userStats={this.userStats} assignmentId={this.state.assignmentId}
                                             postResults={this.postResults.bind(this)} workerId={this.state.workerId} machines={this.state.machines} />}
        {this.state.currScreen === "guide" && <Guide userStats={this.userStats} onEnd={this.nextScreen.bind(this)} />}
        {this.state.currScreen === "error" && <h2>Seems like you do not properly understand the HIT instructions, so we cannot qualify you to participate in this HIT. Thank you.</h2>}
      </div>
    );
  }
}

export default App;
