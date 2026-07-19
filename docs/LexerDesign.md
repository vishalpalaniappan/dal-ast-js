Lexer Design:

Participants:
- Source
- Scan Position
- ScannedTokens
- Evaluator (given char, finds matches)

Steps:
1. Accept Source
2. Set Start Position
3. Read Current Position
4. Get Evaluator Results
5. If Match, scan forward until result is identified
6. Add to ScannedTokens
7. Increment Position
8. A: If end of file, exit.
8. B: Else Go to step 3

Description:

The purpose is to tokensize the source so that the parser can apply the grammar and produce the AST. So it reads each char at a time and identifies the token. If there are more than one match, it scans forward until only one token is left. 

Currently, I am ignoring blank spaces. New lines are used to keep track of the line number.