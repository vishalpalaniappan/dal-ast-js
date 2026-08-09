import {describe, expect, it} from "vitest";
import {resolve} from "path"
import {readFile, unlink, writeFile} from "fs/promises"
import { DalParser } from "../src/Parser";
import { DalLexer} from "../src/Lexer";
import { DalAstGenerator } from "../src/DalAstGenerator";


describe("tests the args parsing", () => {

    it("tests actor ast generation", async () => {
        const filePath = resolve(__dirname, "./designs/argsTest.dal")
        const source = await readFile(filePath)
        const ast = new DalAstGenerator().run(source.toString());
        const ast_output_path = resolve(__dirname, "./output/ast_args.json")
        await writeFile(
            ast_output_path,
            JSON.stringify(ast, null, 4)
        );
    });

});