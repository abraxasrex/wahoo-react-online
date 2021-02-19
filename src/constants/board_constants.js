export const GridStartBound = 0;

export const GridEndBound = 14;

export const TrackMax = 56;
export const EndMax = 12;

// multiplier to expand slot distribution to fit board.
export const multiplier = 25;

export const TrackStartPositions = [{x:0, y:5}];

export const TrackPattern = [
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

export const StartLaneStartPositions = [
    {x: 4, y: 10, playerNumber: 1},
    {x: 13, y: 13, playerNumber: 2},
    {x: 1, y: 1, playerNumber: 3},
    {x: 10, y: 4, playerNumber: 4}
]
    
export const StartLanePattern = [
    {x: -1, y: 1, duration: 3, playerNumber: 1},
    {x: -1, y: -1, duration: 3, playerNumber: 2},
    {x: 1, y: 1, duration: 3, playerNumber: 3},
    {x: 1, y: -1, duration: 3, playerNumber: 4},
];
export const EndLaneStartPositions = [
    {x: 1, y: 7},
    {x: 7, y: 13},
    {x: 13, y: 7},
    {x: 7, y: 1}
]
export const EndLanePattern = [
    ["x", 1, 3],
    ["y", -1, 3],
    ["x", -1, 3],
    ["y", 1, 3]
];

export const CenterSlotStartPosition = [{x: 7, y: 7}];

export const CenterSlotPattern = [];

export const SpecialSlotPositions = [
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