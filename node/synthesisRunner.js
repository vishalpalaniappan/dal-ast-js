import { spawn } from "node:child_process";


function synthesisRunner(synthPackage, args = []) {
    return new Promise((resolve, reject) => {
        // Testing default execution.
        const process = spawn("python3", ["design_synthesizer.py","--package","./packages/synthPackage.json"]);
                let settled = false;

        const stdoutChunks = [];
        let stderr = "";

        process.stdout.on("data", (data) => {
            stdoutChunks.push(data);
        });

        process.stderr.on("data", (data) => {
            stderr += data.toString();
        });

        process.on("error", (err) => {
            if (settled) return;
            settled = true;
            reject(err);
        });

        process.on("close", async (code) => {
            if (settled) return;
            settled = true;
            if (code !== 0) {
                reject(new Error(stderr || `Process exited with code ${code}`));
            } else {
                resolve(Buffer.concat(stdoutChunks));
            }
        });

        process.stdin.write(JSON.stringify(synthPackage));
        process.stdin.end();
    });
}

export default synthesisRunner;