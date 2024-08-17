import { searchYoutube } from "../helpers/ytScrape.js"
import test from "node:test";
import assert from 'node:assert';

const result = await searchYoutube('california girls')
await new Promise(resolve => setTimeout(resolve, 700))

test('ytScrape does not throw an error', async () => {
    if (!result) {
        assert.fail('ytScrape threw an error.')
    }
})
test('ytScrape returns the california girls music video', async () => {
    assert.equal(result['id'], 'F57P9C4SAW4')
})
