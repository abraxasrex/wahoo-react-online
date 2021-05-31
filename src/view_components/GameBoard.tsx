import React, {useState, useEffect} from 'react';
import Slot from './Slot';
import GamePiece from './GamePiece';

import {GridStartBound, GridEndBound, TrackMax, EndMax, multiplier,
TrackStartPositions, TrackPattern, StartLaneStartPositions, StartLanePattern,
EndLanePattern, EndLaneStartPositions, CenterSlotPattern, CenterSlotStartPosition, 
SpecialSlotPositions, TestPositions, TestPositions2} from '../constants/board_constants';

import {createKey, addSlotBatch, timer, getRandomInt} from '../helpers/Helpers';
// import Player from '../classes/Player';

import { iPlayer } from '../classes/Player';
import { iSlot, iSlotType, iSpecialSlotType } from '../classes/Slot';
import { iPiece } from '../classes/Piece';
import { iGame } from '../classes/Game';

export interface iManagerSetter {

}

export interface iSpecialSlot {
    key: string;
}

export interface iBoardCounter {
    count: number
}

interface iGameBoardProps {
    props?: any,
    slots: iSlot[],
    pieces: iPiece[],
    game: iGame,
    manager: any,
    setGame: any
}
class GameBoard extends React.Component<any>  {

    ctx: any;

    slots: iSlot[] = [];
    pieces: iPiece[] = [];
    game: iGame;
    manager: any;
    setGame: any;

    // testing props
    testMode: boolean = false;
    botMode: boolean = true;
    currentBotAction: any = undefined;

    constructor(props: any) {
        super(props);

        // this.slots = props.slots;
        // this.pieces = props.pieces;
        this.game = props.game;
        // this.manager = props.manager;
        // this.setGame = props.setGame;

        // this.ctx = this.createContext();
        this.assignVals(props);

        //uncomment below to test
      // this.testMode = true;
        
      // uncomment below to let bots play
     // this.botMode = true;
    }

    assignVals(props: any): any {
        this.game = props.game;
      //  if (Object.keys(props.game?.slots).length === 0) {
            this.slots = props.game.slots;
      //  } 
       // this.slots = props.slots || ;
        this.pieces = props.pieces;
        this.game = props.game;
        this.manager = props.manager;
        this.setGame = props.setGame;

        this.ctx = this.createContext();
    }

    createContext(): any {
        let ctx: any = {};
        ctx.addSlot = this.addSlot.bind(this);
        ctx.props = this.props;
        ctx.multiplier = multiplier;
        return ctx;
    }

    async setAllSlots (players: iPlayer[]) {
        const slots: any = {};
        let counter: any = {count: 0};

        await addSlotBatch(this.ctx, TrackPattern, TrackStartPositions, slots, iSlotType.Track, players, false, "Straight", counter);
        await addSlotBatch(this.ctx, EndLanePattern, EndLaneStartPositions, slots, iSlotType.End, players, true, "Straight", counter);
        await addSlotBatch(this.ctx, CenterSlotPattern, CenterSlotStartPosition, slots, iSlotType.Center, players, false, "Straight", counter);

        // add center slot
        await this.setGame({...this.game, centerSlotId: Object.keys(slots)[Object.keys(slots).length-1]});

        await addSlotBatch(this.ctx, StartLanePattern, StartLaneStartPositions, slots, iSlotType.Start, players, true, "Diagonal", counter);

        return slots; 
    }
    
  
    async assignSpecialSlots(slot: iSlot, key: string) {
        for  (var i = 0; i < SpecialSlotPositions.length; i++) {

            let specialSlot: any = SpecialSlotPositions[i]
            // find match
            if(specialSlot.x === slot.x && specialSlot.y === slot.y) {
                slot.specialSlotType = specialSlot.specialSlotType;

                if(specialSlot.playerNumber) {
                    // assign player # to regular slot info
                    let players: iPlayer[] = this.game?.players;

                    slot.owner = players[specialSlot.playerNumber - 1];
                    // add special slot to the game manager
                    let typedSpecialSlot: iSpecialSlot = specialSlot;
                    typedSpecialSlot.key = key || "default";
                    players[slot.owner.playerNumber - 1].specialSlots[specialSlot.specialSlotType] = specialSlot;
                    await this.setManagerState("players", players);
                }

                // add to specials reference
                var specials = this.game.specialSlots;
                // this is really hacky.
                slot.key = key;
                specials[key] = slot;
                await this.setManagerState("specialSlots", specials);
            }
        }
    }

    async addSlot(slot: iSlot, slots: any, counter: iBoardCounter) {
        // create unique key
        let newKey = await createKey(slot, counter.count);
        // check for overlap with special slot types
        await this.assignSpecialSlots(slot, newKey);

        //need to record this...
        if(slot.slotType === iSlotType.End && slot?.owner?.endSlotKeys){
            // if(slot.owner?.endSlotKeys) {
                slot?.owner?.endSlotKeys.push(slot.orderId);
            // } else if (slot?.owner) {
            //     slot.owner.endSlotKeys = [slot.orderId];
            // }
        }

        if(slot.slotType == iSlotType.Start) {
          //  if(slot.owner?,startKeys) {
                slot.owner?.startSlotKeys.push(slot.orderId)
          //  }
        }


        let _slot: iSlot = {
            x: slot.x,
            y: slot.y,
            occupied: slot.occupied,
            slotType: slot.slotType,
            specialSlotType: slot.specialSlotType,
            orderId: counter.count,
            key: newKey,
            owner: slot.owner
        }

      let order: any = slot.orderId ? slot.orderId : _slot.orderId;

       counter.count += 1;
       slots[newKey] = _slot;
    }

    async setManagerState(field: any, values: any) {
        let state: any = {...this.props.game};

        state[field] = values;

        console.log("f / v: ", field, values);

        await this.setGame(state);
    }

 

    async initAllSlots() {
        let players = this.game.players;
        let slots = await this.setAllSlots(players);
        await this.setManagerState("slots", slots);
    }

    async setTestPieces (testPositions: any[]) {

            let slots: any = this.game.slots;
            let pieces: any = this.game.pieces;
            for (let i = 0; i < testPositions.length; i++) {

                let slotOrder = testPositions[i]["slotNumber"];

                let slot = undefined;

                for( let [key, _val] of Object.entries(slots)) {
                    let val: any = _val;
                    if(val?.orderId == slotOrder) {
                        slot = _val;
                    }
                }

             //   let slot = slots[slotOrder];

                let pieceNumber =  testPositions[i].pieceNumber;
                let piece: iPiece = pieces[pieceNumber];

                let newState = await this.asyncSelectPiece(piece?._id || '');

                let currentPiece: iPiece = this.game?.currentPiece || newState?.currentPiece;

                await this.props.moveToSlot(slot, currentPiece ? currentPiece.slot : undefined, this.manager, this.game, this.setGame);
            }
    }

    async setPieces() {
      let pieces: any = {};
      let count = 0;
        for ( let [key, value] of Object.entries(this.game.slots)) {
            if(value.slotType === iSlotType.Start) {
                let game = this.game;
                let setGame = this.setGame;
                let piece: iPiece = {
                    slot: value,
                    key: count,
                    _id: count.toString(),
                    owner: value?.owner,
                }

                count +=1;
                pieces[piece._id || ""] = piece;
            }
        }
        
        await this.setManagerState("pieces", pieces);

        if(this.testMode) {
           await this.setTestPieces(TestPositions2);
        }
    }

    slotSort (lastSlot: any, nextSlot: any) {
        if(parseInt(lastSlot.props._key) < parseInt(nextSlot.props._key)) {
            return -1;
        } else if (parseInt(lastSlot.props._key) > parseInt(nextSlot.props._key)){
            return 1;
        } else {
            return 0;
        }
    }

    async resetPiecesAndSlots () {
      //  debugger;
        let pieces = this.props.game.pieces;
        let slots = this.props.game.slots;
        let _pieces: any = {};
        let _slots = [];
        for (const piece in pieces) {
            _pieces[pieces[piece].key] = React.cloneElement(this.props.game.pieces[piece]);
        }

        await this.setManagerState("pieces", _pieces);
        for(var j = 0; j < slots.length; j++) {
            _slots.push(React.cloneElement(slots[j]));
        }
        await this.setManagerState("slots", _slots);
    }

    // Initialization
    async setGameEntities() {

        await this.initAllSlots();
        await this.setPieces();



        if(this.botMode) {
           this.botsPlayGame();
        }
    }



    botsPlayGame() {
        // while there isn't a winner
        let botAction = this.botAction.bind(this);

        let botTimer = new timer(botAction, 100);
    }

    botAction () {
        if(this.game.winner) {
            console.log("done!");
            return;
        }
        // roll, select, move, repeat
        if(this.currentBotAction == "botRoll") {
            this.currentBotAction = "pending";
            this.botRoll();
        } else if (this.currentBotAction == "botSelect") {
            this.currentBotAction = "pending";
            this.botSelect();
        } else if (this.currentBotAction === "botMove") {
            this.currentBotAction = "pending";
            this.botMove();
        } else if(this.currentBotAction == "pending"){ 
            console.log("waiting for next action");
        }
        else {
            this.currentBotAction = "pending";
            this.currentBotAction = "botRoll";
            console.log("bot's first roll");
        }
        
    }

    botRoll () {
        console.log("bot roll dice!");
        this.manager.rollDice(this.game, this.setGame);
        this.currentBotAction = "botSelect";

    }

    async botSelect () {
        console.log("bot select a Piece!");

        //1. for each game piece chosen randomly:
        // 2. check if it has availableSlots
        //3. first result with available slots: 
        //4. trigger piece selection
        let i = 0;
        for(const [key, piece] of Object.entries(this.game.pieces)) {
            if(piece.owner != this.game.currentPlayer) {
                continue;
            }

            let newState = await this.asyncSelectPiece(piece?._id || '');

            let keys = Object.entries(this.game.availableSlots);
            if(keys.length > 0) {
                this.currentBotAction = "botMove";
                break;
            } else {
               // this.props.manager.cancelSelect(this.game, this.setGame);
               await this.props.manager.clearSlate(this.game, this.setGame);
            }
            i++;
            if(i >= Object.entries(this.game.pieces).length - 1) {
                this.currentBotAction = "botMove";
                break;
            }

        }

    //    this.currentBotAction = "botMove";


    }

    async botMove() {
        console.log("bot Moves a Piece!");

        // 1. randomly choose an availableSlot
        let availableSlotKeys = Object.entries(this.game.availableSlots);
       // let random = getRandomInt(availableSlotKeys.length) - 1;
        let random = availableSlotKeys.length - 1;
        //2. movePiece to this availableSlot

        let currentPiece: iPiece = this.game?.currentPiece;

        if(!availableSlotKeys[random] ) {
            console.log("wtf");
        }

        // gotta cover kick state without piece reference....
        if(availableSlotKeys[random] &&
            availableSlotKeys[random][1].occupied &&
            availableSlotKeys[random][1].occupied != this.game.currentPlayer) {     

            let kickedPlayer = availableSlotKeys[random][1].occupied;
            let kickedPiece = undefined;
            for(const [key, piece] of Object.entries(this.game.pieces)) {
                if(piece.owner == kickedPlayer) {
                    if(piece.slot.key == availableSlotKeys[random][1].key) {
                        kickedPiece = piece;
                        break;
                    }
                } else {
                    continue;
                }
            }
                
            await this.manager.kickHome(this.game, this.setGame, this.props.moveToSlot, kickedPiece , this.manager, false);
        }
         await this.props.moveToSlot(availableSlotKeys[random][1], currentPiece ? currentPiece.slot : undefined, this.manager, this.game, this.setGame);
        // this.currentBotAction = "botMove";

        this.currentBotAction = "botRoll";
    }

 // UI
    checkCancelSelect (e: any) {
        if (e.type === 'contextmenu') {
            console.log('Right click');
            this.props.manager.cancelSelect(this.game, this.setGame);
            this.resetPiecesAndSlots();
        }
    }

    async asyncSelectPiece(id: string) {
        return await this.props.selectPiece(id, this.game, this.setGame, this.manager);
    }

    // lifecycles
    componentDidMount() {
       // debugger;
        if(this.game.players?.length > 0) {
            this.setGameEntities();
        }
    }

    componentDidUpdate() {
         this.assignVals(this.props);
         console.log("should update: ", this.props.game);
     }


    render() {
        return (
            <div className="game-board" onClick={(e)=> this.checkCancelSelect(e)}>
                {this.props.children}
            </div>
        );
    }
}

export default GameBoard;