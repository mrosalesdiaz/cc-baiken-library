
export function CreateInstanceOrReturn(keyName, className) {
    if (this[keyName]) { return this[keyName]; }
    this[keyName] = new className();
    return this[keyName];
}

export default class ComponentHelper {
}
