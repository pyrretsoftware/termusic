import { config } from "../snippets/config.js";
import { searchInvidious } from "./invidious.js";
import { searchYoutube } from "./ytScrape.js";

const searchEngines = {
    'youtube' : searchYoutube,
    'invidious' : searchInvidious
}

export function isSearchEngine(engine) {
    if (Object.keys(searchEngines).includes(engine)) {
        return true
    } else {
        return false
    }
}

export function getSearchFunction() {
    return searchEngines[config['searchEngine']]
}