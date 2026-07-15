import uuid
from LoggingHelper import semanticLogger

def createBook(worldState):
    semanticLogger.logBehavior('createBook')
    worldState['book'] = {}
    worldState['book']['name'] = worldState['name']
    nextBehavior = 'addBookToBasket'
    return {'worldState': worldState, 'nextBehavior': nextBehavior}

def addBookToBasket(worldState):
    semanticLogger.logBehavior('addBookToBasket')
    nextBehavior = 'getChoice'
    return {'worldState': worldState, 'nextBehavior': nextBehavior}

def getFirstLetterOfBookName(worldState):
    semanticLogger.logBehavior('getFirstLetterOfBookName')
    worldState['firstLetter'] = ''
    worldState['book_name'] = ''
    worldState['firstLetter'] = worldState['book_name'][0]
    nextBehavior = 'getChoice'
    return {'worldState': worldState, 'nextBehavior': nextBehavior}

def getBookFromBasket(worldState):
    semanticLogger.logBehavior('getBookFromBasket')
    worldState['book'] = None
    worldState['book'] = worldState['basket'][0]
    nextBehavior = 'getFirstLetterOfBookName'
    return {'worldState': worldState, 'nextBehavior': nextBehavior}

def acceptName(worldState, name_input):
    semanticLogger.logBehavior('acceptName')
    semanticLogger.logInput('acceptName', 'name_input', name_input)
    worldState['worldState']['name'] = worldState['name_input']
    nextBehavior = 'checkNameValidity'
    return {'worldState': worldState, 'nextBehavior': nextBehavior}

def createBasket(worldState):
    semanticLogger.logBehavior('createBasket')
    worldState['basket'] = []
    nextBehavior = 'getChoice'
    return {'worldState': worldState, 'nextBehavior': nextBehavior}

def getChoice(worldState, selectedOption_input):
    semanticLogger.logBehavior('getChoice')
    semanticLogger.logInput('getChoice', 'selectedOption_input', selectedOption_input)
    worldState['worldState']['selectedOption'] = worldState['selectedOption_input']
    worldState['name_choice'] = 'a'
    worldState['isNameChoice'] = ''
    isNameChoice = selectedOption == name_choice
    if isNameChoice:
        nextBehavior = 'acceptName'
    worldState['get_book_choice'] = 'g'
    worldState['isGetBookChoice'] = ''
    isGetBookChoice = selectedOption == get_book_choice
    if isGetBookChoice:
        nextBehavior = 'getBookFromBasket'
    return {'worldState': worldState, 'nextBehavior': nextBehavior}

def checkNameValidity(worldState):
    semanticLogger.logBehavior('checkNameValidity')
    worldState['invalid_length'] = 0
    worldState['name_length'] = None
    worldState['is_invalid_name'] = None
    name_length = len(worldState['name'])
    is_invalid_name = name_length == invalid_length
    if is_invalid_name:
        nextBehavior = 'acceptName'
    worldState['is_valid_name'] = ''
    worldState['valid'] = '0'
    is_valid_name = is_invalid_name == valid
    if is_valid_name:
        nextBehavior = 'createBook'
    return {'worldState': worldState, 'nextBehavior': nextBehavior}