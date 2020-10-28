import React, {useState} from 'react';
import Slot from './Slot';
import GamePiece from './GamePiece';
import GamePieceList from './GamePieceList';

const GridStartBound = 0;

const GridEndBound = 14;

const TrackMax = 56;
const EndMax = 12;

// multiplier to expand slot distribution to fit board.
const multiplier = 25;

const TrackStartPositions = [{x:0, y:5}];

const TrackPattern = [
    ["y", 1, 4],
    ["x", 1, 5],
    ["y", 1, 5],
    ["x", 1, 4],
    ["y", -1, 5],
    ["x", 1, 5],
    ["y", -1, 4],
    ["x", -1, 5],
    ["y", -1, 5],
    ["x", -1, 4],
    ["y", 1, 5],
    ["x", -1, 4]
];

const StartLaneStartPositions = [
    {x: 1, y: 1},
    {x: 1, y: 13},
    {x: 13, y: 13},
    {x: 13, y: 1}
]
    
const StartLanePattern = [
    {x: 1, y: 1, duration: 3},
    {x: 1, y: -1, duration: 3},
    {x: -1, y: -1, duration: 3},
    {x: -1, y: 1, duration: 3}
];
const EndLaneStartPositions = [
    {x: 1, y: 7},
    {x: 7, y: 13},
    {x: 13, y: 7},
    {x: 7, y: 1}
]
const EndLanePattern = [
    ["x", 1, 3],
    ["y", -1, 3],
    ["x", -1, 3],
    ["y", 1, 3]
];

const CenterSlotStartPosition = [{x: 7, y: 7}];

const CenterSlotPattern = [];

const SpecialSlotPositions = [
    {x:0, y:225, playerNumber: 3, specialSlotType: "Entry"},
    {x:225, y:350, playerNumber: 1, specialSlotType: "Entry"},
    {x:350, y:225, playerNumber: 4, specialSlotType: "Entry"},
    {x:225, y:0, playerNumber: 2, specialSlotType: "Entry"},
    {x:0, y:175, playerNumber: 3, specialSlotType: "Exit"},
    {x:175, y:350, playerNumber: 1, specialSlotType: "Exit"},
    {x:350, y:175, playerNumber: 4, specialSlotType: "Exit"},
    {x:175, y:0, playerNumber: 2, specialSlotType: "Exit"},
    {x:125, y:125, playerNumber: false, specialSlotType: "Jump"},
    {x:125, y:225, playerNumber: false, specialSlotType: "Jump"},
    {x:225, y:225, playerNumber: false, specialSlotType: "Jump"},
    {x:225, y:125, playerNumber: false, specialSlotType: "Jump"}
];



class GameBoard extends React.Component  {

    state = {slots: [], pieces: []};

    constructor(props) {
        super(props);
    }

    async setPatterns (players) {

        const slots = [];
        await this.setPositions(TrackPattern, TrackStartPositions, slots, "Track", players, false, "Straight");
        await this.setPositions(EndLanePattern, EndLaneStartPositions, slots, "End", players, true, "Straight");
        await this.setPositions(CenterSlotPattern, CenterSlotStartPosition, slots, "Center", players, false, "Straight");
        await this.setPositions(StartLanePattern, StartLaneStartPositions, slots, "Start", players, true, "Diagonal");
        return slots; 
    }
    
    async assignSpecialSlots(slot) {
        for  (var i = 0; i < SpecialSlotPositions.length; i++) {
            if(SpecialSlotPositions[i].x === slot.x && SpecialSlotPositions.y === slot.y) {
                slot.specialPosition = SpecialSlotPositions[i].specialSlotType;
            }
        }
    }

    async addSlot(slot, slots, counter) {
        await this.assignSpecialSlots(slot);
        let _slot = <Slot x={slot.x} y={slot.y} occupied={slot.occupied} slotType={slot.slotType} 
                game={this.props.game} 
                setGame={this.props.setGame} 
                manager={this.props.game.manager}
                order={slot.order} 
                key={ (counter.toString() + slot.owner.toString() + slot.order.toString() + slot.slotType.toString() + slot.y.toString() + slot.x.toString())} 
                owner={slot.owner}>
            </Slot>
        await slots.push(_slot);
        await (counter += 1);
    }
    
    setPositions (pattern, startPositions, slots, slotType, players, directMap, orientation) {

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
            this.addSlot(slot, slots, count, this.props);     
    
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
                        this.addSlot(slot, slots, count);
                        x = model.x;
                        y = model.y;
                    }
                } else {
                    for (var k = 0; k < pattern[j][2]; k++) {
    
                        let model = {x: x, y: y};
        
                        model[pattern[j][0]] += (pattern[j][1] * multiplier);
        
                        let slot = {x: model.x, y: model.y, occupied: occupied, slotType: slotType, order: count, owner: player}
                        this.addSlot(slot, slots, count);
        
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

    async getPositions() {
        let players = this.props.game.manager.players;
        let slots = await this.setPatterns(players, this.props);
        await this.setManagerState("slots", slots);
    }

    async setPieces() {
        let pieces = [];
        let slots = this.props.game.manager.slots;
        for (var i = 0; i < slots.length; i++) {
            if(slots[i].props.slotType === "Start") {
                let game = this.props.game;
                let setGame = this.props.setGame;
                let piece = <GamePiece slot={slots[i]} key={i} _id={i} game={game} manager={game.manager}
                    setGame={setGame} selectPiece={this.selectPiece}></GamePiece>;
                await pieces.push(piece);
            }
        }
        await this.setManagerState("pieces", pieces)

    }

    async setGameEntities() {
        await this.getPositions(this.props);
        await this.setPieces(this.props);
    }

    selectPiece = () => {
        this.setPieces(this.props);
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