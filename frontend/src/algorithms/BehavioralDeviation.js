import Algorithm from './Algorithm.js';
const stayWithUserPercentage = 0.33;
const maxTurns = 10;

export default class BehavioralDeviation extends Algorithm {
    constructor() {
        super();

        this.getAdvice = this.getAdvice.bind(this);
        this.hasUserLeft = false;
        this.lastAdvice = -1;
        this.withUserCounter =0;
    }

    update(machine, reward) {
        super.update(machine, reward);

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