design = 'library_manager'

def createBasket():
    global worldState
    basket = []
    worldState['basket'] = 'basket'

def getName():
    global worldState
    name = input()
    worldState['name'] = 'name'

def addBookToBasket():
    global worldState
    book = worldState['book']
    basket = worldState['basket']
    basket.insert(0, book)
    worldState['basket'] = 'basket'