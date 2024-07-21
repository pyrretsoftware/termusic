import { changeRpcStatus } from "./discordRpc.js";

export function setPlayStatus(type, playStatus) {
    if (type == 'report') {
        changeRpcStatus(playStatus["title"], playStatus["thumbnail"])
    }
}