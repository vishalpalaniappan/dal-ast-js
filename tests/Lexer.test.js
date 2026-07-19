import {describe, expect, it} from "vitest";
import { DalLexer

 } from "../src/Lexer";
describe("Lexer", () => {
    it("basic source", () => {
        const source = "design(\"le,xer\")";
        const lexer = new DalLexer(source);

    });

});
