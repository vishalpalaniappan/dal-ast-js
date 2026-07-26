import sqlite3

def initializeConnection():
    global connection, cursor
    connection = sqlite3.connect("my_database.db")
    cursor = connection.cursor()

def createTable():
    global cursor
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        )
    """)
    connection.commit()

def receiveName():
    global name
    name = input("\nAdd Name: ")

def writeToDatabase():
    cursor.execute(
        "INSERT INTO users (name) VALUES (?)",
        (name,),
    )
    connection.commit()


