export default class DelayUtil {

    current: number = 0;
    elapsed: number = 0;
    firstExecutionDone: boolean = false;

    update(dt: number): DelayUtil {
        this.current += dt;
        return this;
    }

    skip(delayedTime: number, firstExecution: number = null): boolean {
        if (this.firstExecutionDone && this.current >= delayedTime) {
            this.elapsed = this.current
            this.current = 0;
            return false;
        } else if (!this.firstExecutionDone && this.current >= (firstExecution == null || firstExecution == undefined ? delayedTime : firstExecution)) {
            this.firstExecutionDone = true;
            this.elapsed = this.current
            this.current = 0;
            return false;
        } else {
            return true;
        }
    }

    reset() {
        this.current = 0;
    }
}
