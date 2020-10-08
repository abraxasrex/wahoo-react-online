import React from 'react';
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

function setPositions () {
    setStraightPositions(TrackPattern, TrackStartPositions);
    setStraightPositions(StartLanePattern, StartLaneStartPositions);
    setDiagonalPositions();
}

function setStraightPositions (pattern, positions) {

}

function setDiagonalPositions () {

}

class Board extends React.Component {

    state = {
        slotCount: 88,
        slotPositionMatrix: []
    };

    render () {
        const {slotCount} = this.state;

        const slots = [];

        const playerCount = 4;

        // for (let i=0; i < 16; i++) {
        //     slots.push(<EndSlot/>);
        // }
        // for (let i=0; i < 16; i++) {
        //     slots.push(<StartSlot/>);
        // }
        // for (let i=0; i < 56; i++){
        //     slots.push(<FieldSlots/>);
        // }
        return (
            <div className="game-board" slotCount ={slotCount}>
                {slots}
            </div>
        );
    }
}

export default Board;