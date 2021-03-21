import React, {useState} from 'react';
import Slot from './Slot';
import GamePiece from './GamePiece';

import {GridStartBound, GridEndBound, TrackMax, EndMax, multiplier,
TrackStartPositions, TrackPattern, StartLaneStartPositions, StartLanePattern,
EndLanePattern, EndLaneStartPositions, CenterSlotPattern, CenterSlotStartPosition, 
SpecialSlotPositions, TestPositions} from '../constants/board_constants';

import {createKey, addSlotBatch} from '../helpers/Helpers';
// import Player from '../classes/Player';

import { iPlayer } from '../classes/Player';
import { iSlot } from '../classes/Slot';
import { iPiece } from '../classes/Piece';

export interface iManagerSetter {

}

interface iGameBoardProps {
    props: any,
    slots: iSlot[],
    pieces: iPiece[]
}
class GameBoard extends React.Component<any>  {

    ctx: any;
    testMode: boolean = false;

    constructor({slots, pieces, ...props}: iGameBoardProps) {
        super(props);
        this.ctx = this.createContext();

        //uncomment below to test
       this.testMode = true;
    }

    createContext(): any {
        let ctx: any = {};
        ctx.addSlot = this.addSlot.bind(this);
        ctx.props = this.props;
        ctx.multiplier = multiplier;
        return ctx;
    }

    async setAllSlots (players: iPlayer[]) {
        const slots: any[] = [];

        await addSlotBatch(this.ctx, TrackPattern, TrackStartPositions, slots, "Track", players, false, "Straight");
        await addSlotBatch(this.ctx, EndLanePattern, EndLaneStartPositions, slots, "End", players, true, "Straight");
        await addSlotBatch(this.ctx, CenterSlotPattern, CenterSlotStartPosition, slots, "Center", players, false, "Straight");
        await addSlotBatch(this.ctx, StartLanePattern, StartLaneStartPositions, slots, "Start", players, true, "Diagonal");
        return slots; 
    }
    
    async assignSpecialSlots(slot: any, key: string) {
        for  (var i = 0; i < SpecialSlotPositions.length; i++) {

            let specialSlot: any = SpecialSlotPositions[i]
            // find match
            if(specialSlot.x === slot.x && specialSlot.y === slot.y) {
                slot.specialSlotType = specialSlot.specialSlotType;

                if(specialSlot.playerNumber) {
                    // assign player # to regular slot info
                    slot.playerNumber = specialSlot.playerNumber;
                    // add special slot to the game manager
                    let players = this.props.game.manager.players;
                    specialSlot.key = key;
                    players[slot.playerNumber - 1].specialSlots[slot.specialSlotType] = specialSlot;
                    await this.setManagerState("players", players);
                }

                // add to specials reference
                var specials = this.props.game.manager["specialSlots"];
                specials[key] = slot;
                await this.setManagerState("specialSlots", specials);
            }
        }
    }

    async addSlot(slot: any, slots: Array<any>, counter: any) {
        // create unique key
        let newKey = await createKey(slot, counter.count);
        // check for overlap with special slot types
        await this.assignSpecialSlots(slot, newKey);

        let _slot = <Slot x={slot.x} y={slot.y} occupied={slot.occupied} 
                slotType={slot.slotType} specialSlotType={slot.specialSlotType}
                game={this.props.game} 
                availableSlots={this.props.game.manager.availableSlots}
                setGame={this.props.setGame} 
                manager={this.props.game.manager}
                moveToSlot={this.moveToSlot}
                order={slot.order} 
                _key={newKey} 
                key={newKey}
                owner={slot.owner}>
            </Slot>
        counter.count += 1;
        await slots.push(_slot); 
    }

    async setManagerState(field: any, values: any) {
        let manager = this.props.game.manager;
        if(field && field.length && field.length > 0) {
            for(let i = 0; i < field.length; i++) {
                manager[field[i]] = values;
            }
        } else {
            manager[field] = values;
        }
        await this.props.setGame({manager: manager});
    }

    async initAllSlots() {
        let players = this.props.game.manager.players;
        let slots = await this.setAllSlots(players);
        await this.setManagerState("slots", slots);
    }

    async setTestPieces () {

            let slots: any[] = this.props.game.manager.slots;
            let pieces: any[] = this.props.game.manager.pieces;
            for (let i = 0; i < TestPositions.length; i++) {

                let slotNumber = TestPositions[i]["slotNumber"];
                let slot = slots[slotNumber];
                let pieceNumber =  TestPositions[i].pieceNumber;
                let piece = pieces[pieceNumber];

                let currentPiece = this.props.manager.currentPiece.props ? this.props.manager.currentPiece : undefined
                await this.asyncSelectPiece(piece.props._id);
                this.moveToSlot(slot, currentPiece ? currentPiece.props.slot : undefined);
            }
    }

    async setPieces() {
        let pieces: any = {};
        let slots = this.props.game.manager.slots;
        for (var i = 0; i < slots.length; i++) {
            if(slots[i].props.slotType === "Start") {
                let game = this.props.game;
                let setGame = this.props.setGame;
                let piece: any = <GamePiece slot={slots[i]} key={i} _id={i} 
                    game={game} manager={game.manager} player={slots[i].props.owner}
                    setGame={setGame} cancelSelect={this.cancelSelect}
                    selectPiece={this.selectPiece}></GamePiece>;
                pieces[piece.props._id] = piece;
            }
        }
        await this.setManagerState("pieces", pieces);

        if(this.testMode) {
           await this.setTestPieces();
        }
    }

    slotSort (lastSlot: any, nextSlot: any) {
        if(parseInt(lastSlot.props._key) < parseInt(nextSlot.props._key)) {
            return -1;
        } else if (parseInt(lastSlot.props._key) > parseInt(nextSlot.props._key)){
            return 1;
        } else {
            return 0;
        }
    }

    async resetPiecesAndSlots () {
        let pieces = this.props.manager.pieces;
        let slots = this.props.manager.slots;
        let _pieces: any = {};
        let _slots = [];
        for (const piece in pieces) {
            _pieces[pieces[piece].key] = React.cloneElement(this.props.manager.pieces[piece]);
        }

        await this.setManagerState("pieces", _pieces);
        for(var j = 0; j < slots.length; j++) {
            _slots.push(React.cloneElement(slots[j]));
        }
        await this.setManagerState("slots", _slots);
    }

    // Initialization
    async setGameEntities() {
        await this.initAllSlots();
        await this.setPieces();
    }

    // UI
     selectPiece = (id: string) => {
         this.props.game.manager.selectPiece(id);
         this.resetPiecesAndSlots();
         return true;
    }

    async asyncSelectPiece(id: string) {
        await this.selectPiece(id);
    }

    cancelSelect = () => {
        this.props.manager.cancelSelect();
        this.resetPiecesAndSlots();
    }

    moveToSlot = (targetSlot: any, lastSlot: any) => {
        this.props.game.manager.moveToSlot(targetSlot, lastSlot);
        this.resetPiecesAndSlots();
    }

    componentDidMount() {
        this.setGameEntities();
    }
    checkCancelSelect (e: any) {
        if (e.type === 'contextmenu') {
            console.log('Right click');
            this.props.game.manager.cancelSelect();
            this.resetPiecesAndSlots();
        }
    }

    render() {
        // let pieces = Object.entries(this.props["game"]["manager"]["pieces"]).map((piece)=> {
        //     return piece[1];
        // }) || [];
        // return (
        //     <div className="game-board" onClick={(e)=> this.checkCancelSelect(e)}>
        //         {this.props["game"]["manager"]["slots"]}
        //         { pieces }  
        //     </div>
        // );
        return (
            <div className="game-board" onClick={(e)=> this.checkCancelSelect(e)}>
                {this.props.children}
            </div>
        );
    }
}

export default GameBoard;