import {describe, expect, it} from "vitest";
import { DalLexer

 } from "../src/Lexer";
describe("Lexer", () => {
    it("basic source", () => {
        const source = "design(lexer)";
        const lexer = new DalLexer(source);

    });

});
