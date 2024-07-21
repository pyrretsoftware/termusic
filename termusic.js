#!/usr/bin/env node
import { launch } from "./launch/launch.js";
import { startLauncher } from "./launch/launcher.js";
import { validateConfig} from "./helpers/configFileValidator.js"

process.stdout.write(String.fromCharCode(27) + "]0;termusic" + String.fromCharCode(7));
validateConfig()

if (process.argv[2] == "launch") {
    launch()
} else {
    startLauncher()
}
