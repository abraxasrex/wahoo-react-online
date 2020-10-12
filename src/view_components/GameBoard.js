import React, {useState} from 'react';
import Slot from './Slot';



const GridStartBound = 0;

const GridEndBound = 14;

const GridMax = 56;

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
    ["x", 1, 3],
    ["y", -1, 3],
    ["x", -1, 3],
    ["y", 1, 3]
];

const CenterSlot = {x: 7, y: 7};

async function setPositions (players) {

    const slots = [];
    await setStraightPositions(TrackPattern, TrackStartPositions, slots, "Track", players);
  //  await setStraightPositions(EndLanePattern, EndLaneStartPositions, slots, "End", players, 1);
  //  debugger;
  //  await setDiagonalPositions(StartLanePattern, StartLaneStartPositions, slots, "Start", players);
    return slots; 
}

function addSlot() {

}

function setStraightPositions (pattern, startPositions, slots, slotType, players, duration) {
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

    // multiplier to expand slot distribution to fit board.
    let multiplier = 25;

    // calculate path of slots from 1 or more starting places
    for (var i = 0; i < startPositions.length; i++) {

        // initialize x and y for pattern start
        x = (startPositions[i].x * multiplier);
        y = (startPositions[i].y * multiplier);

        // if there's a player
        if (slotType === "End") {
            player = players[i];
        }
        //add start position itself before incrementing
        let slot = <Slot x={x} y={y} occupied={occupied} slotType={slotType} 
            order={count} owner={player}>
        </Slot>
        slots.push(slot);
        count += 1;

            // debugger;
        // calculates tht direction to move and place the next slot
        for (var j = 0; j < pattern.length; j++) {
            // debugger;
            // get pattern duration in certain direction
            for (var k = 0; k < pattern[j][2]; k++) {
                // debugger;
                let model = {x: x, y: y}
              //  if (j !== 0) {
                    model[pattern[j][0]] += (pattern[j][1] * multiplier);
            //    } 
                let slot = <Slot x={model.x} y={model.y} occupied={occupied} slotType={slotType} 
                                order={count} owner={player}>
                            </Slot>
                slots.push(slot);

                // set x and y to incremented value
                x = model.x;
                y = model.y;

                count += 1;
            }
         //   debugger;
          //  console.log("slots! ", slots);
        }
        if (slotType === "End") {
            count = 0;
        }
    }

    // only uncomment for testing: dedupe finder:
    // for (var l = 0; l < slots.length; l++){
    //     if slots[l].
    // }
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
        console.log("slots: ", this.state.slots);

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
                {this.state.slots.map(slot => slot )}
            </div>
        );
       }
}

export default GameBoard;