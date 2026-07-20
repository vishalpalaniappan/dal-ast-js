class Synthesizer:
    
    def __init__(self, tree):
        self.tree = tree

    def run(self):
        self.processTree(self.tree, 0)

    def processTree(self, tree, indent):
        if "body" in tree:
            self.printTree(indent, tree["type"])
            for node in tree["body"]:
                self.processTree(node, indent + 1)
        else:
            self.printTree(indent, tree)

    def printTree(self, indent, value):
        spaces = (indent * 4) * " "
        print(f"{spaces}{value}")


    