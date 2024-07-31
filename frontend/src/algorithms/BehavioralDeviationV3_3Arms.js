import Algorithm from './Algorithm.js';

const stayWithUserPercentage = 0.33;
const maxTurns = 10;
const debug_prints = 0;

export default class BehavioralDeviationV3_3Arms extends Algorithm {
    constructor(machines) {
        super(machines);

        this.getAdvice = this.getAdvice.bind(this);
        this.hasUserLeft = false;
        this.lastAdvice = -1;
        this.withUserCounter =0;
        this.withUserAdvice = -1;
    }

    update(machine, reward) {
        if (debug_prints)
            console.log("BehavioralDeviationV3_3Arms update");
        super.update(machine, reward);

        let m0 = (this.machinePicks[0] > 0) ? this.machineRewards[0] / this.machinePicks[0] : 0;
        let m1 = (this.machinePicks[1] > 0) ? this.machineRewards[1] / this.machinePicks[1] : 0;
        let m2 = (this.machinePicks[2] > 0) ? this.machineRewards[2] / this.machinePicks[2] : 0;

        let prevT = this.turn - 1;
        if (this.machinePicks[0] == 0) {
            if (debug_prints)
                console.log("machinePicks[0] == 0");
            this.withUserCounter = 0;
            return;
        }

        // advice 0 if average of m0 greater than m1 and m2
        if (m0 >= m1 && m0 >= m2) {
            if (debug_prints)
                console.log("m0 >= m1 && m0 >= m2");
            this.withUserCounter = 0;
            return;
        }

        if (debug_prints)
            console.log("prevT = " + prevT + " userChoices = " + this.userChoices + " lastAdvice = " + this.lastAdvice + " withUserCounter = " + this.withUserCounter);
        if (this.userChoices[prevT - 1] != this.lastAdvice && this.withUserCounter > 0) {
            this.withUserCounter = 0;
            if (debug_prints)
                console.log("user chose " + this.userChoices[prevT - 1] + " getting out of deviation state");
            return;
        }

        // otherwise, if m1 average is greater or m2 average is greater and last pick wasn't last advice, go into deviation state
        if (debug_prints)
            console.log("hasUserLeft = " + this.hasUserLeft + " machine = " + machine + " lastAdvice = " + this.lastAdvice);
        if (!this.hasUserLeft && machine !== this.lastAdvice) {
            this.hasUserLeft = true;
            if (debug_prints)
                console.log("maxTurns = " + maxTurns + " t = " + this.turn + " stayWithUserPercentage = " + stayWithUserPercentage);
            this.withUserCounter = Math.floor((maxTurns - (this.turn - 1)) * stayWithUserPercentage);
            this.withUserAdvice = (m1 > m2) ? 1 : 2;
            if (debug_prints)
                console.log("withUserCounter = " + this.withUserCounter, "withUserAdvice = " + this.withUserAdvice);
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
            advice = this.withUserAdvice;
            if (debug_prints)
                console.log("withUserCounter = " + this.withUserCounter + " advice = " + advice);
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
