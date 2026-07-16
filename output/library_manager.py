from synthesized import *

'''
    Temporary setup to connect the behaviors to the environment and
    test the synthesized design. 
    
    The text for the menu etc should come from the design but this
    was just a quick setup to test the synthesis and inspect the
    world state.
'''

def main():
    nextBehavior = "createBasket"
    worldState = {}

    while True:
        print("")
        if nextBehavior == "getChoice":
            selectedOption_input = input("Menu(a for add book or g for get book): ")
            output = globals()[nextBehavior](worldState, selectedOption_input)
        elif nextBehavior == "acceptName":
            name_input = input("Provide name: ")
            output = globals()[nextBehavior](worldState, name_input)
        else:
            output = globals()[nextBehavior](worldState)

        if output["nextBehavior"] is None:
            print("Next behavior not selected by design, exiting program.")
            break

        nextBehavior = output["nextBehavior"]
        print(output)


if __name__ == "__main__":
    main()