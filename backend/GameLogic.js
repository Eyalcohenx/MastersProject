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
                "A": {p: 0.6, range: [0, 50]},
                "B": {p: 0.4, range: [50, 100]},
                "isPreferred": 1 // preferred machine also weakest
            },
            {
                "A": {p: 0.5, range: [0, 50]},
                "B": {p: 0.5, range: [50, 100]},
                "isPreferred": 0 // neutrally preferred
            },
            {
                "A": {p: 0.3, range: [0, 50]},
                "B": {p: 0.7, range: [50, 100]},
                "isPreferred": -1 // least preferred also strongest
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