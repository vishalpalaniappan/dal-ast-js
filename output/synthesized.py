import uuid
from LoggingHelper import semanticLogger

def createBook(worldState):
    semanticLogger.logBehavior('createBook')
    name = worldState['name']
    nextBehavior = 'addBookToBasket'
    return {'worldState': worldState, 'nextBehavior': nextBehavior}

def addBookToBasket(worldState):
    semanticLogger.logBehavior('addBookToBasket')
    basket = worldState['basket']
    book = worldState['book']
    nextBehavior = 'getChoice'
    return {'worldState': worldState, 'nextBehavior': nextBehavior}

def getFirstLetterOfBookName(worldState):
    semanticLogger.logBehavior('getFirstLetterOfBookName')
    book = worldState['book']
    book_name = book['name']
    firstLetter = worldState['book_name'][0]
    nextBehavior = 'getChoice'
    return {'worldState': worldState, 'nextBehavior': nextBehavior}

def getBookFromBasket(worldState):
    semanticLogger.logBehavior('getBookFromBasket')
    basket = worldState['basket']
    book = worldState['basket'][0]
    nextBehavior = 'getFirstLetterOfBookName'
    return {'worldState': worldState, 'nextBehavior': nextBehavior}

def acceptName(worldState, name_input):
    semanticLogger.logBehavior('acceptName')
    semanticLogger.logInput('acceptName', 'name_input', name_input)
    nextBehavior = 'checkNameValidity'
    return {'worldState': worldState, 'nextBehavior': nextBehavior}

def createBasket(worldState):
    semanticLogger.logBehavior('createBasket')
    nextBehavior = 'getChoice'
    return {'worldState': worldState, 'nextBehavior': nextBehavior}

def getChoice(worldState, selectedOption_input):
    semanticLogger.logBehavior('getChoice')
    semanticLogger.logInput('getChoice', 'selectedOption_input', selectedOption_input)
    isNameChoice = selectedOption_input == name_choice
    if isNameChoice:
        nextBehavior = 'acceptName'
    isGetBookChoice = selectedOption_input == get_book_choice
    if isGetBookChoice:
        nextBehavior = 'getBookFromBasket'
    return {'worldState': worldState, 'nextBehavior': nextBehavior}

def checkNameValidity(worldState):
    semanticLogger.logBehavior('checkNameValidity')
    name = worldState['name']
    name_length = len(worldState['name'])
    is_invalid_name = name_length == invalid_length
    return {'worldState': worldState, 'nextBehavior': nextBehavior}