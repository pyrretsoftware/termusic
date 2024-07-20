export function centerText(text, widthChars) {
    if (text.length > widthChars -2) {
        text = text.substring(0, widthChars - 5) //2 for margin, 3 for ...
        text = text + '...'
    }
    const ammountOfSpaces = (widthChars - (text.length - 1)) / 2
    for (let i = 1; i < ammountOfSpaces; i++) {
        text = " " + text
    }
    
    return text
}