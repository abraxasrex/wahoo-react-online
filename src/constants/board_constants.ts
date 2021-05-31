import { iSpecialSlotType } from "../classes/Slot";

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
    {x: 7, y: 13},
    {x: 13, y: 7},
    {x: 1, y: 7},
    {x: 7, y: 1},
]
export const EndLanePattern = [
    ["y", -1, 3],
    ["x", -1, 3],
      ["x", 1, 3],
      ["y", 1, 3]
];

export const CenterSlotStartPosition = [{x: 7, y: 7}];

export const CenterSlotPattern = [];

export const SpecialSlotPositions = [
    {x:0, y:225, playerNumber: 3, specialSlotType: iSpecialSlotType.Entry},
    {x:225, y:350, playerNumber: 1, specialSlotType: iSpecialSlotType.Entry},
    {x:350, y:125, playerNumber: 2, specialSlotType: iSpecialSlotType.Entry},
    {x:125, y:0, playerNumber: 4, specialSlotType: iSpecialSlotType.Entry},
    {x:0, y:175, playerNumber: 3, specialSlotType: iSpecialSlotType.Exit},
    {x:175, y:350, playerNumber: 1, specialSlotType: iSpecialSlotType.Exit},
    {x:350, y:175, playerNumber: 4, specialSlotType: iSpecialSlotType.Exit},
    {x:175, y:0, playerNumber: 2, specialSlotType: iSpecialSlotType.Exit},
    {x:125, y:125, playerNumber: false, specialSlotType: iSpecialSlotType.Jump},
    {x:125, y:225, playerNumber: false, specialSlotType: iSpecialSlotType.Jump},
    {x:225, y:225, playerNumber: false, specialSlotType: iSpecialSlotType.Jump},
    {x:225, y:125, playerNumber: false, specialSlotType: iSpecialSlotType.Jump}
];

export const TestPositions = [
    {player: 1, slotNumber: 18, pieceNumber: 1},
    {player: 2, slotNumber: 37, pieceNumber: 5},
    {player: 3, slotNumber: 1, pieceNumber: 10},
    {player: 4, slotNumber: 35, pieceNumber: 13}
]

export const TestPositions2 = [
    {player: 1, slotNumber: 72, pieceNumber: 3},
    {player: 2, slotNumber: 37, pieceNumber: 5},
    {player: 3, slotNumber: 1, pieceNumber: 9},
    {player: 4, slotNumber: 32, pieceNumber: 4}
]