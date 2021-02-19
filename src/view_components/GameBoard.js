import React, {useState} from 'react';
import Slot from './Slot';
import GamePiece from './GamePiece';
import GamePieceList from './GamePieceList';

import {GridStartBound, GridEndBound, TrackMax, EndMax, multiplier,
TrackStartPositions, TrackPattern, StartLaneStartPositions, StartLanePattern,
EndLanePattern, EndLaneStartPositions, CenterSlotPattern, CenterSlotStartPosition, 
SpecialSlotPositions} from '../constants/board_constants';


class GameBoard extends React.Component  {

    // state = {slots: [], pieces: []};

    constructor(props) {
        super(props);
    }

    async setAllSlots (players) {

        const slots = [];
        await this.addSlotBatch(TrackPattern, TrackStartPositions, slots, "Track", players, false, "Straight");
        await this.addSlotBatch(EndLanePattern, EndLaneStartPositions, slots, "End", players, true, "Straight");
        await this.addSlotBatch(CenterSlotPattern, CenterSlotStartPosition, slots, "Center", players, false, "Straight");
        await this.addSlotBatch(StartLanePattern, StartLaneStartPositions, slots, "Start", players, true, "Diagonal");
        return slots; 
    }
    
    async assignSpecialSlots(slot, key) {
        for  (var i = 0; i < SpecialSlotPositions.length; i++) {

            let specialSlot = SpecialSlotPositions[i]
            // find match
            if(specialSlot.x === slot.x && specialSlot.y === slot.y) {

                slot.specialSlotType = specialSlot.specialSlotType;

                if(specialSlot.playerNumber) {
                 //   console.log("ENTRY OR EXIT: ", SpecialSlotPositions[i]);
                    slot.playerNumber = specialSlot.playerNumber;
                    let players = this.props.game.manager.players;
                    specialSlot.key = key;
                    players[slot.playerNumber - 1].specialSlots[slot.specialSlotType] = specialSlot;
                    await this.setManagerState("players", players);
                    console.log("PLAYERS: ", this.props.game.manager.players);
                }

                // add to specials reference
                var specials = this.props.game.manager["specialSlots"];
                specials[key] = slot;
                await this.setManagerState("specialSlots", specials);
            }
        }
    }

    async createKey(slot, counter) {
        return counter.toString() + slot.owner.toString() + slot.order.toString() + slot.slotType.toString() + slot.y.toString() + slot.x.toString();
    }

    async addSlot(slot, slots, counter) {
        let newKey = await this.createKey(slot, counter);
        await this.assignSpecialSlots(slot, newKey);
        if(slot.specialSlotType) {
            console.log("added special: ", slot);
          //  debugger;
        }
        let _slot = <Slot x={slot.x} y={slot.y} occupied={slot.occupied} 
                slotType={slot.slotType} specialSlotType={slot.specialSlotType}
                game={this.props.game} 
                setGame={this.props.setGame} 
                manager={this.props.game.manager}
                order={slot.order} 
                key={ newKey }
                _key = {newKey} 
                counter = {counter}
                owner={slot.owner}>
            </Slot>
        await slots.push(_slot);
        await (counter = counter + 1);
 
    }
    
    async addSlotBatch (pattern, startPositions, slots, slotType, players, directMap, orientation) {

        let x = 0;
        let y = 0;
        let count = 0;
        let occupied = false;
        let player = false;
    
        // calculate path of slots from 1 or more starting places
        for (var i = 0; i < startPositions.length; i++) {
    
            // initialize x and y for pattern start
            x = (startPositions[i].x * multiplier);
            y = (startPositions[i].y * multiplier);
    
            // if there's a player, set player
            if (slotType === "End" || slotType === "Start") {
                player = players[i];
            }
            let slot = {x: x, y: y, occupied: occupied, slotType: slotType, order: count, owner: player}
            await this.addSlot(slot, slots, count, this.props);     
    
            // calculates tht direction to move and place the next slot
            // if its directly mapped the pattern is 1:1 with the startposition array
            var j = directMap ? i : 0;
            var bound = directMap ? (j + 1) : pattern.length;
            for (j; j < bound; j++) {
    
                // Diagonal scales differently
                if (orientation === "Diagonal") {
                    let duration = pattern[j]["duration"] || 1;
    
                    for (var k = 0; k < duration; k++) {
                        let model = {x: x, y: y};
                        model["x"] += (pattern[j]["x"] * multiplier);
                        model["y"] += (pattern[j]["y"] * multiplier);
                        let slot = {x: model.x, y: model.y, occupied: occupied, slotType: slotType, order: count, owner: player}
                        await this.addSlot(slot, slots, count);
                        x = model.x;
                        y = model.y;
                    }
                } else {
                    for (var k = 0; k < pattern[j][2]; k++) {
    
                        let model = {x: x, y: y};
        
                        model[pattern[j][0]] += (pattern[j][1] * multiplier);
        
                        let slot = {x: model.x, y: model.y, occupied: occupied, slotType: slotType, order: count, owner: player}
                        await this.addSlot(slot, slots, count);
        
                        x = model.x;
                        y = model.y;
                    }
                }
            }
        }
        return slots;
    }

    async setManagerState(field, values) {
        let manager = this.props.game.manager;
        manager[field] = values;
        await this.props.setGame({manager: manager});
    }

    async initAllSlots() {
        let players = this.props.game.manager.players;
        let slots = await this.setAllSlots(players, this.props);
       // debugger;
        await this.setManagerState("slots", slots);
    }

    async setPieces(id) {
       // debugger;
        if (id) {
            await this.props.game.manager.selectPiece(id);
        }

        let pieces = [];
        let slots = this.props.game.manager.slots;
        for (var i = 0; i < slots.length; i++) {
            if(slots[i].props.slotType === "Start") {
                let game = this.props.game;
                let setGame = this.props.setGame;
                // await this.editSlot(slots[i], slots);
                // debugger;
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
       // debugger;
        await this.setPieces(false);
    }

    // UI
     selectPiece = (id) => {
         this.props.game.manager.selectPiece(id);
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