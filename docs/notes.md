## Planning

- Lexer tokensizes the script
- Parser uses the grammar to build the AST.
- Grammar establishes how to build tree from tokens.

## Sample Script
```
design(sample_design)

behavior(getValue) {
    create("basket","list",[])    
}
```

## Tree Output
```
root
    - Design
        - name:sample Design
    - Behavior
        - name:getValue
        - block
            - Call
                - name:create
                - arguments
                    - participant: basket
                    - type: list
                    - value: []
```

## Synthesis Output
```
def getValue():
    basket = []
```
