class GameLogic {
    constructor() {

        this.agentAdvice = this.agentAdvice.bind(this);
        this.initGame = this.initGame.bind(this);

        this.session = {};
    }

    initGame(k, workerId) {
        // create session object
        this.session[workerId] = {};
        let machines_arr =
            [{
                "A": {p: 0.66, range: [0, 50]},
                "B": {p: 0.34, range: [50, 100]},
                "isPreferred": 1 // preferred machine
            },
            {
                "A": {p: 0.5, range: [0, 50]},
                "B": {p: 0.5, range: [50, 100]},
                "isPreferred": 0 // neutrally preferred
            },
            {
                "A": {p: 0.22, range: [0, 50]},
                "B": {p: 0.78, range: [50, 100]},
                "isPreferred": -1 // least preferred
            }];
        // this.session[workerId].arr = machines_arr.map(value => ({
        //     value,
        //     sort: Math.random()
        // })).sort((a, b) => a.sort - b.sort).map(({value}) => value)
        this.session[workerId].arr = machines_arr;
        return this.session[workerId].arr;
    }

    agentAdvice(workerId) {
        console.log(this.session);
        return this.session[workerId].bestMachine;
    }

    removeSession(workerId) {
        console.log(workerId, "was removed from session.")
        delete this.session[workerId];
    }
}

module.exports = new GameLogic();