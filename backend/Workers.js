var fs = require("fs");

const workersDbPath='./workers.csv'

class Workers {
    constructor() {
        let raw = fs.readFileSync(workersDbPath).toString();
        this.workers = raw.split(",\n");
        this.workers.pop();

        console.log(this.workers);
    }

    isWorkerExist(workerId) {
        let res = this.workers.indexOf(workerId) > -1;

        if (!res) {
            this.workers.push(workerId);
            fs.appendFileSync(workersDbPath, workerId + ",\n");
        } 

        return res;
    }
}

module.exports = new Workers();