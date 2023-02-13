import Algorithm from './Algorithm.js';
const algorithmConfig = require('../config/algorithm.json');
const probsVectors = require('./vectors.json');

export default class EpsilonGreedy extends Algorithm{
    constructor() {
        super();
        this.eps = algorithmConfig.eps;
        this.type = algorithmConfig.type;
        this.exploration = algorithmConfig.exploration;
        this.gamma = algorithmConfig.gamma;

        if (this.type == "eg_biased") {
            this.getAdvice = this.BiasedEpsilonGreedy.bind(this);
        }  else if (this.type == "ieg") {
            this.getAdvice = this.InverseEpsilonGreedy.bind(this);
        }

        let k = Math.floor(Math.random() * 50);
        this.probability = probsVectors[k.toString()];
    }

    getProbability(t = null) {
        // return Math.random()
        return this.probability[t];
    }

    BiasedEpsilonGreedy() {
        let prob = Math.random();
        console.log('p=',prob);

        if (prob <= this.eps) {
            // explore randomly
            console.log('agent explore')
            return this.exploreStrategy();
        } else {
            // advice agent machine
            console.log('agent exploit')
            return 0;
        }
    }
    argmax(arr) {
        let best = 0;
        let tmp = arr[0];

        for (let i = 1; i < this.arr.length; ++i) {
            if (tmp <= arr[i]) {
                best = i;
                tmp = arr[i];
            }
        }

        return best;
    }

    exploreStrategy() {
        if (this.exploration == 'avg_best') {
            return this.argmax(this.machineRewards);
        }

        if (this.exploration == 'true_best') {
            return 1;
        }

        if (this.exploration == 'random') {
            return  Math.floor(Math.random() * (2));
        }
    }

    InverseEpsilonGreedy() {
        let prob = this.getProbability(this.t - 1);
        let eps = this.eps * Math.pow(this.gamma, this.t - 1);

        if (prob <= eps) {
            return this.exploreStrategy();
        } else {
            // advice agent machine
            return 0;
        }
    }
}

/*

    for inverse :
        1. can increase the gamma factor by the (1 - agent usage).
        2. consider parameter free eps greedy.
*/

// const e = new EpsilonGreedy();

// console.log(algorithmConfig)

// for (let i = 0; i < 10; ++i) {
//     let a = e.getAdvice();

//     let c = Math.floor(Math.random() * 2);
//     let r = Math.floor(Math.random() * 100);

//     console.log('a=',a, 'c=',c, 'r=', r);
//     e.update(c, r);
// }
