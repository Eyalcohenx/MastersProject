import Algorithm from './Algorithm.js';

const stayWithUserPercentage = 0.33;
const maxTurns = 10;
const debug_prints = 0;

export default class BehavioralDeviationV3 extends Algorithm {
    constructor(machines) {
        super(machines);

        this.getAdvice = this.getAdvice.bind(this);
        this.hasUserLeft = false;
        this.lastAdvice = -1;
        this.withUserCounter =0;
    }

    update(machine, reward) {
        if (debug_prints)
            console.log("BehavioralDeviationV3 update");
        super.update(machine, reward);

        let m0 = (this.machinePicks[0] > 0) ? this.machineRewards[0] / this.machinePicks[0] : 0;
        let m1 = (this.machinePicks[1] > 0) ? this.machineRewards[1] / this.machinePicks[1] : 0;

        let prevT = this.turn - 1;
        if (this.machinePicks[0] == 0) {
            if (debug_prints)
                console.log("machinePicks[0] == 0");
            this.withUserCounter = 0;
            return;
        }

        // advice 0 if average of m0 greater
        if (m0 >= m1) {
            if (debug_prints)
                console.log("m0 >= m1");
            this.withUserCounter = 0;
            return;
        }
        
        if (this.userChoices[prevT - 1]  == 0 && this.withUserCounter > 0) {
            this.withUserCounter = 0;
            return;
        }

        // otherwise, if m1 average is greater, do deviate
        if (debug_prints)
            console.log("hasUserLeft = " + this.hasUserLeft + " machine = " + machine + " lastAdvice = " + this.lastAdvice);
        if (!this.hasUserLeft && machine !== this.lastAdvice) {
            this.hasUserLeft = true;
            if (debug_prints)
                console.log("maxTurns = " + maxTurns + " t = " + this.turn + " stayWithUserPercentage = " + stayWithUserPercentage);
            this.withUserCounter = Math.floor((maxTurns - (this.turn - 1)) * stayWithUserPercentage);
            if (debug_prints)
                console.log("withUserCounter = " + this.withUserCounter);
            if (this.withUserCounter < 1) {
                this.withUserCounter = 1;
            }
        }
    }

    getAdvice() {
        let advice;
        
        // if last turn, advice 0
        if (this.turn == 10) {
            if (debug_prints)
                console.log("last advice");
            return 0;
        }

        if (this.withUserCounter > 0) {
            if (debug_prints)
                console.log("withUserCounter = " + this.withUserCounter + " advice 1");
            advice = 1;
            this.withUserCounter--;
        } else {
            if (debug_prints)
                console.log("advice 0");
            advice = 0;
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