
export default class FnUpdate {
    handlerImplementation: (dt: number, previous: any, evt: any) => any;
    previousValue: any;
    internalEvt: any = new Object();
    lastState: boolean = false;
    handlerReset: (previous: any, evt: any) => any = (previous, evt) => 0;
    lastValue: any;

    constructor() {

    }

    enable(activate: boolean, value: any = null): UpdateFunction {
        if (!activate) {
            this.lastState = activate;
            this.lastValue = value;
            return { update: FnUpdate.dummy }
        }

        if (activate != this.lastState || this.lastValue != value) {
            this.previousValue = this.handlerReset(this.previousValue, this.internalEvt);
        }

        this.lastState = activate;
        this.lastValue = value;
        return { update: dt => { this.previousValue = this.handlerImplementation(dt, this.previousValue, this.internalEvt) } }
    }

    static dummy() { }
}

interface UpdateFunction {
    update: (dt: number) => void
}