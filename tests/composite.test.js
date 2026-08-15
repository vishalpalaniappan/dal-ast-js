import {describe, expect, it} from "vitest";
import {resolve} from "path"
import {readFile, unlink, writeFile} from "fs/promises"
import { DalParser } from "../src/Parser";
import { DalLexer} from "../src/Lexer";
import { DalAstGenerator } from "../src/DalAstGenerator";


describe("tests ast genertor from dal file", () => {
    it("tests import", async () => {
        const filePath = resolve(__dirname, "./designs/hasImport.dal")
        const source = await readFile(filePath)
        const ast = new DalAstGenerator().run(source.toString());
        const ast_output_path = resolve(__dirname, "./output/hasImport.json")
        await writeFile(
            ast_output_path,
            JSON.stringify(ast, null, 4)
        );
    });
    it("tests composite", async () => {
        const filePath = resolve(__dirname, "./designs/compositeBehavior.dal")
        const source = await readFile(filePath)
        const ast = new DalAstGenerator().run(source.toString());
        const ast_output_path = resolve(__dirname, "./output/compositeBehavior.json")
        await writeFile(
            ast_output_path,
            JSON.stringify(ast, null, 4)
        );
    });


});