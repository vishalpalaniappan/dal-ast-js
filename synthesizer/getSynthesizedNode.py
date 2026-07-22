import ast
from helper import getVariableNameWithKeys

def getSynthesizedNode(node):
    '''
        Get the AST node given the dalAST metadata.

        Commands: getCmd<CommandName>Ast
        Default: get<Primitive>Ast
    '''
    type = node["type"]
    if (type == "cmd"):
        cmd = node["command"]
        funcName = f"getCmd{cmd[0].upper() +cmd[1:]}Ast"
    else:
        funcName = f"get{type[0].upper() +type[1:]}Ast"

    if (funcName in globals()):
        return globals()[funcName](node)


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