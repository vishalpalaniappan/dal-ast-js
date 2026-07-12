import ast

def getFunctionDef(name, args, body):
    '''
        This function returns a function definition statement.
    '''

    _args = [ast.arg(arg="worldState", annotation=None)]
    _args.extend(ast.arg(arg=arg, annotation=None) for arg in args)

    #TODO: Extend arguments to include inputs from substrate
    return ast.FunctionDef(
        name=name,
        args=ast.arguments(
            posonlyargs=[],
            args=_args,
            vararg=None,
            kwonlyargs=[],
            kw_defaults=[],
            kwarg=None,
            defaults=[]
        ),
        body=body,
        decorator_list=[]
    )

def getBehaviorLogStmt(name):
    '''
        This function returns a log statement for the behavior.
    '''
    return ast.Expr(
        value=ast.Call(
            func=ast.Attribute(
                value=ast.Name(id='semanticLogger', ctx=ast.Load()),
                attr='logBehavior',
                ctx=ast.Load()
            ),
            args=[
                ast.Name(id=name, ctx=ast.Load()),
            ],
            keywords=[]
        )
    )

def getInputLogStmt(behaviorName, name):
    '''
        This function returns a log statement for participant
        before the behavior.
    '''
    return ast.Expr(
        value=ast.Call(
            func=ast.Attribute(
                value=ast.Name(id='semanticLogger', ctx=ast.Load()),
                attr='logInput',
                ctx=ast.Load()
            ),
            args=[
                ast.Constant(value=behaviorName),
                ast.Constant(value=name),
                ast.Name(id=name, ctx=ast.Load()),
            ],
            keywords=[]
        )
    )

def getName(name, ctx):
    '''
        This function returns a name node.
    '''
    return ast.Name(
        id=name,
        ctx=ctx
    )

def getConstant(value):
    '''
        This function returns a constant node.
    '''
    return ast.Constant(
        value=value
    )

def getAssign(target, value):
    '''
        This function returns an assignment statement.
    '''
    return ast.Assign(
        targets=[target],
        value=value
    )

def getAssignWithUid(target, value):
    """
        This function generates an assign statement
        after adding a UID to the target.
        
        target = {
            "uid": uuid.uuid4(),
            "value": value
        }
    """
    return ast.Assign(
        targets=[target],
        value=ast.Dict(
            keys=[
                ast.Constant(value="uid"),
                ast.Constant(value="value"),
            ],
            values=[
                ast.Call(
                    func=ast.Name(id="str", ctx=ast.Load()),
                    args=[
                        ast.Call(
                            func=ast.Attribute(
                                value=ast.Name(id="uuid", ctx=ast.Load()),
                                attr="uuid4",
                                ctx=ast.Load(),
                            ),
                            args=[],
                            keywords=[],
                        )
                    ],
                    keywords=[],
                ),
                value,
            ],
        ),
    )

def getVariableNameWithKeys(name, keys):
    current = ast.Name(id=name, ctx=ast.Load())

    for key in keys:
        current = ast.Subscript(
            value=current,
            slice=ast.Constant(value=key),
            ctx=ast.Load()
        )

    return current


def getBinOp(target, left, operator, right):
    '''
        This function returns a binary operation node.
    '''
    # Get operator node based on transformation
    if operator == "+":
        op = ast.Add()
    elif operator == "-":
        op = ast.Sub()
    elif operator == "*":
        op = ast.Mult()
    elif operator == "/":
        op = ast.Div()
    else:
        print(f"Unsupported operator: {operator}")
        return None
    
    return ast.Assign(
        targets=[target],
        value=ast.BinOp(
            left=left,
            op=op,
            right=right
        )
    )