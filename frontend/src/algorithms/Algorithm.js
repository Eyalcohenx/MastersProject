export default class Algorithm {
    constructor() {
        this.machineRewards = [0, 0];
        this.machinePicks = [0, 0];
        this.t = 1;
        this.userChoices = [];
        this.update = this.update.bind(this);
    }

    // update by what player picked.
    update(machine , reward) {
        this.machineRewards[machine] += reward;
        this.machinePicks[machine] += 1;
        this.userChoices.push(machine);
        this.t += 1;
    }
}

