import React, {useState} from 'react';
import Slot from './Slot';
import GamePiece from './GamePiece';
import GamePieceList from './GamePieceList';

import {GridStartBound, GridEndBound, TrackMax, EndMax, multiplier,
TrackStartPositions, TrackPattern, StartLaneStartPositions, StartLanePattern,
EndLanePattern, EndLaneStartPositions, CenterSlotPattern, CenterSlotStartPosition, 
SpecialSlotPositions} from '../constants/board_constants';

import {createKey, addSlotBatch} from '../helpers/Helpers';


class GameBoard extends React.Component  {

    // state = {slots: [], pieces: []};

    constructor(props) {
        super(props);
        this.ctx = this.createContext();
    }

    createContext() {
        let ctx = {};
        ctx.addSlot = this.addSlot.bind(this);
        ctx.props = this.props;
        ctx.multiplier = multiplier;
        return ctx;
    }

    async setAllSlots (players) {
        const slots = [];

        await addSlotBatch(this.ctx, TrackPattern, TrackStartPositions, slots, "Track", players, false, "Straight");
        await addSlotBatch(this.ctx, EndLanePattern, EndLaneStartPositions, slots, "End", players, true, "Straight");
        await addSlotBatch(this.ctx, CenterSlotPattern, CenterSlotStartPosition, slots, "Center", players, false, "Straight");
        await addSlotBatch(this.ctx, StartLanePattern, StartLaneStartPositions, slots, "Start", players, true, "Diagonal");
        return slots; 
    }
    
    async assignSpecialSlots(slot, key) {
        for  (var i = 0; i < SpecialSlotPositions.length; i++) {

            let specialSlot = SpecialSlotPositions[i]
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

    async addSlot(slot, slots, counter) {
        // create unique key
        let newKey = await createKey(slot, counter);
        // check for overlap with special slot types
        await this.assignSpecialSlots(slot, newKey);

        let _slot = <Slot x={slot.x} y={slot.y} occupied={slot.occupied} 
                slotType={slot.slotType} specialSlotType={slot.specialSlotType}
                game={this.props.game} 
                setGame={this.props.setGame} 
                manager={this.props.game.manager}
                moveToSlot={this.moveToSlot}
                order={slot.order} 
                _key={newKey} 
                key={newKey}
                counter = {counter}
                owner={slot.owner}>
            </Slot>
        await slots.push(_slot);
        await (counter = counter + 1);
 
    }

    async setManagerState(field, values) {
        let manager = this.props.game.manager;
        manager[field] = values;
        await this.props.setGame({manager: manager});
    }

    async initAllSlots() {
        let players = this.props.game.manager.players;
        let slots = await this.setAllSlots(players, this.props);
        await this.setManagerState("slots", slots);
    }

    async setPieces(id) {
        if (id) {
            await this.props.game.manager.selectPiece(id);
        }

        let pieces = [];
        let slots = this.props.game.manager.slots;
        for (var i = 0; i < slots.length; i++) {
            if(slots[i].props.slotType === "Start") {
                let game = this.props.game;
                let setGame = this.props.setGame;
                let piece = <GamePiece slot={slots[i]} key={i} _id={i} 
                    game={game} manager={game.manager} player={slots[i].props.owner}
                    setGame={setGame} selectPiece={this.selectPiece}></GamePiece>;
                await pieces.push(piece);
            }
        }
        await this.setManagerState("pieces", pieces)
    }

    async resetPiecesAndSlots () {
        let pieces = this.props.manager.pieces;
        let slots = this.props.manager.slots;
        let _pieces = [];
        let _slots = [];
        for (var i = 0; i < pieces.length; i++) {
            _pieces.push(React.cloneElement(pieces[i]));
        }
        await this.setManagerState("pieces", _pieces);
        for(var j = 0; j < slots.length; j++) {
            _slots.push(React.cloneElement(slots[j]));
        }
        await this.setManagerState("slots", _slots);
    }

    // Initialization
    async setGameEntities() {
        await this.initAllSlots(this.props);
        await this.setPieces(false);
    }

    // UI
     selectPiece = (id) => {
         this.props.game.manager.selectPiece(id);
         this.resetPiecesAndSlots();
    }

    moveToSlot = (key) => {
        this.props.game.manager.moveToSlot(key);
        debugger;
        this.resetPiecesAndSlots();
    }

    componentDidMount() {
        this.setGameEntities();
    }

    render() {
        return (
            <div className="game-board">
                {this.props["game"]["manager"]["slots"]}
                {this.props["game"]["manager"]["pieces"]}
            </div>
        );
    }
}

export default GameBoard;