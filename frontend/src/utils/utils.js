export function calculateTimeDifference(time1, time2) {
    let diff = time2 - time1;
    // to seconds
    diff /= 1000;

    return diff.toFixed(4);
}

export function centsToDollars(cents) {
    return (cents / 100).toFixed(2);
}