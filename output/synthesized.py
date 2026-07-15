import uuid
from LoggingHelper import semanticLogger

def createBook(worldState):
    semanticLogger.logBehavior('createBook')
    book = {}
    book['name'] = worldState['name']

def addBookToBasket(worldState):
    semanticLogger.logBehavior('addBookToBasket')

def getFirstLetterOfBookName(worldState):
    semanticLogger.logBehavior('getFirstLetterOfBookName')
    firstLetter = ''
    book_name = ''
    firstLetter = worldState['book_name'][0]

def getBookFromBasket(worldState):
    semanticLogger.logBehavior('getBookFromBasket')
    book = None
    book = worldState['basket'][0]

def acceptName(worldState, name):
    semanticLogger.logBehavior('acceptName')
    semanticLogger.logInput('acceptName', 'name', name)

def createBasket(worldState):
    semanticLogger.logBehavior('createBasket')
    basket = []

def getChoice(worldState, selectedOption):
    semanticLogger.logBehavior('getChoice')
    semanticLogger.logInput('getChoice', 'selectedOption', selectedOption)
    name_choice = 'a'
    isNameChoice = ''
    isNameChoice = selectedOption == name_choice
    get_book_choice = 'g'
    isGetBookChoice = ''
    isGetBookChoice = selectedOption == get_book_choice

def checkNameValidity(worldState):
    semanticLogger.logBehavior('checkNameValidity')
    invalid_length = 0
    name_length = None
    is_invalid_name = None
    name_length = len(worldState['name'])
    is_invalid_name = name_length == invalid_length
    is_valid_name = ''
    valid = '0'
    is_valid_name = is_invalid_name == valid