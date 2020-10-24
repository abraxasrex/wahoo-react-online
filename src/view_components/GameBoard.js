import React, {useState} from 'react';
import Slot from './Slot';
import GamePiece from './GamePiece';

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

async function setPatterns (players) {

    const slots = [];
    await setPositions(TrackPattern, TrackStartPositions, slots, "Track", players, false, "Straight");
    await setPositions(EndLanePattern, EndLaneStartPositions, slots, "End", players, true, "Straight");
    await setPositions(CenterSlotPattern, CenterSlotStartPosition, slots, "Center", players, false, "Straight")
    await setPositions(StartLanePattern, StartLaneStartPositions, slots, "Start", players, true, "Diagonal");
    return slots; 
}

async function addSlot(slot, slots, counter) {
    let _slot = <Slot x={slot.x} y={slot.y} occupied={slot.occupied} slotType={slot.slotType} 
        order={slot.order} owner={slot.owner}>
        </Slot>
    await slots.push(_slot);
    await (counter += 1);
}

function setPositions (pattern, startPositions, slots, slotType, players, directMap, orientation) {
    // Slot--------------
// x: int
// y: int
// occupied: GamePiece | falsey
// slotType: "Track" | "Start" | "End"
// order: 0-56 (track), 0-4 (start, end)
// owner: Player ()
// ------------------------
    let x = 0;
    let y = 0;
    let count = 0;
    let occupied = false;
    let player = false;
    // let slotType = slotType;

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
        addSlot(slot, slots, count);

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
                    addSlot(slot, slots, count);
                    x = model.x;
                    y = model.y;
                }
            } else {
                for (var k = 0; k < pattern[j][2]; k++) {

                    let model = {x: x, y: y};
    
                    model[pattern[j][0]] += (pattern[j][1] * multiplier);
    
                    let slot = {x: model.x, y: model.y, occupied: occupied, slotType: slotType, order: count, owner: player}
                    addSlot(slot, slots, count);
    
                    x = model.x;
                    y = model.y;
                }
            }
        }
    }
    return slots;
}

class GameBoard extends React.Component  {

    state = {slots: [], pieces: []};

    async setManagerState(field, values) {
        let manager = this.props.game.manager;
        manager[field] = values;
        // debugger;
        await this.props.setGame({manager: manager});
    }

    async getPositions() {
        let players = this.props.game.manager.players;
        let slots = await setPatterns(players);
        // this.setState({slots: slots});
        // debugger;
        await this.setManagerState("slots", slots);
    }
    async setPieces() {

    //     let _slot = <Slot x={slot.x} y={slot.y} occupied={slot.occupied} slotType={slot.slotType} 
    //     order={slot.order} owner={slot.owner}>
    //     </Slot>
    // await slots.push(_slot);
    // await (counter += 1);
        let pieces = [];
        let slots = this.props.game.manager.slots;
        // debugger;
        for (var i = 0; i < slots.length; i++) {
            if(slots[i].props.slotType === "Start") {
                let piece = <GamePiece slot={slots[i]}></GamePiece>;
                await pieces.push(piece);
            }
        }

       // await this.setState({pieces: pieces});
        await this.setManagerState("pieces", pieces)

    }

    async setGameEntities() {
        await this.getPositions();
        console.log("did slots load? :", this.props.game.manager.slots)
        await this.setPieces();
        console.log("did pieces load? :", this.props.game.manager.pieces)
    }
    componentDidMount() {
        this.setGameEntities();
    }

    render() {
        return (
            <div className="game-board">
                {this.props["game"]["manager"]["slots"].map(slot => slot ) || []}
                {this.props["game"]["manager"]["pieces"].map(piece => piece) || []}
            </div>
        );
    }
}

export default GameBoard;