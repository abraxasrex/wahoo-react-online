
// gameStartReady
// - all clients will listen to this, and triggering the event will route them
//    to the active game room /oofda/:id

// * see if you can adapt existing lobby code to hook into active game * //

// gameAction:
// - emit a game action of type diceRoll, player move, etc.
// - utilize existing auto-move behavior; instead of "testMode"
//    build up a "multiPlayer" mode
