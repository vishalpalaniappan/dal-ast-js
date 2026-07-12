import uuid
from LoggingHelper import semanticLogger

def createBook(worldState):
    semanticLogger.logBehavior(createBook)
    book = {'uid': str(uuid.uuid4()), 'value': 'book'}
    book['name'] = name

def addBookToBasket(worldState):
    semanticLogger.logBehavior(addBookToBasket)

def getFirstLetterOfBookName(worldState):
    semanticLogger.logBehavior(getFirstLetterOfBookName)
    firstLetter = {'uid': str(uuid.uuid4()), 'value': 'firstLetter'}
    book_name = {'uid': str(uuid.uuid4()), 'value': 'book_name'}

def getBookFromBasket(worldState):
    semanticLogger.logBehavior(getBookFromBasket)
    book = {'uid': str(uuid.uuid4()), 'value': 'book'}

def acceptName(worldState, name):
    semanticLogger.logBehavior(acceptName)
    semanticLogger.logInput('acceptName', 'name', name)

def createBasket(worldState):
    semanticLogger.logBehavior(createBasket)
    basket = {'uid': str(uuid.uuid4()), 'value': 'basket'}

def getChoice(worldState, selectedOption):
    semanticLogger.logBehavior(getChoice)
    semanticLogger.logInput('getChoice', 'selectedOption', selectedOption)
    name_choice = {'uid': str(uuid.uuid4()), 'value': 'name_choice'}
    isNameChoice = {'uid': str(uuid.uuid4()), 'value': 'isNameChoice'}
    get_book_choice = {'uid': str(uuid.uuid4()), 'value': 'get_book_choice'}
    isGetBookChoice = {'uid': str(uuid.uuid4()), 'value': 'isGetBookChoice'}