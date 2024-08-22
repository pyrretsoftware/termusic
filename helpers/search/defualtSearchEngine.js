import { config } from "../../snippets/config.js";
import { searchInvidious } from "../search/invidious.js";
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

export function getSearchFunction(engine) {
    let searchEngine

    if (!engine) { //we do this in order to always use the latest search engine
        searchEngine = config['searchEngine']
    } else {
        searchEngine = engine
    }
    return searchEngines[searchEngine]
}