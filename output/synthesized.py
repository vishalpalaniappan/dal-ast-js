import uuid
from LoggingHelper import semanticLogger

def createBook(worldState):
    semanticLogger.logBehavior('createBook')
    name = ''
    name = worldState['name']
    book = {}
    book['name'] = name
    worldState['book'] = book
    nextBehavior = 'addBookToBasket'
    return {'worldState': worldState, 'nextBehavior': nextBehavior}

def addBookToBasket(worldState):
    semanticLogger.logBehavior('addBookToBasket')
    basket = []
    basket = worldState['basket']
    book = {}
    book = worldState['book']
    basket.insert(0, book)
    worldState['basket'] = basket
    nextBehavior = 'getChoice'
    return {'worldState': worldState, 'nextBehavior': nextBehavior}

def getFirstLetterOfBookName(worldState):
    semanticLogger.logBehavior('getFirstLetterOfBookName')
    book = {}
    book = worldState['book']
    firstLetter = ''
    book_name = book['name']
    firstLetter = book_name[0]
    worldState['firstLetter'] = firstLetter
    nextBehavior = 'getChoice'
    return {'worldState': worldState, 'nextBehavior': nextBehavior}

def getBookFromBasket(worldState):
    semanticLogger.logBehavior('getBookFromBasket')
    basket = []
    basket = worldState['basket']
    book = {}
    book = basket[0]
    basket.pop(0)
    worldState['basket'] = basket
    nextBehavior = 'getFirstLetterOfBookName'
    return {'worldState': worldState, 'nextBehavior': nextBehavior}

def acceptName(worldState, name_input):
    semanticLogger.logBehavior('acceptName')
    semanticLogger.logInput('acceptName', 'name_input', name_input)
    worldState['name'] = name_input
    nextBehavior = 'checkNameValidity'
    return {'worldState': worldState, 'nextBehavior': nextBehavior}

def createBasket(worldState):
    semanticLogger.logBehavior('createBasket')
    basket = []
    worldState['basket'] = basket
    nextBehavior = 'getChoice'
    return {'worldState': worldState, 'nextBehavior': nextBehavior}

def getChoice(worldState, selectedOption_input):
    semanticLogger.logBehavior('getChoice')
    semanticLogger.logInput('getChoice', 'selectedOption_input', selectedOption_input)
    worldState['selectedOption'] = selectedOption_input
    name_choice = 'a'
    isNameChoice = selectedOption_input == name_choice
    if isNameChoice:
        nextBehavior = 'acceptName'
    get_book_choice = 'g'
    isGetBookChoice = selectedOption_input == get_book_choice
    if isGetBookChoice:
        nextBehavior = 'getBookFromBasket'
    return {'worldState': worldState, 'nextBehavior': nextBehavior}

def checkNameValidity(worldState):
    semanticLogger.logBehavior('checkNameValidity')
    name = ''
    name = worldState['name']
    invalid_length = 0
    name_length = len(name)
    is_invalid_name = name_length == invalid_length
    if is_invalid_name:
        nextBehavior = 'acceptName'
    else:
        nextBehavior = 'createBook'
    return {'worldState': worldState, 'nextBehavior': nextBehavior}