import Algorithm from './Algorithm.js';

export default class Naive0 extends Algorithm {
    constructor() {
        super();

        this.getAdvice = this.getAdvice.bind(this);
    }

    getAdvice() {
        return 0;
    }
}