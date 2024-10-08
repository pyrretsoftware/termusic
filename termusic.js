#!/usr/bin/env node
import { launch } from "./launch/launch.js";
import { startLauncher, startQuickLauncher } from "./launch/launcher.js";
import { validateConfig} from "./helpers/startup/configFileValidator.js"
import { launchAbout } from "./launch/about.js";
import { launchHelp } from "./launch/help.js";

if (process.argv[2]?.includes('launch')) {
    launch()
} else if (process.argv[2] == 'about') {
    launchAbout()
} else if (process.argv[2] == 'help-dialog') {
    launchHelp()
}  else if (process.argv[2] == '-ql' || process.argv[2] == '--quick-launch') {
    startQuickLauncher()
} else {
    startLauncher()
}
