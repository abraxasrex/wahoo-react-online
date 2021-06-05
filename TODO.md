Classes:

Game

Player

Board


Components:

GameScreen

GameDisplay - display player turn and color

Player - hasCurrentTurn, playerColor




Functions:

onDragPiece

onCancelDragPiece

onConfirmPieceMove

setInitialBoard

checkForWin




Order of Operations:

startGame() --> Game instance

Game instance: setInitialBoard
 - setPieceSlots ()
 - set InitialPieces ()

setInitialBoard ----> initializePlayers();

setTurn (for player 1)

(player 1 does stuff, then confirms move)

cycleTurnToNext()

(if CheckWin returns true) ---> ShowWinCondition()

(a user clicks play again ) ---> startGame()





------------------------------ CLASSES -------------------------------------

Game --------------------------
gameView: GameView
players: Players[]
gameManager: GameManager;



GameView -----------------------
gameBoard: GameBoard
diceView: DiceView
playerViews: PlayerViews []



GameManager -----------------------
currentRoll: int
currentPlayer: Player
winner: Player

setupGame() --->
setPlayer(0) ---->
checkforWin () ---->
    currentPlayer.homeSlotCount === 4 ? triggerwinCondition(currentPlayer)
triggerWinCondition(player)
--------------------------------------------



DiceView ---------------------------
canPress: currentPlayer = event triggerer, currentRoll === (falsey || 6) 
* button appears disabled to !currentPlayer
rollButton (<>) ---> rollDice()
rollDice() --->
    gameManager.currentRoll = getRandomInt(6) + 1
    if gm.currentRoll === 1 --> player ca move from start
    else if gm.currentRoll !== 6 --> gm.nextTurn()

PlayerView ------------------
name: string
currentScore: number
---------------------


GameBoard----------------------
Slots: Slot[]
------------------------


Player-----------------------
GamePieces: GamePiece []
selectedSlot: Slot
selectedPiece: GamePiece
_id: string
playerNumber: 1 | 2 | 3 | 4
gameColor: string (red | yellow | green | blue)

selectSlot(slot) ---->
// if slot.occupied ==== player
// 
//
//
//
    Slot.isOccupied && ()
changeSelectSlot() ---> 
    slot.occupied? slot.canMove = true : slot.canMove  = false;
selectSlot() ---->
    slot.selectedSlot 
---------------------------------------


Slot--------------
x: int
y: int
occupied: GamePiece | falsey
slotType: "Track" | "Start" | "End"
order: 0-56 (track), 0-4 (start, end)
owner: Player ()
------------------------


GamePiece------------
currentSlot: Slot
player: Player
color: player.gameColor
------------------------


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Q1: how to determine order of travel for gamepieces, from starting point? 
//A1: give a count when creating the tracks, and an entry point some how for end and start.
//   restart from end of track to 0
// Q2: how to let game pieces travel onto EndLane ?

Q3: how to load gamepieces with an initial slot?

todo:

1. change all the new instances to props for react components until things aren't broken

2. get wahoo board to show up properly (tie style position to a state object for position matrix, maybe tie in a method to map the 50 x 50 grid to the pixels themselves)

todo: 

1. ensure generated x and y values match expected
2. find correct multipliers to spread the grid across the page

todo [10/12]: 

1. write diagonal slotmaking code [done]

2. plan pathfinding from Start to Track and from Track to End [10/14 - 10/16]

- get list of all "next" Track slots, based on their order number
- add to this all "next" slots starting from order 0, of type "End", and matching the player
- caveat for center slot, if you're at one of four jump positions (note these), you can jump to the middle
- ok, so basically you need *corner* *side* , and *entry* slots on the Track to allow jumps to home, from Start, and
    across Center. these are what allow the special rules to take place.
- if Corner slot, and your current MovementRange is at least 1, you can move forward (and only forward this direction?) 
  onto the End slot range. This means your highlighted potential Slots will be those with a count within your MovementRange, and unoccupied, and of course in your own Player Lane.
- if you roll a 6 or 1 (?), you get out of Home. That means your HighlightedPiece will be the Entry Slot matching your 
   Player
- If you are on a spot matching the "Corner" designation and have a roll of at least 1 (or also 6?), you can move the 
  piece to 

todo [10/15]:

1. setup setState and props event so Dice rolls will work correctly [10/20]
2. set up gamepieces [10/23]

todo [10/27]:
1. event when selecting gamePiece that highlights it and available slots [10/27]


todo [1/27]:

1. assign specialSlot to player. problem: slot data gets processed, not slot iself
solution: specialslots need to be reckoned with by addslot being called with special info in mind, from setPositions

2. get first place slot highlighting for once!
------------------------------------------------------------
todo [2/18]:

I. base game

1. movePiece logic. Story:
a. doubleclicking (?) an availableSlot should move the game piece to it
a1. doubleclick event that triggers movePiece; might need resetPiecesAndSlots
a2. movePiece function: cannibalize setPiece code for this if necessary
( this will not be fullproof until after 2)
a3. change turns/players. might want to indicate this on the current player's "console"


2. piece movement logic while on track
a. calculate # of steps based on current roll
d. if player's piece, count up step but do not highlight/ allow move
a2. write tests for 1-2 !!! this will save you time and thought!


a. write optional testing starting places for piece : capture player, jump, exit lane, and dont capture own piece
d2. currently, you can get out of Entry slots onto your own piece (there's a poor game design element potentially where the player's slot map isn't updated)
b. highlight slots for step # until  players piece
b. highlight slots for step # until hitting exit which belongs to player

-------------------
build notes:

cmd: chrome.exe --remote-debugging-port=9222 --user-data-dir=remote-profile
tsc - w
npm start
-------------------
bug 2: piece will move to track corresponding #, not end lane
c. if highlight encompasses player exit, and there are remaining steps, start highlighting those


-------------- [ ongoing refactor] ---------------------
1. Move Slots and Pieces into container Components
2. Reconcile new relationship between GameView and GameBoard (or just remove the latter)
3. Get UI events pipelined down to Slots and GamePieces

3.5. restructure playerviews to use entries
4. turn off test piece setting, just get pieces and slots to appear on the board
4.5. get pieces back on the board
4.75. get rolling mechanism back on track
5.1. specialSlots do not exist for player atm! this is necessary to know where the Entry slot is
5.2. highlight piece track
5.0. moveHere in manager: chain should maintain its own state until setting state at the very end. there is similar "newState" functionality already in the manager anyway.
5. get back to piece moving functionality: fix moveHere function


6. get back to testing mode functionality
a. upon moving into end lane of the same color, a piece will enter that lane, and move up that "Count" rather than the count of the main board.
b. upon moving onto a jump slot, the piece will be able to "jump" through the middle
b. you can land on your own track piece currently :()
c. upon moving to a piece of another color, that piece will be sent home, and the selected piece will occupy its square.
7. expected behavior for all game pieces (big deliverable!)

7a. endSlots:
1. set a test position where every player has pieces in range of the end goal
2. make sure pieces can move in normally
3. if 4 pieces go in, they should win home.

8b. fix any bugs that might arise during this process...
- each player gets an endCounter
- if they move a piece onto a slot with iSlotType End, their endCounter goes up one
- if their endCounter reaches 4, a popup says they win the game.

9. make a menu that takes you to a game lobby when you click a button
9b. lobby should take you to the game.

[here]

10. hook sockets up to the lobby; when four people join, the button should be enabled to start game.
https://www.valentinog.com/blog/socket-react/

11. on playing game, control should change based on turn to the person whose round it is.

12. on winning: popup appears with option to (for winner to choose):
a. play again [with same team]
b. go back to menu

12. add animations, music, pizazz, etc, to game.

13. find a way to host it.


-------- [potential refactor] --------------------
1. checkpoint to prevent duplicate key creation
2. standardization of piece and slot keys!
3. store Slots as a map, but *with* their order as key (*gasp*). make extra sure that no slot can possibly be added with same key tho
4. decouple Slot/GamePiece elements from being held in memory.....this seems more and more wrong as time goes on lol.....

A. Solve some of this by moving logic into <Game />, not an abstract Manager
B. Move to Redux as Single source of truth.

----------------------------------

bug 1: slots with matching order #s are getting confused with one another during play. there are also duplicate keys.
3. if movePiece onto other player's piece, send their piece home after you move yours
4. if movepiece onto a jump slot, and roll is 1, allow highlighting thru jump zone

6. logic for rolling 6: countSixes,  allow an extra move after first 6, ... consult Dad
6.5. if rolled once and not a six, changeplayer. also allow for "counting" sixes.
7. rename project Oofda
8. if piece in exit lane, can only move further up exit lane

8b. write an AI to "play" the game with a short timeout to watch it progress.
9. if all pieces in exit lane, player wins game. throw up an alert for now
9b. option to restart game, make sure that works.


II. online component

1. Option on landing to either join game or start new game
2. https://dev.to/sauravmh/browser-game-design-using-websockets-and-deployments-on-scale-1iaa
3. https://codeburst.io/how-to-make-a-simple-multiplayer-online-car-game-with-javascript-89d47908f995
--------------------------------------------

specialSlotType: Entry, Exit, Jump, or [null]

- if the selected piece is slotType:Start, and current roll is 1 or 6, highlight 
- if slotType is track, and you are not yet to your endgame spot, keep going up count and adding slots to availableSlots. you only should get one pass by 0 before getting blocked though.
- if Slottype is Center, only possible availableSlot is Jump and relevant roll is 1
- if there is a jump, entry, or endgame slot in your availableSlot, for each of these go to secondaryPathfind()
- secondaryPathfind, if this.currentRoll - availableSlots > 0, apply this count and add units with the same End type, or apply a one count to the Center slot.
- you can only get to CenterSlot if it is the last stage in your availableSlots

2. ability to move gamepiece (drag & drop?) to unoccupied spot.
3. calculate based on rolls whether there is time for another roll

todo [next]:
1. sense when it's time for next turn. announce somehow and set a timeout?

todo [next]
1. pathfinding for all cases (Track, End, Entry, and Center)

todo [next]: 
1. get gamemanager to recognize win condition. announcement.
2. option to play again.


todo [next]:

1. Socket communication

todo [next]:

1. socket game login condition

todo [next]:

1. socket game logout condition

todo [next]:

1. generalized cleanup

todo [next]:

1. UI cleanup



 --------- Best practices changes: -----------
 1. move any functions, constants etc possible to own files.
 2. stop hauling your ownstate management: switch over to redux or something.