design = 'library_manager'

def createBasket():
    global worldState
    basket = []
    worldState['basket'] = basket
    return 'getName'

def getName():
    global worldState
    name = input()
    worldState['name'] = name
    return 'createBook'

def addBookToBasket():
    global worldState
    book = worldState['book']
    basket = worldState['basket']
    basket.insert(0, book)
    worldState['basket'] = basket
    return 'getName'