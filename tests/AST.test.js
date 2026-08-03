import {describe, expect, it} from "vitest";
import {resolve} from "path"
import {readFile, unlink, writeFile} from "fs/promises"
import { DalParser } from "../src/Parser";
import { DalLexer} from "../src/Lexer";
import { DalAstGenerator } from "../src/DalAstGenerator";


describe("tests ast genertor from dal file", () => {
    it("basic source", async () => {
        const filePath = resolve(__dirname, "./designs/reverse_name_persist.dal")
        const source = await readFile(filePath)
        const lexer = new DalLexer(source.toString());

        
        const tokens_output_path = resolve(__dirname, "./output/test_tokens.json")
        await writeFile(
            tokens_output_path,
            JSON.stringify(lexer.scannedTokens, null, 4)
        );

        const parser = new DalParser(lexer.scannedTokens);
        const ast_output_path = resolve(__dirname, "./output/ast.json")
        await writeFile(
            ast_output_path,
            JSON.stringify(parser.ast, null, 4)
        );
    });

    it("tests direct ast generation", async () => {
        const filePath = resolve(__dirname, "./designs/reverse_name_persist.dal")
        const source = await readFile(filePath)
        const ast = new DalAstGenerator().run(source.toString());
        const ast_output_path = resolve(__dirname, "./output/ast_direct_gen.json")
        await writeFile(
            ast_output_path,
            JSON.stringify(ast, null, 4)
        );
    });

    it("tests actor ast generation", async () => {
        const filePath = resolve(__dirname, "./designs/actorTest.dal")
        const source = await readFile(filePath)
        const ast = new DalAstGenerator().run(source.toString());
        const ast_output_path = resolve(__dirname, "./output/ast_actor.json")
        await writeFile(
            ast_output_path,
            JSON.stringify(ast, null, 4)
        );
    });

});