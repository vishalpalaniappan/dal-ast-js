import { DalLexer } from "./Lexer";
import { DalParser } from "./Parser";
/**
 * This class produces an AST output given a DAL source file.
 * 
 * Internally it invokes:
 * - Lexer
 * - Parser
 * - AST output
 * 
 * The AST output is sent to the synthesizer and synthesized
 * into a python program.
 * 
 * In the future, this will also:
 * - Identify syntax errors
 * - Lint
 * - Validate the internal consistency of the design
 */
export class DalAstGenerator {

    constructor() {
        this.ast = null;
    }

    run (source) {
        try {
            const lexer = new DalLexer(source);
            const parser = new DalParser(lexer.scannedTokens);
            this.ast = parser.ast;
        } catch(e) {
            console.error("Error generating the AST:", e);
        }
        return this.ast;
    }
}