# program-synthesizer-python
This tool current works in two stages:
- In the first stage, it accepts a design defined in a Design Abstraction Language (DAL) and produces an Abstract Syntax Tree (AST). 
- In the second stage it synthesizes the AST into a python program.

To achieve this it implements the following tools:
- Lexer
- Parser
- Synthesizer

This initial commit contains a working workflow but it is clearly not complete. I wanted to commit a working example to the repo to establish the workflow with the engine/workbench before I move forward. In the next commit, I will move the synthesizer into its own repo and rename this repo to `dal-ast-js` before I continue developing.

Some relevant files:
- [Library Manager Design](./tests/designs/library_manager.dal)
- [Lexer Output](./tests/output/test_tokens.json)
- [Generated AST](./tests/output/ast_direct_gen.json)
- [Synthesized Output](./synthesizer/output/synthesized.py)

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

# Current Workflow

- Run the lexer.test.js while providing it with a design file with a .dal extention in the `tests/designs` folder. This will produce an AST output in `tests/output/ast.json`.
- Copy the `ast.json` file into the `synthesizer/asts` folder.
- Run the synthesizer within the synthesizer folder, en example is:
```
python3 dal_ast_synthesizer.py --ast asts/lib_manager_ast.json 
```

This will be streamlined by integrating everything into the workbench. It will automatically produce the AST and synthesize the program.

# Providing feedback

You can use GitHub issues to [report a bug][bug-report] or [request a feature][feature-req].

[feature-req]: https://github.com/vishalpalaniappan/program-synthesizer-python/issues
[feature-req]: https://github.com/vishalpalaniappan/program-synthesizer-python/issues

