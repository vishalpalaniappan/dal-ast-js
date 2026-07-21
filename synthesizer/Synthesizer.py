import ast
from pathlib import Path
from getSynthesizedNode import getSynthesizedNode


class Synthesizer:
    
    def __init__(self, dalAst):
        self.dalAst = dalAst
        self.pythonAst = ast.Module(
            body=[],
            type_ignores=[]
        )

    def run(self):
        '''
            Run the synthesizer
        '''
        # Process each node in the DAL ast.
        for node in self.dalAst["body"]:
            self.processTree(node, self.pythonAst, 0)

        outputFile = Path(__file__).parent / "output" / "synthesized.py"
        with open(outputFile,"w+") as f:
            f.write(ast.unparse(self.pythonAst))

    def processTree(self, dalAstNode, pythonAstNode, indent):
        '''
            Process the tree node. If there is a body, process
            each node in the body.

            Writes the synthesized ast node to the ast tree.
        '''
        self.printTree(indent, dalAstNode["type"])
        astNodeBody = getSynthesizedNode(dalAstNode)
        if astNodeBody:
            ast.fix_missing_locations(astNodeBody)
            pythonAstNode.body.append(astNodeBody)
        
            if "body" in dalAstNode:
                for node in dalAstNode["body"]:
                    self.processTree(node, astNodeBody, indent + 1)

    def printTree(self, indent, value):
        '''
            Prints Tree with indentation for inspection.
        '''
        spaces = (indent * 4) * " "
        print(f"{spaces}{value}")