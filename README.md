# DAL Implementation Synthesizer
This tool a design defined in a Design Abstraction Language (DAL) and produces an Abstract Syntax Tree (AST). 

To achieve this it implements the following tools:
- Lexer
- Parser

This tool will be extended to also do the following:
- Syntactic Validation: 
    - Provide metadata about the result of the lexing and parsing to identify syntax errors. This will be used by the workbench to visually provide feedback in realtime.
- Semantic Diagnostics: 
    - Validate the design by ensuring that it is internally inconsistent in realtime.

This initial commit contains a working workflow but it is clearly not complete. I wanted to commit a working example to the repo to establish the workflow with the engine/workbench before I move forward. In the next commit, I will move the synthesizer into its own repo and rename this repo to `dal-ast-js` before I continue developing.

Some relevant files:
- [Library Manager Design](./tests/designs/library_manager.dal)
- [Lexer Output](./tests/output/test_tokens.json)
- [Generated AST](./tests/output/ast_direct_gen.json)

# Test
While it does have test cases to verify functionality, currently this is more functional than complete. 

Install libraries:
```sh
npm i 
```

To run all test cases:
```sh
npm run test
```

To run specific test case:
```sh
npm run test tests/Lexer.test.js
```

Run the lexer.test.js while providing it with a design file with a .dal extention in the `tests/designs` folder. This will produce an AST output in `tests/output/ast.json`.

This will be streamlined by integrating everything into the workbench. It will automatically produce the AST and synthesize the program by invoking the python synthesizer.

# Providing feedback

You can use GitHub issues to [report a bug][bug-report] or [request a feature][feature-req].

[bug-report]: https://github.com/vishalpalaniappan/program-synthesizer-python/issues
[feature-req]: https://github.com/vishalpalaniappan/program-synthesizer-python/issues

