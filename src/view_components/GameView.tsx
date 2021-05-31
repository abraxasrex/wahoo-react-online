import React, {useState, useEffect} from 'react';
import GameBoard from './GameBoard';
import DiceView from './DiceView';
import PlayerView from './PlayerView';
import Slot from './Slot'
import GamePiece from './GamePiece';

import {Game, iGame} from '../classes/Game';
import {colorSet } from '../classes/Game';

import {iPlayer, Player} from '../classes/Player';

import {GameManager} from '../helpers/GameManager';
import { iSlot } from '../classes/Slot';

import Slots from './Slots';
import Pieces from './Pieces';
import PlayerViews from './PlayerViews';

interface iGameViewProps {
    startGame: Function;
    players: iPlayer[];
    game: iGame;
    setGame: any;
    manager: any;
    _slots: any;
    _pieces: any;
}

   // UI
   const selectPiece = (id: string, game: iGame, setGame: any, manager: any) => {
        return manager.selectPiece(id, game, setGame);
    //   this.resetPiecesAndSlots();
     //   return true;
    }

    // asyncSelectPiece(id: string) {
    // await this.selectPiece(id);
    // }

    const cancelSelect = (manager: any, state: iGame, stateSetter:any) => {
        manager.cancelSelect(state, stateSetter);
    //   this.resetPiecesAndSlots();
    }

    const moveToSlot = (targetSlot: any, lastSlot: any, manager: any, game: iGame, setGame: any) => {
        manager.moveToSlot(targetSlot, lastSlot, game, setGame);
    // this.resetPiecesAndSlots();
    }

    const GameView = ({startGame, players, game, setGame, manager, _slots, _pieces}: iGameViewProps) => {
 
    // let players: iPlayer[] = [];

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
            // Update the document title using the browser API
            updateEntities();
          });
    // useEffect(()=> {
    //     if(game.currentRound === 0) {
    //        // let round = game.currentRound;
    //        debugger;
    //        startGame(game, setGame).then((_players: iPlayer[])=> {
    //            players = _players
    //        });
    //     }
    // }, []);

    // setGame({...game, players: players, currentRound: 1});

    // TODO: mechanism for starting first round, skipping for next rounds
    // let players;
    // let gameInit: iGame = Game;
    // const manager = new GameManager();
    // const [game, setGame] = useState<iGame>(gameInit);

    // players = startGame();
    // setGame({...game, players: players});

    // const playerViews = [];

    // for (var i = 0; i < game?.players?.length; i++) {
    //     playerViews.push(<PlayerView player={game.players[i]} currentPlayer={game.currentPlayer} key={i}> </PlayerView>);
    // } 

   
   updateEntities();

   // Object.entries(game)

    // debugger;
    return (
        <div className="wahoo-game">
            <PlayerViews players={players}></PlayerViews>
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