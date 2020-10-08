import React, {useState} from 'react';
import Slot from './Slot';



const GridStartBound = 0;

const GridEndBound = 14;

const TrackStartPositions = [{x:0, y:5}];

const TrackPattern = [
    ["y", 1],
    ["x", 1],
    ["y", 1],
    ["x", 1],
    ["y", -1],
    ["x", 1],
    ["y", -1],
    ["x", -1],
    ["y", -1],
    ["x", -1],
    ["y", 1],
    ["x", -1]
];

const StartLaneStartPositions = [
    {x: 1, y: 1},
    {x: 1, y: 13},
    {x: 13, y: 13},
    {x: 13, y: 1}
]

const StartLanePattern = [
    {x: 1, y: 1},
    {x: 1, y: -1},
    {x: -1, y: -1},
    {x: -1, y: 1}
];
const EndLaneStartPositions = [
    {x: 0, y: 7},
    {x: 7, y: 13},
    {x: 13, y: 7},
    {x: 7, y: 1}
]
const EndLanePattern = [
    ["x", 1],
    ["y", -1],
    ["x", -1],
    ["y", 1]
];

const CenterSlot = {x: 7, y: 7};

async function setPositions (players) {

    const slots = [];
    await setStraightPositions(TrackPattern, TrackStartPositions, slots, "Track", players);
    await setStraightPositions(EndLanePattern, EndLaneStartPositions, slots, "End", players);
  //  debugger;
  //  await setDiagonalPositions(StartLanePattern, StartLaneStartPositions, slots, "Start", players);
    return slots; 
}

function setStraightPositions (pattern, startPositions, slots, slotType, players) {
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
    // let slotType = slotType;
    let player = false;

    for (var i = 0; i < startPositions.length; i++) {

        if (slotType === "End") {
            player = players[i];
        }

        x = startPositions.x;
        y = startPositions.y;
        occupied = false;
        slotType = slotType;
        
        for (var j = 0; j < pattern.length; j++) {
            // pattern[0] = "x" or "y"
            // pattern[1] = move num
            let model = {x: x, x: y}
            if (j !== 0) {
                model[pattern[j][0]] += pattern[j][1];
            } 
            // let slot = {x: model.x, y:model.y, occupied: occupied, 
            //                 slotType: slotType, order: count, owner: player};
            let slot = <Slot x={model.x} y={model.y} occupied={occupied} slotType={slotType} 
                             order={count} owner={player}>
                        </Slot>
            slots.push(slot);

            count += 1;
        }

        if (slotType === "End") {
            count = 0;
        }
        
    }
    return slots;
}

function setDiagonalPositions (pattern, startPositions, slots, slotType, players) {
    for (var i = 0; i < startPositions.length; i++) {

    }
    return slots;
}

class GameBoard extends React.Component  {

    state = {slots: []};

    async getPositions() {
        let players = this.props.players;
        // console.log(this.props.players);
        let slots = await setPositions(players);
        this.setState({slots: slots});
        // console.log("slots: ", this.state.slots);

    }
    componentDidMount() {
        this.getPositions();
      //  debugger;

        // this.slots = setPositions(this.props.players).then((results)=>{
        //     console.log("results: ", results);
        //     console.log("type: ", Array.isArray(results));
        //     return results;
        // });
    }

    // {this.slots}

       // {slots.map(slot => <div>{slot}</div>)}
    //    {this.state.slots ? (this.state.slots.map(slot => <div>{slot}</div>)) : <div>no slots</div>}

    // {this.state.slots.map((slot) => {
    //     return (<Slot x={slot.x} y={slot.y} occupied={slot.occupied} slotType={slot.slotType} 
    //         order={slot.order} owner={slot.owner}>
    //     </Slot>);
    // })}

       render() {
        return (
            <div className="game-board">
                {this.state.slots.map(slot => <div>{slot}</div>)}
            </div>
        );
       }
}

export default GameBoard;