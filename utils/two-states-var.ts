/**
 * Utility class to store current and previous value of a property.
 * The goal of this class is to reduce variable polution
 * 
 * @author mrosalediaz
 * 
 * @history 2020-06-04 mrosalesdiaz - Initial Version
 */
export default class TwoStatesVar<Type> {

    constructor(value?: Type) {
        if (value === undefined) { return };
        this._current = value;
    }

    private _current: Type;
    public get current(): Type {
        return this._current;
    }
    /**
     * It will automatically save the current value into old variable
     */
    public set current(v: Type) {
        this._previous = this.current;
        this._current = v;
    }

    private _previous: Type;
    public get previous(): Type {
        return this._previous;
    }

    public get justChanged(): boolean {
        return this._previous != this._current;
    }

}
