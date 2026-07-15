import uuid
from LoggingHelper import semanticLogger

def createBook(worldState):
    semanticLogger.logBehavior('createBook')
    book = 'book'
    book['name'] = worldState['name']

def addBookToBasket(worldState):
    semanticLogger.logBehavior('addBookToBasket')

def getFirstLetterOfBookName(worldState):
    semanticLogger.logBehavior('getFirstLetterOfBookName')
    firstLetter = 'firstLetter'
    book_name = 'book_name'
    firstLetter = book_name[0]

def getBookFromBasket(worldState):
    semanticLogger.logBehavior('getBookFromBasket')
    book = 'book'
    book = basket[0]

def acceptName(worldState, name):
    semanticLogger.logBehavior('acceptName')
    semanticLogger.logInput('acceptName', 'name', name)

def createBasket(worldState):
    semanticLogger.logBehavior('createBasket')
    basket = 'basket'

def getChoice(worldState, selectedOption):
    semanticLogger.logBehavior('getChoice')
    semanticLogger.logInput('getChoice', 'selectedOption', selectedOption)
    name_choice = 'name_choice'
    isNameChoice = 'isNameChoice'
    isNameChoice = selectedOption == name_choice
    get_book_choice = 'get_book_choice'
    isGetBookChoice = 'isGetBookChoice'
    isGetBookChoice = selectedOption == get_book_choice