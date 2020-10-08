import React from 'react';

// GamePiece------------
// currentSlot: Slot
// player: Player
// color: player.gameColor

// game-slot game-piece

// <div style={{ height: 10 }}>
//   Hello World!
// </div>

class GamePiece extends React.Component {
    constructor(player, initialSlot)  {
        this.player = player;
        this.currentSlot = initialSlot;
    }
    render(){
        return (
            <div className="game-slot game-piece" style={{ backgroundColor: this.player.gameColor || "purple" }}>
                <span>
                    piece!
                </span>
            </div>
        );
    }
}

export default GamePiece;