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

interface iGameViewProps {
    startGame: Function
    players: iPlayer[]
}

   // UI
   const selectPiece = (id: string, game: iGame, setGame: any, manager: any) => {
        manager.selectPiece(id ,game, setGame);
    //   this.resetPiecesAndSlots();
        return true;
    }

    // asyncSelectPiece(id: string) {
    // await this.selectPiece(id);
    // }

    const cancelSelect = (manager: any) => {
        manager.cancelSelect();
    //   this.resetPiecesAndSlots();
    }

    const moveToSlot = (targetSlot: any, lastSlot: any, manager: any, game: iGame, setGame: any) => {
        manager.moveToSlot(targetSlot, lastSlot, game, setGame);
    // this.resetPiecesAndSlots();
    }

const GameView = ({startGame, players}: iGameViewProps) => {
 
    // let players: iPlayer[] = [];
    let gameInit: iGame = Game;
    const manager = new GameManager();

    gameInit.players = players;

    const [game, setGame] = useState<iGame>(gameInit);


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

    const playerViews = [];

    for (var i = 0; i < game?.players?.length; i++) {
        playerViews.push(<PlayerView player={game.players[i]} currentPlayer={game.currentPlayer} key={i}> </PlayerView>);
    }

    let slots;
    if(game.slots) {
        let slots = Object.entries(game?.slots).map((slot: any)=> {
            return <Slot game={game} setGame={setGame} key={slot.key}
                        slot={slot} manager={manager} moveToSlot={moveToSlot}>
                    </Slot>
        }) || [];
    }
  

    let pieces
    if(game.pieces) {
        pieces = Object.entries(game?.pieces).map((piece: any)=> {
            return <GamePiece game={game} setGame={setGame} key={piece.key}
                        selectPiece={selectPiece} cancelSelect={cancelSelect}
                        piece={piece} manager={manager}>
                    </GamePiece>
        }) || [];
    }

    debugger;
    return (
        <div className="wahoo-game">
            <div>
                {playerViews}
            </div>
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