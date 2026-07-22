import ast
from helper import getVariableNameWithKeys

def getSynthesizedNode(dalAstNode):
    '''
        Get the AST node given the dalAST metadata.
    '''
    if (dalAstNode["type"] == "behavior"):
        return ast.FunctionDef(
            name=dalAstNode["behaviorName"],
            args=ast.arguments(
                posonlyargs=[],
                args=[],
                kwonlyargs=[],
                kw_defaults=[],
                defaults=[],
                vararg=None,
                kwarg=None
            ),
            body=[
                ast.Global(
                    names=["worldState"]
                )
            ],
            decorator_list=[]
        )

    elif (dalAstNode["type"] == "design"):
        return ast.Assign(
            targets=[
                ast.Name(id="design", ctx=ast.Store())
            ],
            value=ast.Constant(value=dalAstNode["design_name"][0]["value"])
        )

    elif (dalAstNode["type"] == "while"):
        return ast.While(
            test=ast.Name(id=dalAstNode["args"][0]["value"], ctx=ast.Load()),
            body=[],
            orelse=[]
        )

    elif (dalAstNode["type"] == "cmd"):
        if (dalAstNode["command"] == "getInput"):
            name = dalAstNode["args"][0]["value"]
            return ast.Assign(
                targets=[
                    ast.Name(id=name, ctx=ast.Store())
                ],
                value=ast.Call(
                    func=ast.Name(id="input", ctx=ast.Load()),
                    args=[],
                    keywords=[]
                )
            )

        elif (dalAstNode["command"] == "set"):
            name = dalAstNode["args"][0]["value"]
            keys = dalAstNode["args"][1]["value"]
            value = dalAstNode["args"][2]["value"]
            print(name, keys, value)
            return ast.Assign(
                targets=[
                    getVariableNameWithKeys(name, keys)
                ],
                value=ast.Constant(value=value)
            )