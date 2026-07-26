from registered import *

# Manually built this to just explore the synthesis, but its trivial to expand the synthesizer
# to support these opaque registered transformations.

def run():
    next_behavior = "createDatabaseConnection"

    while next_behavior:
        if next_behavior == "createDatabaseConnection":
            initializeConnection()
            next_behavior = "createTable"

        elif next_behavior == "createTable":
            createTable()
            next_behavior = "receiveName"

        elif next_behavior == "receiveName":
            receiveName()
            next_behavior = "writeToDatabase"

        elif next_behavior == "writeToDatabase":
            writeToDatabase()
            next_behavior = "receiveName"

        else:
            break


if __name__ == "__main__":
    run()