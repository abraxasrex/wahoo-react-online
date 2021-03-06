import React, {useState, useEffect} from 'react';
import GameBoard from './GameBoard';
import DiceView from './DiceView';
import PlayerView from './PlayerView';
import Slot from './Slot'
import GamePiece from './GamePiece';

import {Game, iGame} from '../classes/Game';

import Slots from './Slots';
import Pieces from './Pieces';
import PlayerViews from './PlayerViews';

import {iGameViewProps} from '../interfaces/index';

   // UI
   const selectPiece = (id: string, game: iGame, setGame: any, manager: any) => {
        return manager.selectPiece(id, game, setGame);

    }

    const cancelSelect = (manager: any, state: iGame, stateSetter:any) => {
        manager.cancelSelect(state, stateSetter);
    }

    const moveToSlot = (targetSlot: any, lastSlot: any, manager: any, game: iGame, setGame: any) => {
        manager.moveToSlot(targetSlot, lastSlot, game, setGame);
    }

    const GameView = ({startGame, players, game, setGame, manager, _slots, _pieces}: iGameViewProps) => {
 

        let slots: JSX.Element[] = _slots;
        let pieces: JSX.Element[] = _pieces;

        const updateEntities = () => {
            if(_slots) {
                slots = Object.entries(_slots).map((slotPair: any)=> {
                    return <Slot game={game} setGame={setGame} key={slotPair[0]}
                                 availableSlots={game.availableSlots}
                                slot={slotPair[1]} manager={manager} moveToSlot={moveToSlot}>
                            </Slot>
                }) || [];
            }
          
        
           
            if(_pieces) {
                pieces = Object.entries(_pieces).map((piecePair: any)=> {
                    return <GamePiece game={game} setGame={setGame} key={piecePair[0]}
                                moveToSlot={moveToSlot}
                                selectPiece={selectPiece} cancelSelect={cancelSelect}
                                piece={piecePair[1]} manager={manager}>
                            </GamePiece>
                }) || [];
            }

            if(!game.currentPlayer) {
                startGame(game, setGame);
            }
        }

        useEffect(() => {
            updateEntities();
          });


   
   updateEntities();

    return (
        <div className="wahoo-game">
            <PlayerViews players={players} game={game}></PlayerViews>
            <div>
                <GameBoard game={game} manager={manager} setGame={setGame} 
                    selectPiece={selectPiece} moveToSlot={moveToSlot}>
                    <Slots game={game} manager={manager}  slots={slots || []} />
                    <Pieces game={game} manager={manager}  pieces={pieces || []} />
                </GameBoard>
            </div>
            <div>
                <DiceView manager={manager} currentRoll={game.currentRoll}
                game={game} setGame={setGame}></DiceView>
            </div> 
        </div>
    );
}

export default GameView;