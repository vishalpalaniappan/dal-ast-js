design = 'library_manager'

def createBasket():
    global worldState
    basket = []
    worldState['basket'] = basket
    return 'getName'

def getName():
    global worldState
    name = input('Please enter book name')
    worldState['name'] = name
    return 'createBook'

def createBook():
    global worldState
    name = worldState['name']
    book = {}
    book['name'] = name
    worldState['book'] = book
    return 'addBookToBasket'

def addBookToBasket():
    global worldState
    book = worldState['book']
    basket = worldState['basket']
    basket.insert(0, book)
    worldState['basket'] = basket
    return 'getName'

if __name__ == '__main__':
    nextBehavior = 'createBasket'
    worldState = {}
    while nextBehavior:
        nextBehavior = globals()[nextBehavior]()