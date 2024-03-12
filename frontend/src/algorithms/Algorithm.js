export default class Algorithm {
    constructor(machines) {
        this.machineRewards = Array(machines.length).fill(0);
        this.machinePicks = Array(machines.length).fill(0);
        this.turn = 1;
        this.userChoices = [];
        this.update = this.update.bind(this);
        this.machines = machines;
        this.lastUserPick = 0;
    }

    // update by what player picked.
    update(machine_idx , reward) {
        this.machineRewards[machine_idx] += reward;
        this.machinePicks[machine_idx] += 1;
        this.userChoices.push(machine_idx);
        this.turn += 1;
        this.lastUserPick = machine_idx;
    }
}

