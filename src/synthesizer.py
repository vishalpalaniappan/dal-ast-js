import json
import ast
import os
import sys
from src.helper import getBehaviorLogStmt
from src.helper import getInputLogStmt
from src.helper import getFunctionDef
from src.helper import getConstant
from src.helper import getName
from src.helper import getAssign
from src.helper import getAssignWithUid
from src.helper import getVariableNameWithKeys

class Synthesizer:
    def __init__(self, packagePath):
        
        if packagePath:
            self.mode = "path"
            self.packagePath = packagePath
            try:
                with open(packagePath, 'r') as f:
                    self.model = json.loads(f.read())
            except Exception as e:
                print(f"Error loading model: {str(e)}")
                self.model = None
        else:
            # Streamming input
            self.model = json.loads(sys.stdin.read())
            self.mode = "stream"

        self.tree = ast.Module(
            body=[],
            type_ignores=[]
        )

    def run(self):
        if self.model is None:
            print("No model loaded. Cannot synthesize.")
            return None
            
        for entry in self.model:
            output = self.processBehavior(entry)
            self.tree.body.append(output)
            ast.fix_missing_locations(self.tree)
        
        importNode = ast.parse("from LoggingHelper import semanticLogger").body[0]
        self.tree.body.insert(0, importNode)
        
        uuidNode = ast.parse("import uuid").body[0]
        self.tree.body.insert(0, uuidNode)

        directory = os.getcwd()
        with open(os.path.join(directory, "output", 'synthesized.py'), 'w') as f:
            f.write(ast.unparse(self.tree))

        # I'm only writing to file as I develop but once I move it
        # to the workbench, I will stream the output so that I can
        # save the synthesized output in the package.
        # if self.mode == "stream":
            # sys.stdout.write(ast.unparse(self.tree))

        return None
    
    def processBehavior(self, node):
        body = []
        args = []

        body.append(getBehaviorLogStmt(node["behavior"]))

        '''
            TODO:
             - Add support for select primitive with if statements
             - Return next selected behavior
             - Update len and getFromPos to access participants from world state.
             - More to come.

             Continue adding until synthesized output can be executed, then modify
             the design executable to use it.
        '''

        # Process transformation here
        for transformation in node["transformations"]:
            if (transformation["type"] == "set"):
                stmt = self.getSetStatement(transformation)
            elif (transformation["type"] == "binop"):
                stmt = self.getBinOpStatement(transformation)
            elif (transformation["type"] == "log" and transformation["isInput"]):
                stmt = getInputLogStmt(node['behavior'], transformation["participant"])
                args.append(transformation["participant"])
            elif (transformation["type"] == "getLength"):
                stmt = self.getGetLengthStatement(transformation)
            elif (transformation["type"] == "isEqual"):
                stmt = self.getIsEqualStatement(transformation)
            elif (transformation["type"] == "getFromPos"):
                stmt = self.getGetFromPosStatement(transformation)
            elif(transformation["type"] == "selectNextBehaviorConditional"):
                stmt = self.getSelectNextBehavioralConditionalStatement(transformation)
            elif(transformation["type"] == "selectNextBehavior"):
                stmt = self.getSelectNextBehaviorStatement(transformation)
            else:
                print(f"Unsupported transformation: {transformation}")
                continue
            
            if stmt is not None:
                body.append(stmt)

        body.append(self.getReturnStatement())
        # Create function
        return getFunctionDef(node['behavior'], args, body)
    
    def getSetStatement(self, transformation):
        '''
            This function processes a set transformation and returns the corresponding AST node.

            It is used to create a new participant if no value is provided. If a value is provided
            then it will set that value.

            TODO: In validation phase, use type of participant to determine if design is
            internally consistent.

            "name": sets a name node with the participant from the world state
            "string": sets provided value if specified and "" if not specified

            TODO: Add support for null.

            Update the list below so it sets value if it is provided:
            "list": sets []
            "number": sets 0
            "object": sets {}
            "boolean": sets False
            "null": sets None
        '''
        print(f"Processing set transformation: {transformation}")

        if (len(transformation["keys"])) > 0:
            name = getVariableNameWithKeys(
                transformation["targetParticipantName"],
                transformation["keys"]
            )
        else:
            name = getName(transformation["targetParticipantName"], ast.Load())
            
        # Get name node and value or constant based on transformation
        meta = transformation["valueType"]

        if meta["type"] == "name":
            # Assigns participant
            value = getName(meta["value"], ast.Load())
        elif meta["type"] == "list":
            value =  ast.List(elts=[], ctx=ast.Load())
        elif meta["type"] == "number":
            value =  ast.Constant(value=0)
        elif meta["type"] == "object":
            value =  ast.Dict(keys=[], values=[])
        elif meta["type"] == "string":
            if ("value" in meta):
                value = ast.Constant(value=meta["value"])
            else:
                value = ast.Constant(value="")
        elif meta["type"] == "boolean":
            value = ast.Constant(value=False)
        elif meta["type"] == "null":
            value = ast.Constant(None)
        else:
            print(f"Unsupported type: {meta['type']}")
            value = None

        if value == None:
            return None

        return getAssign(name, value)

        # Disble UID temporarily
        # if (len(transformation["keys"])) > 0:            
        #     return getAssign(name, value)
        # else:
        #     # This is where a participant is being created so we assign a UID
        #     assign_node = getAssignWithUid(name, value)
        #     return assign_node
            
    
    def getBinOpStatement(self, transformation):
        '''
            This function processes a binop transformation and returns the corresponding AST node.
        '''
        print(f"Processing binop transformation: {transformation}")

        if (len(transformation["targetKeys"])) > 0:
            target = getVariableNameWithKeys(transformation["targetParticipantName"], transformation["targetKeys"])
        else:
            target = getName(transformation["targetParticipantName"], ast.Store())

        # Get left and right nodes based on transformation
        left = self.getNodeByType(transformation["leftType"])
        right = self.getNodeByType(transformation["rightType"])

        # Get operator node based on transformation
        if transformation["operator"] == "+":
            op = ast.Add()
        elif transformation["operator"] == "-":
            op = ast.Sub()
        elif transformation["operator"] == "*":
            op = ast.Mult()
        elif transformation["operator"] == "/":
            op = ast.Div()
        else:
            print(f"Unsupported operator: {transformation['operator']}")
            return None
        
        return ast.Assign(
            targets=[target],
            value=ast.BinOp(
                left=left,
                op=op,
                right=right
            )
        )
    
    def getIsEqualStatement(self, transformation):
        '''
            {
                type: "isEqual",
                targetParticipant: isSameName
                left: name,
                right: bookName
            }
            
            isSameName = (name == bookName)
        '''
        return ast.Assign(
            targets=[
                ast.Name(id=transformation["targetParticipant"], ctx=ast.Store())
            ],
            value=ast.Compare(
                left=ast.Name(id=transformation["left"], ctx=ast.Load()),
                ops=[ast.Eq()],
                comparators=[
                    ast.Name(id=transformation["right"], ctx=ast.Load())
                ]
            )
        )
    
    def getGetFromPosStatement(self, transformation):
        '''
        Example:
        {
            type: "getFromPos",
            sourceParticipantName: bookName
            position: 0,
            targetParticipantName: firstLetter
        }

        firstLetter = bookName[0]
        '''

        return ast.Assign(
            targets=[
                 getVariableNameWithKeys(
                    "worldState", 
                    [transformation["targetParticipantName"]]
                )
            ],
            value=ast.Subscript(
                value=getVariableNameWithKeys("worldState", [transformation["sourceParticipantName"]]),
                slice=ast.Constant(value=transformation["position"]),
                ctx=ast.Load()
            )
        )
    
    def getSelectNextBehavioralConditionalStatement(self, transformation):
        '''
            {
                type: "selectNextBehaviorConditional",
                nextBehavior: "getBookName",
                hasFlag: true,
                flagParticipantName: isGetBook,
            }

            if isGetBook:
                nextBheavior = "getBookName"
        '''
        return ast.If(
            test=ast.Name(id=transformation["flagParticipantName"], ctx=ast.Load()),
            body=[
                ast.Assign(
                    targets=[
                        ast.Name(id="nextBehavior", ctx=ast.Store())
                    ],
                    value=ast.Constant(value=transformation["nextBehavior"])
                )
            ],
            orelse=[]
        )

    def getSelectNextBehaviorStatement(self, transformation):
        '''
            {
                type: "selectNextBehavior",
                nextBehavior: "getBookName",
            }

            nextBehavior = "getBookName"
        '''
        return ast.Assign(
            targets=[
                ast.Name(id="nextBehavior", ctx=ast.Store())
            ],
            value=ast.Constant(value=transformation["nextBehavior"])
        )
    
    def getGetLengthStatement(self, transformation):
        '''
            Synthesis Meta: 
            {
                "type":"getLength",
                "targetParticipantName":"name_length",
                "valueType":{
                    "type":"name",
                    "value":"name"
                }
            }

            Output:
            name_length = len(name)

            Note:
            I am establishing getLength as an axiomative primitive
            because I am synthesizing it onto an implementation that
            realizes its meaning (len())

            However, it is actually a composite primitive because it
            can be broken down into axiomatic primitives that establish
            the cardinality of the participant through its design.

            However, through the synthesis, I am making the claim that
            len() realizes the meaning of getLength. Eventually, the
            implementation of len() will be synthesized from the meaning
            estbalished through its semantic model and instead of my claim,
            the meaning itself will be self evident through its definition.

            TODO:
            Add a validation phase to establish that the semantics of the
            participant meet the requirements of the getLength primitive.
            This will flag if the design is inconsistent.
        '''
        value = transformation["valueType"]["value"]
        return ast.Assign(
            targets=[
                ast.Name(id=transformation["targetParticipantName"], ctx=ast.Store())
            ],
            value=ast.Call(
                func=ast.Name(id="len", ctx=ast.Load()),
                args=[
                    getVariableNameWithKeys("worldState", [value])
                ],
                keywords=[]
            )
        )
    
    def getReturnStatement(self):
        '''
            return {'worldState': worldState, 'nextBehavior': nextBehavior}
        '''
        return ast.Return(
            value=ast.Dict(
                keys=[
                    ast.Constant(value="worldState"),
                    ast.Constant(value="nextBehavior")
                ],
                values=[
                    ast.Name(id="worldState", ctx=ast.Load()),
                    ast.Name(id="nextBehavior", ctx=ast.Load())
                ]
            )
        )
