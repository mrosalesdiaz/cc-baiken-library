
export function assert(condition: boolean, message?: string) {
    console.assert(condition, message ?? arguments.callee.caller.name);
}

export function assertIsNotNull(object: any, message?: string) {
    assert(object == null, message ?? arguments.callee.caller.name);
}
