
import {iSlot} from '../classes/Slot';
import {iPiece} from '../classes/Piece';
import {iGame} from '../classes/Game';
import {iPlayer} from '../classes/Player';

export interface iDiceViewProps {
    manager: any;
    setGame: any;
    currentRoll?: number;
    game: any;
}

export interface iSpecialSlot {
    key: string;
}

export interface iBoardCounter {
    count: number
}

export interface iGameBoardProps {
    props?: any,
    slots: iSlot[],
    pieces: iPiece[],
    game: iGame,
    manager: any,
    setGame: any
}

export interface iGameViewProps {
    startGame: Function;
    players: iPlayer[];
    game: iGame;
    setGame: any;
    manager: any;
    _slots: any;
    _pieces: any;
}

export interface iPiecesProps {
    game: iGame,
    pieces: JSX.Element[],
    manager: any
}

export interface iSlotsProps {
    game: iGame,
    slots: JSX.Element[],
    manager: any
}

export interface iLobbyForm {
    gameColor?: string,
    playerName?: string
}