design = 'library_manager'

def createBasket():
    global worldState
    basket = []
    worldState['basket'] = 'basket'

def getName():
    global worldState
    name = input()
    worldState['name'] = 'name'