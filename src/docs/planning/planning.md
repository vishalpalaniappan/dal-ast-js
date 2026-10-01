## Planning

In this document, I will work through my thoughts on the necessary features for the validator. 

This has a few steps:
- Define the features that a computable semantic model needs to be able to support.
- The easiest way to do this is to use a sample design and then think about what it would mean to reason about it
- Using this, I can break it down into more steps and then start to populate the library that can perform the reasoning
- An example that has been partially explored is:
    - identify the invariant
    - identify the relevant participants and or relevate attributes
    - identify all the paths from creation to the invariant
    - identify where the participant was last updated on the path to place invariant
    - identify node where semantic validity would be restored
    - This can be optimized, its an early thought
- There is a more general pattern that will emerge through this process.

I already explored the actual AST implementation, implementing this part has more to do with understanding what needs to be supported by the library and implementing it. I will proceed with the actual implementation once I have established the necessary structure.