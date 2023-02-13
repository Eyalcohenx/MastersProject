class GameLogic {
    constructor() {

        this.agentAdvice = this.agentAdvice.bind(this);
        this.initGame = this.initGame.bind(this);

        this.session = {};
    }

    initGame(k, workerId) {
        // create session object
        this.session[workerId] = {};
        this.session[workerId].arr = [{
            "A": {p: 0.7, range: [0, 50]},
            "B": {p: 0.3, range: [50, 100]}
        }, 
        {
            "A": {p: 0.4, range: [0, 50]},
            "B": {p: 0.6, range: [50, 100]}
        }];

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