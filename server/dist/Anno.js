"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToJson = void 0;
//파싱 에노테이션 입니다.
function stringToJson(target, key, desc) {
    const originCode = desc.value;
    desc.value = function (...args) {
        if (args && args[0] && typeof args[0] == 'string') {
            let data = JSON.parse(args[0]);
            args[0] = data;
        }
        return originCode.apply(this, args);
    };
    return desc;
}
exports.stringToJson = stringToJson;
