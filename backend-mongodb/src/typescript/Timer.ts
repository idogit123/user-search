export class Timer 
{
    startTime: Date
    endTime: Date

    constructor()
    {
        this.startTime = new Date()
        this.endTime = new Date()
    }

    start() {
        this.startTime = new Date()
    }

    end() {
        this.endTime = new Date()
    }

    getDuration() {
        return this.endTime.getTime() - this.startTime.getTime()
    }
}