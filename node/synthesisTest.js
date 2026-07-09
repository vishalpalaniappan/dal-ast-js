import path from 'path';
import {DALEngine} from "dal-engine-core-js-lib-dev";
import { resolveDesignPath } from "./validateDesignName.js";
import fs from 'fs/promises';
import unzipper from "unzipper";

const testStreamMode = async (designName, behavior) => {    
    const resolvedPath = resolveDesignPath(designName);
    const data = await fs.readFile(resolvedPath);
    const engine = new DALEngine({
        name: designName,
        description: "Default engine",
    });
    engine.deserialize(data);

    const activeBehavior = engine.graphs.getActiveGraph();

    for (const node of activeBehavior.nodes) {
        const synthPkg = node.getBehavior().generateSynthesisPackage();
        console.log(synthPkg);
    }

    // try {
    //     const zipBuffer = await synthesisRunner(instrumentationPkg);
    //     console.log("Synthesis output:", zipBuffer);
    //     const directory = await unzipper.Open.buffer(zipBuffer);
    //     await directory.extract({ path: "./output" });
    // } catch (err) {
    //     console.error("Error during synthesis execution:");
    //     console.error(err);
    //     process.exit(1);
    // }
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