export class Timer 
{
    timeoutId?: number

    constructor()
    {
    }

    start(callback: Function, durationInMs: number, ...args: any[]) {
        clearTimeout(this.timeoutId)
        this.timeoutId = setTimeout(
            callback,
            durationInMs,
            ...args
        )
    }

    stop() {
        clearTimeout(this.timeoutId)
    }
}