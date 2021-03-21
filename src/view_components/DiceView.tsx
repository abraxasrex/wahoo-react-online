import React from 'react';
import GameManager from '../helpers/GameManager';

import Dot from './Dot';

interface iDiceViewProps {
    manager: any;
    setGame: any;
    currentRoll?: number;
    game: any;
}
function DiceView ({manager, setGame, currentRoll}: iDiceViewProps) {
   // manager.rollDice();
    function setDice(){

        const newRoll = manager.rollDice();
        // let managerState = props.game;
        // managerState.currentRoll = newRoll;
        setGame("currentRoll", newRoll);
    }
    
    const dots = [];
    for(var i = 0; i < manager.currentRoll; i++) {
        dots.push(i);
    }
    return (
        <div className="dice-view">
            <div className="dice-object">
                <div className="dice">
                    {dots.map((dot)=> {
                        return <Dot key={dot} />
                    })}
                </div>
                <p> current roll: {currentRoll || 0} </p>
                <p> current piece: {manager.currentPiece.key || 0} </p>
                <button onClick={(e) => setDice()}>
                    Roll Dice
                </button>
            </div>
        </div>
    );
}

export default DiceView;