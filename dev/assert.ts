
export function assert(condition: boolean, message?: string) {
    if (message == null) { message = arguments.callee.caller.name }
    console.assert(condition, message);
}

export function assertIsNotNull(object: any, message?: string) {
    if (message == null) { message = arguments.callee.caller.name }
    assert(object != null, message);
}
