import Algorithm from './Algorithm.js';

const maxTurns = 10;
const debug_prints = 0;
export default class BehavioralDeviation3Arms extends Algorithm {
    constructor(machines) {
        super(machines);

        this.getAdvice = this.getAdvice.bind(this);
        this.lastAdvice = 0;
        this.deviationCountdown = 0;
        this.deviatedState = false;

        this.nonPreferredArmPulled = false;
        this.preferredArmPulled = false;
        this.preferredArmIdx = 0;
        for (let i = 0; i < this.machines.length; i++) {
            if (this.machines[i].isPreferred === 1)
                this.preferredArmIdx = i;
        }
    }

    update(machine_idx, reward) {
        super.update(machine_idx, reward);
        if (this.machines[machine_idx].isPreferred === 1)
            this.preferredArmPulled = true;
        if (this.machines[machine_idx].isPreferred !== 1)
            this.nonPreferredArmPulled = true;
    }

    getAdvice() {
        if (debug_prints)
            console.log("getAdvice was called, machines = ", this.machines);

        let advice;
        let preferred_avg = 0;
        let highest_score_avg = 0;
        let highest_score_arm_idx = 0;
        let machineAvgs = Array(this.machines.length).fill(0);

        // if last turn, advice 0
        if (this.turn === 10) {
            return 1;
        }

        for (let i = 0; i < this.machines.length; i++) {
            machineAvgs[i] = (this.machinePicks[i] > 0) ? this.machineRewards[i] / this.machinePicks[i] : 0;
            if (this.machines[i].isPreferred === 1)
                preferred_avg = machineAvgs[i];
            if (machineAvgs[i] > highest_score_avg)
            {
                highest_score_arm_idx = i;
                highest_score_avg = machineAvgs[i];
            }
        }

        if (debug_prints) {
            console.log("Preferred machine = ", this.preferredArmIdx, " Highest score machine = ", highest_score_arm_idx);
            console.log("Preferred machine avg = ", preferred_avg, " Highest score machine avg = ", highest_score_avg);
        }

        if (!this.deviatedState) {
            if (debug_prints)
                console.log("not deviated state");
            if (this.nonPreferredArmPulled && this.preferredArmPulled && highest_score_avg > preferred_avg) {
                this.deviatedState = true;
                this.deviationCountdown = Math.floor(Math.sqrt(maxTurns - this.turn));
                if (debug_prints)
                    console.log("changing to deviated state, deviationCountdown = ", this.deviationCountdown);
            }
        } else {
            if (debug_prints)
                console.log("deviated state");
            this.deviationCountdown--;
            // check if we need to go back to normal
            if (this.lastUserPick !== this.lastAdvice) {
                if (debug_prints)
                    console.log("user didnt listen");
                // get out of deviated state
                this.deviatedState = false;
            }
            if (preferred_avg >= highest_score_avg) {
                if (debug_prints)
                    console.log("preferred have better average");
                // get out of deviated state
                this.deviatedState = false;
            }
            if (this.deviationCountdown === 0) {
                if (debug_prints)
                    console.log("deviation timeout reached");
                // get out of deviated state
                this.deviatedState = false;
            }
            if (!this.deviatedState && debug_prints)
                console.log("getting out of deviated state");
        }

        if (this.deviatedState)
            advice = highest_score_arm_idx;
        else
            advice = this.preferredArmIdx;


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