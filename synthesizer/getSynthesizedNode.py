import ast
from helper import getVariableNameWithKeys

def getSynthesizedNode(dalAstNode):
    '''
        Get the AST node given the dalAST metadata.
    '''
    if (dalAstNode["type"] == "behavior"):
        return getBehaviorAst(dalAstNode)
    elif (dalAstNode["type"] == "design"):
        return getDesignAst(dalAstNode)
    elif (dalAstNode["type"] == "while"):
        return getWhileAst(dalAstNode)
    elif (dalAstNode["type"] == "cmd"):
        if (dalAstNode["command"] == "getInput"):
            return getCmdGetInputAst(dalAstNode)
        elif (dalAstNode["command"] == "set"):
            return getCmdSetAst(dalAstNode)

def getBehaviorAst(node):
    '''
        def <behaviorName>():
            global worldState
    '''
    return ast.FunctionDef(
        name=node["behaviorName"],
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

def getDesignAst(node):
    '''
        design = <design_Name>
    '''
    return ast.Assign(
        targets=[
            ast.Name(id="design", ctx=ast.Store())
        ],
        value=ast.Constant(value=node["design_name"][0]["value"])
    )

def getWhileAst(node):
    '''
        while <condition>:
            <body>
    '''
    return ast.While(
        test=ast.Name(id=node["args"][0]["value"], ctx=ast.Load()),
        body=[],
        orelse=[]
    )

def getCmdGetInputAst(node):
    '''
        <output> = input()
    '''
    name = node["args"][0]["value"]
    return  ast.Assign(
        targets=[
            ast.Name(id=name, ctx=ast.Store())
        ],
        value=ast.Call(
            func=ast.Name(id="input", ctx=ast.Load()),
            args=[],
            keywords=[]
        )
    )

def getCmdSetAst(node):
    '''
        <name>[<keys>] = <value>
    '''
    name = node["args"][0]["value"]
    keys = node["args"][1]["value"]
    value = node["args"][2]["value"]
    return ast.Assign(
        targets=[
            getVariableNameWithKeys(name, keys)
        ],
        value=ast.Constant(value=value)
    )