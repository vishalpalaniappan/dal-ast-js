import {describe, expect, it} from "vitest";
import {resolve} from "path"
import {readFile, unlink, writeFile} from "fs/promises"
import { DalParser } from "../src/Parser";
import { DalLexer} from "../src/Lexer";
import { DalAstGenerator } from "../src/DalAstGenerator";
import { ensureDir } from "./utils";

ensureDir("./tests/output")
ensureDir("./tests/output/sample")

describe("generates a sample file", () => {
    it("sample", async () => {
        const filePath = resolve(__dirname, "./designs/sample.dal")
        const source = await readFile(filePath)
        const lexer = new DalLexer(source.toString());

        
        const tokens_output_path = resolve(__dirname, "./output/sample/tokens.json")
        await writeFile(
            tokens_output_path,
            JSON.stringify(lexer.scannedTokens, null, 4)
        );

        const parser = new DalParser(lexer.scannedTokens);
        const ast_output_path = resolve(__dirname, "./output/sample/ast.json")
        await writeFile(
            ast_output_path,
            JSON.stringify(parser.ast, null, 4)
        );
    });

});