/* tslint:disable */
import * as wasm from './yin_bg';

let cachegetUint8Memory = null;
function getUint8Memory() {
    if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory;
}

function passArray8ToWasm(arg) {
    const ptr = wasm.__wbindgen_malloc(arg.length * 1);
    getUint8Memory().set(arg, ptr / 1);
    return [ptr, arg.length];
}
/**
* @param {Uint8Array} arg0
* @param {number} arg1
* @param {number} arg2
* @returns {Result}
*/
export function yin(arg0, arg1, arg2) {
    const [ptr0, len0] = passArray8ToWasm(arg0);
    try {
        return Result.__wrap(wasm.yin(ptr0, len0, arg1, arg2));

    } finally {
        wasm.__wbindgen_free(ptr0, len0 * 1);

    }

}

function freeResult(ptr) {

    wasm.__wbg_result_free(ptr);
}
/**
*/
export class Result {

    static __wrap(ptr) {
        const obj = Object.create(Result.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeResult(ptr);
    }
    /**
    * @returns {number}
    */
    get_pitch_in_hertz() {
        return wasm.result_get_pitch_in_hertz(this.ptr);
    }
    /**
    * @returns {number}
    */
    get_probability() {
        return wasm.result_get_probability(this.ptr);
    }
}

let cachedDecoder = new TextDecoder('utf-8');

function getStringFromWasm(ptr, len) {
    return cachedDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
}

export function __wbindgen_throw(ptr, len) {
    throw new Error(getStringFromWasm(ptr, len));
}

