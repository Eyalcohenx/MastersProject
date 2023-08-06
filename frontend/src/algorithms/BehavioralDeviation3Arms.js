import Algorithm from './Algorithm.js';

const stayWithUserPercentage = 0.33;
const maxTurns = 10;

export default class BehavioralDeviation3Arms extends Algorithm {
    constructor() {
        super();

        this.getAdvice = this.getAdvice.bind(this);
        this.hasUserLeft = false;
        this.lastAdvice = -1;
        this.withUserCounter =0;
    }

    update(machine, reward) {
        super.update(machine, reward);

        let m0 = (this.machinePicks[0] > 0) ? this.machineRewards[0] / this.machinePicks[0] : 0;
        let m1 = (this.machinePicks[1] > 0) ? this.machineRewards[1] / this.machinePicks[1] : 0;

        let prevT = this.t - 1;
        if (this.machinePicks[1] == 0) {
            this.withUserCounter = 0;
            return;
        }

        // advice 1 if average of m1 greater
        if (m0 <= m1) {
            this.withUserCounter = 0;
            return;
        }
        
        if (this.userChoices[prevT - 1]  == 1 && this.withUserCounter > 0) {
            this.withUserCounter = 0;
            return;
        }

        // otherwise, if m0 average is greater, do deviate only one time
        if (!this.hasUserLeft && machine !== this.lastAdvice) {
            this.hasUserLeft = true;
            this.withUserCounter = Math.floor((maxTurns - (this.t - 1)) * stayWithUserPercentage);
            if (this.withUserCounter < 1) {
                this.withUserCounter = 1;
            }
        }
    }

    getAdvice() {
        let advice;
        
        // if last turn, advice 0
        if (this.t == 10) {
            return 1;
        }

        if (this.withUserCounter > 0) {
            advice = 0;
            this.withUserCounter--;
        } else {
            advice = 1;
        }

        this.lastAdvice = advice;
        return advice;
    }
}

// const e = new BehavioralDeviationV3();
// let choices = [0, 0, 1, 1, 0, 0, 1, 1, 0, 0];
// let rewards = [3, 4, 5, 1, 0, 0, 2, 4, 0, 0]
// let advices = [];

// for (let i = 0; i < 10; ++i) {
//     let a = e.getAdvice();
//     advices.push(a);
//     let c = choices[i];
//     let r = rewards[i];

//     e.update(c, r);
// }

// console.log(choices);
// console.log(rewards)
// console.log(advices);