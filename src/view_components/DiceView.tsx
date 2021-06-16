import React from 'react';
import GameManager from '../helpers/GameManager';

import Dot from './Dot';

import {iDiceViewProps} from '../interfaces/index';

function DiceView ({manager, setGame, game, currentRoll}: iDiceViewProps) {

    async function setDice(e: any){
        const newRoll = await manager.rollDice(game, setGame);
        console.log("currentRoll from props: ", currentRoll);
    }
    
    const dots = [];
    for(var i = 0; i < game.currentRoll; i++) {
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
                {/* <p> current roll: {game.currentRoll || 0} </p>
                <p> current piece: {game.currentPiece?.key || 0} </p> */}
                <button onClick={(e) => setDice(e)}>
                    Roll Dice
                </button>
            </div>
        </div>
    );
}

export default DiceView;