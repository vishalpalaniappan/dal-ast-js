# program-synthesizer-python
Currently, this tool builds an Abstract Syntax Tree representation of a script written in the Design Abstraction Language (DAL).

# Usage
Currently, I am using using test cases to establish functionality.

Install libraries:
```
npm i 
```

To run all test cases:
```
npm run test
```

To run specific test case:
```
npm run test tests/Lexer.test.js
```

This library will likely be integated into the workbench directly and will be maintaned there.

# Synthesizer

This repo also contains a synthesizer that can take the generated AST and synthesize it into an implementation.