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

        # Process transformation here
        for transformation in node["transformations"]:
            if (transformation["type"] == "set"):
                stmt = self.getSetStatement(transformation)
                if stmt is not None:
                    body.append(stmt)
            elif (transformation["type"] == "binop"):
                stmt = self.getBinOpStatement(transformation)
                if stmt is not None:
                    body.append(stmt)
            elif (transformation["type"] == "log" and transformation["isInput"]):
                logStmt = getInputLogStmt(node['behavior'], transformation["participant"])
                args.append(transformation["participant"])
                body.append(logStmt)
            elif (transformation["type"] == "getLength"):
                stmt = self.getGetLengthStatement(transformation=transformation)
                body.append(stmt)
            else:
                print(f"Unsupported transformation: {transformation}")


        # Create function
        return getFunctionDef(node['behavior'], args, body)
    
    def getNodeByType(self, meta):
        '''
            Returns the node by type:
            "constant": returns a constant node with the value
            "name": returns a name node with the value
        '''
        if meta["type"] == "constant":
            return getConstant(meta["value"])
        elif meta["type"] == "name":
            return getVariableNameWithKeys("worldState", [meta["value"]])
        else:
            print(f"Unsupported type: {meta['type']}")
            return None
    
    def getSetStatement(self, transformation):
        '''
            This function processes a set transformation and returns the corresponding AST node.
        '''
        print(f"Processing set transformation: {transformation}")

        if (len(transformation["keys"])) > 0:
            name = getVariableNameWithKeys(transformation["targetParticipantName"], transformation["keys"])
        else:
            name = getName(transformation["targetParticipantName"], ast.Store())

        # Get name node and value or constant based on transformation
        value = self.getNodeByType(transformation["valueType"])

        if (len(transformation["keys"])) > 0:            
            return getAssign(name, value)
        else:
            # This is where a participant is being created so we assign a UID
            assign_node = getAssignWithUid(name, value)
            return assign_node
            
    
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
                    ast.Name(id=value, ctx=ast.Load())
                ],
                keywords=[]
            )
        )
