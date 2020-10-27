import React from 'react';




function DiceView (props) {

    function setDice(props){

        const newRoll = props.game.manager.rollDice();
        let managerState = props.game.manager;
        managerState.currentRoll = newRoll;
        props.setGame({manager: managerState});
    }
    
    // render () {
        const dots = [];
        for(var i = 0; i < props.manager.currentRoll; i++) {
            dots.push(<div className="dot">.</div>)
        }
        return (
            <div className="dice-view">
                <div className="dice-object">
                    <div className="dice">
                        {dots}
                    </div>
                    <p> current roll: {props.game.manager.currentRoll || 0} </p>
                    <p> current piece: {props.game.manager.currentPiece || 0} </p>
                    <button onClick={(e) => setDice(props)}>
                        Roll Dice
                    </button>
                </div>
            </div>
        );
    // }
}

export default DiceView;