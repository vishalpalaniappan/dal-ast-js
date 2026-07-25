Writing down some notes here as I am working through the design validator:

- As I was processing this, I decided that I would create a participant declaration block and in it, I would establish the participants, their types, allowed transformations domain structure etc.
- When I call the create command, it will create a participant of a particular type and assign it a UID.
- Then when I save that participant to the world state or access it anywhere else, I have the UID that traces it back to the creation. 
- When a participant interacts with a transformation, for example, insert book into basket, their types will be checked to see if book is allowed to be inserted into basket.