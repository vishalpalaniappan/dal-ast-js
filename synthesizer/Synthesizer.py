import ast

class Synthesizer:
    
    def __init__(self, tree):
        self.tree = tree
        self.ast = tree = ast.Module(
            body=[],
            type_ignores=[]
        )

    def run(self):
        for node in self.tree["body"]:
            self.processTree(node, self.ast, 0)
        print(ast.unparse(self.ast))

        src = ast.unparse(self.ast)

        with open("synthesized.py","w+") as f:
            f.write(src)

    def processTree(self, tree, astOut, indent):
        if "body" in tree:
            for node in tree["body"]:
                astNode = self.getAstNode(tree)
                ast.fix_missing_locations(astNode)
                astOut.body.append(astNode)
                self.processTree(node, astNode, indent + 1)
        else:
            astNode = self.getAstNode(tree)
            ast.fix_missing_locations(astNode)
            astOut.body.append(astNode)

    def printTree(self, indent, value):
        spaces = (indent * 4) * " "
        print(f"{spaces}{value}")

    def getAstNode(self, dalAstNode):
        if (dalAstNode["type"] == "behavior"):
            return ast.FunctionDef(
                name=dalAstNode["type"],
                args=ast.arguments(
                    posonlyargs=[],
                    args=[
                        ast.arg(arg="worldState")
                    ],
                    kwonlyargs=[],
                    kw_defaults=[],
                    defaults=[],
                    vararg=None,
                    kwarg=None
                ),
                body=[],
                decorator_list=[]
            )

        elif (dalAstNode["type"] == "design"):
            return ast.Assign(
                targets=[
                    ast.Name(id="design", ctx=ast.Store())
                ],
                value=ast.Constant(value=dalAstNode["design_name"][0]["value"])
            )


    