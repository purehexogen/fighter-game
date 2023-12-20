export default function throttle(cb, delay = 250) {
    let shouldWait = false;

    return (...args) => {
        if (shouldWait) return;

        cb(...args);
        shouldWait = true;
        setTimeout(() => {
            shouldWait = false;
        }, delay);
    };
}
