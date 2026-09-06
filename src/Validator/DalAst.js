/**
 * A class representing the DAL ast. It accepts the output of the parser
 * and creates an AST object with methods to interact with it.
 * 
 * Source -> Lexer -> Parser -> DalAst -> Injector -> Synthesizer
 * 
 * The DalAst class will provide the methods to access the relevant
 * metadata from the AST to be able to find unique paths to a
 * transformation in the design.
 * 
 * It will also contain methods to be able to inject nodes into the
 * AST and then it is passed to the synthesizer.
 */
export class DalAst {

    /**
     * Initialize the AST with the parsed AST JSON object.
     * @param {Object} parsedAst Parsed AST object.
     */
    constructor (parsedAst) {

    }

}