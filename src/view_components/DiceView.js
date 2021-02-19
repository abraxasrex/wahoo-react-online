import React from 'react';

import Dot from './Dot';


function DiceView (props) {

    function setDice(props){

        const newRoll = props.game.manager.rollDice();
        let managerState = props.game.manager;
        managerState.currentRoll = newRoll;
        props.setGame({manager: managerState});
    }
    
    const dots = [];
    for(var i = 0; i < props.manager.currentRoll; i++) {
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
                <p> current roll: {props.game.manager.currentRoll || 0} </p>
                <p> current piece: {props.game.manager.currentPieceId || 0} </p>
                <button onClick={(e) => setDice(props)}>
                    Roll Dice
                </button>
            </div>
        </div>
    );
}

export default DiceView;