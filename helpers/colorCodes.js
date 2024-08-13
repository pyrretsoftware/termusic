import { setPlayStatus } from "./playStatus.js"

export const Reset = "\x1b[0m"
export const Black = "\x1b[30m"
export const Red = "\x1b[31m"
export const Green = "\x1b[32m"
export const Yellow = "\x1b[33m"
export const Blue = "\x1b[34m"
export const Magenta = "\x1b[35m"
export const Cyan = "\x1b[36m"
export const White = "\x1b[37m"
export const Gray = "\x1b[90m"
export const PastelGreen = "\x1b[38;2;13;188;121m"
export const PastelRed = "\x1b[38;2;203;89;89m"

export function RGBToEscapeCode(rgb, context = 'fg') {
    const expression = /rgb\(([0-9]*)+, *([0-9]*)+, *([0-9]*)+\)/;
    const matches = rgb.match(expression)
    
    if (matches.length != 4) {
        setPlayStatus('important_err', 'Failed to asset format for RGB value when parsing theme.')
    }

    return `\x1b[${context == 'fg' ? '38' : '48'};2;${matches[1]};${matches[2]};${matches[3]}m`
}