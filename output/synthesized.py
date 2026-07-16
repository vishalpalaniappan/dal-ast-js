import uuid
from LoggingHelper import semanticLogger

def createBook(worldState):
    semanticLogger.logBehavior('createBook')
    book = {}
    book['name'] = name
    nextBehavior = 'addBookToBasket'
    return {'worldState': worldState, 'nextBehavior': nextBehavior}

def addBookToBasket(worldState):
    semanticLogger.logBehavior('addBookToBasket')
    nextBehavior = 'getChoice'
    return {'worldState': worldState, 'nextBehavior': nextBehavior}

def getFirstLetterOfBookName(worldState):
    semanticLogger.logBehavior('getFirstLetterOfBookName')
    firstLetter = ''
    book_name = ''
    worldState['firstLetter'] = worldState['book_name'][0]
    nextBehavior = 'getChoice'
    return {'worldState': worldState, 'nextBehavior': nextBehavior}

def getBookFromBasket(worldState):
    semanticLogger.logBehavior('getBookFromBasket')
    book = None
    worldState['book'] = worldState['basket'][0]
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
    invalid_length = 0
    name_length = None
    is_invalid_name = None
    name_length = len(worldState['name'])
    is_invalid_name = name_length == invalid_length
    if is_invalid_name:
        nextBehavior = 'acceptName'
    is_valid_name = ''
    valid = '0'
    is_valid_name = is_invalid_name == valid
    if is_valid_name:
        nextBehavior = 'createBook'
    return {'worldState': worldState, 'nextBehavior': nextBehavior}