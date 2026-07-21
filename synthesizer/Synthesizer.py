import ast
from getSynthesizedNode import getSynthesizedNode

class Synthesizer:
    
    def __init__(self, dalAst):
        self.dalAst = dalAst
        self.ast = ast.Module(
            body=[],
            type_ignores=[]
        )

    def run(self):
        '''
            Run the synthesizer
        '''
        # Process each node in the DAL ast.
        for node in self.dalAst["body"]:
            self.processTree(node, self.ast, 0)

        src = ast.unparse(self.ast)

        print("\nAST Output:\n------")
        print(src)

        with open("synthesized.py","w+") as f:
            f.write(src)

    def processTree(self, dalAstNode, astOut, indent):
        '''
            Process the tree node. If there is a body, process
            each node in the body.

            Writes the synthesized ast node to the ast tree.
        '''
        self.printTree(indent, dalAstNode["type"])
        astNodeBody = getSynthesizedNode(dalAstNode)
        if astNodeBody:
            ast.fix_missing_locations(astNodeBody)
            astOut.body.append(astNodeBody)
        
            if "body" in dalAstNode:
                for node in dalAstNode["body"]:
                    self.processTree(node, astNodeBody, indent + 1)

    def printTree(self, indent, value):
        '''
            Prints Tree with indentation for inspection.
        '''
        spaces = (indent * 4) * " "
        print(f"{spaces}{value}")