import { spawn } from "node:child_process";


function synthesisRunner(synthPackage, args = []) {
    return new Promise((resolve, reject) => {
        const process = spawn("python3", ["design_instrumenter.py"]);
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

        if (typeof source !== "string") {
            reject(new Error("source must be a string"));
            return;
        }

        process.stdin.write(synthPackage);
        process.stdin.end();
    });
}

export default instrumentingRunner;