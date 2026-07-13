import path from 'path';
import {DALEngine} from "dal-engine-core-js-lib-dev";
import { resolveDesignPath } from "./validateDesignName.js";
import synthesisRunner from "./synthesisRunner.js"
import fs from 'fs/promises';
import { writeFile } from "node:fs/promises";
import unzipper from "unzipper";
import { json } from 'stream/consumers';

const testStreamMode = async (designName, behavior) => {    
    const resolvedPath = resolveDesignPath(designName);
    const data = await fs.readFile(resolvedPath);
    const engine = new DALEngine({
        name: designName,
        description: "Default engine",
    });
    engine.deserialize(data);

    const activeBehavior = engine.graphs.getActiveGraph();

    let synthPkg = [];
    for (const node of activeBehavior.nodes) {
        const behaviorSynth = node.getBehavior().generateSynthesisPackage();
        synthPkg.push(behaviorSynth);
    }

    await writeFile(`packages/${designName}.json`, JSON.stringify(synthPkg));

    try {
        const synthesizedOutput = await synthesisRunner(synthPkg);
        console.log("Synthesis output:", synthesizedOutput.toString());
    } catch (err) {
        console.error("Error during synthesis execution:");
        console.error(err);
        process.exit(1);
    }
}

const args = process.argv;
if (args.length < 3) {
    console.error("Please provide the path to the design file as an argument.");
    process.exit(1);
}

const designName = args[2];
testStreamMode(designName).catch((err) => {
    console.error("Error during test execution:", err);
    process.exit(1);
});