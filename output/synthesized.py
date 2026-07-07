import uuid
from LoggingHelper import semanticLogger

def behavior1(book):
    semanticLogger.logPreParticipant(book)
    bookName = {'uid': str(uuid.uuid4()), 'value': 'Harry Potter'}
    book['name'] = 'Harry Potter'
    book['name'] = 'Harry Potter'
    semanticLogger.logPostParticipant(book)
    semanticLogger.logPostParticipant(bookName)

def behavior2(book):
    semanticLogger.logPreParticipant(book)
    sample = {'uid': str(uuid.uuid4()), 'value': 1}
    sample = 2 + 3
    semanticLogger.logPostParticipant(book)
    semanticLogger.logPostParticipant(sample)