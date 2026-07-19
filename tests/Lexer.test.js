import {describe, expect, it} from "vitest";
import {resolve} from "path"
import {readFile, unlink, writeFile} from "fs/promises"
import { DalLexer} from "../src/Lexer";


describe("Lexer", () => {
    it("basic source", async () => {
        const filePath = resolve(__dirname, "./designs/test.dal")
        const source = await readFile(filePath)
        const lexer = new DalLexer(source.toString());

        
        const tokens_output_path = resolve(__dirname, "./output/test_tokens.json")
        await writeFile(tokens_output_path, JSON.stringify(lexer.scannedTokens));
    });

});
