import Algorithm from './Algorithm.js';

const stayWithUserPercentage = 0.33;
const maxTurns = 10;

export default class BehavioralDeviationV2 extends Algorithm {
    constructor() {
        super();

        this.getAdvice = this.getAdvice.bind(this);
        this.hasUserLeft = false;
        this.lastAdvice = -1;
        this.withUserCounter =0;
    }

    update(machine, reward) {
        super.update(machine, reward);

        let m0 = this.machineRewards[0] / this.machinePicks[0];
        let m1 = this.machineRewards[1] / this.machinePicks[1];

        // advice 0 if average of m0 greater
        if (m0 >= m1) {
            this.withUserCounter = 0;
            return;
        }

        // otherwise, if m1 average is greater, do deviate only one time
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
            return 0;
        }

        if (this.withUserCounter > 0) {
            advice = 1;
            this.withUserCounter--;
        } else {
            advice = 0;
        }

        this.lastAdvice = advice;
        return advice;
    }
}