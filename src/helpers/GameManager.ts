
import {getRandomInt} from './Helpers';
import React from 'react';
import {iPlayer} from '../classes/Player';
import { AnyARecord } from 'dns';
import { iPiece } from '../classes/Piece';
import {iGame} from '../classes/Game';
import { iSlot, iSlotType, iSpecialSlotType } from '../classes/Slot';
import {TrackMax} from '../constants/board_constants';


export class GameManager {

    constructor() {
        this.highlightSteps = this.highlightSteps.bind(this);
        this.highlightSlotArray = this.highlightSlotArray.bind(this);
        this.changePlayer = this.changePlayer.bind(this);
        this.clearSlate = this.clearSlate.bind(this);
    }

     async rollDice (state: any, stateSetter: any) {
        let _currentRoll;
        let _hasRolled: boolean = true;
        // TODO: put line back after testing
        // currentRoll = getRandomInt(6);
        _currentRoll = 6;

        await stateSetter({...state, hasRolled: _hasRolled, currentRoll: _currentRoll});
         return _currentRoll;
    }

    async selectPiece (id: string, state: any, setter: any) {

        let currentPiece: iPiece = state?.pieces[id];
        let currentSlot: iSlot = currentPiece?.slot || {};
        let currentPlayer = state?.currentPlayer;

        let newState = {...state, currentPiece, currentSlot};
        await setter(newState);

        if(currentPiece?.owner?.playerNumber === currentPlayer?.playerNumber) {
            await this.highlightSteps(newState, setter);
        }

        return newState;

    }

    canJump (x1: any, x2: any, y1: any, y2: any) {
        if(x1 != x2 && y1 != y2) {
            return true;
        }

    }
    
    async highlightSteps (state: any, stateSetter:any) {

        
        let currentSlot: iSlot = state.currentPiece.slot;
        let specialSlots: any = currentSlot?.owner?.specialSlots
        // in Start 
        if (currentSlot?.slotType === iSlotType.Start && (state.currentRoll === 1 || state.currentRoll === 6)) {
           // this is the enum for Entry....
            let entrySlot = specialSlots[0];
           let slotRef: any = undefined;

           for (const _slot in state.slots) {
                let slot: any = state.slots[_slot]
                if(slot.x === entrySlot.x && slot.y === entrySlot.y) {
                    slotRef = slot;
                    break;
                }
            }

            if(slotRef?.occupied !== state.currentPlayer) {
                await this.highlightSlotArray([entrySlot], state, stateSetter);
            }
        }

        //2. it's a corner slot ("Jump" specialSlotType)
        if(currentSlot.slotType === iSlotType.Center) {
            
            let steps: any = [];
            for( let [key, _val] of Object.entries(state.specialSlots)) {
                let val: any = _val;
                if(val.specialSlotType === iSpecialSlotType.Jump 
                 //   && this.canJump(val.x, val.y, currentSlot.x, currentSlot.y)
                    && state.slots[key].owner !== state.currentPlayer) {
                    steps.push(state.slots[key]);
                }
            }
            this.highlightSlotArray(steps, state, stateSetter);

        }
        //on Track
        if(currentSlot?.slotType === iSlotType.Track){




            
            // 1. find Index in this.slots of  currentSlot
            let steps = await this.getTrackSteps(state, stateSetter);
            this.highlightSlotArray(steps, state, stateSetter);
        }

        //in End

    }

    async moveToSlot (targetSlot: iSlot, lastSlot: iSlot, originalState: any, stateSetter: any) {

        let state = originalState;
        let currentSlotIndex = targetSlot?.key || '';
        let lastSlotIndex = lastSlot ? lastSlot.key : undefined;
        let slots = state.slots;
        let pieces = state.pieces;

        // update piece to next slot

     let currentSlot: any;

        for ( let [key, _value] of Object.entries(slots)) {
            let value: any = _value;
            if(key == targetSlot?.key) {
                currentSlot = value;
            }
        }

        let currentPiece: iPiece = Object.assign(state.currentPiece, 
            {slot: currentSlot, x: currentSlot?.x, y: currentSlot?.y});

       // await stateSetter({...state, currentPiece, currentSlot});
        state = {...state, currentPiece, currentSlot};

        // clone updated elements
        slots[currentSlotIndex || 0] = Object.assign((currentSlot || {}), {occupied: currentPiece.owner});
        if(lastSlot && lastSlotIndex){
            slots[lastSlotIndex] = Object.assign(lastSlot, {occupied: false});
        } 
        pieces[state.currentPiece._id] = currentPiece;

        // if(targetSlot.occupied && targetSlot.occupied !== currentPiece.owner){
        //     let enemyPiece = targetSlot;
        // }

      state = {...state, slots, pieces};
        await this.changePlayer(state, stateSetter, originalState);

    }

    async changePlayer (newState: any, stateSetter: any, originalState: any) {
        let state = newState;
        // TODO: change currentRound
        let currentPlayer = state.currentPlayer;
        if(currentPlayer?.playerNumber === 4) {
           // await stateSetter({...state, currentPlayer: state.players[0]});
           state = {...state, currentPlayer: state.players[0]};
        }
     //   } else {
            // playernumber should be one more than index
            currentPlayer = state.players[(currentPlayer?.playerNumber) || 0];
     //   }
        state = await this.clearSlate(state, stateSetter, false);
        await stateSetter({...state, hasRolled: false, currentRoll: undefined, currentRound: state.currentRound + 1, currentPlayer});
    }

    async clearSlate (newState: any, stateSetter: any, willSetState: boolean) {
        if(!willSetState) {
            return {...newState, currentPiece: {key: undefined}, currentSlot: false, availableSlots: {}};
        }
        else {
            let state = newState;
            await  stateSetter({...newState, currentPiece: {key: undefined}, currentSlot: false, availableSlots: {}});
        }
    }

    cancelSelect (state: any, stateSetter: any) {
        this.clearSlate(state, stateSetter, true);
    }

    async highlightSlotArray (slots: iSlot[], state: iGame, stateSetter: any) {
        let availableSlots: any= {};

        for (let i = 0; i < (slots?.length || 0); i++) {
            let key = slots[i].key
            availableSlots[key] = slots[i];
        }
        await stateSetter({...state, availableSlots});

    }

    getTrackSteps (state: any, stateSetter: any): iSlot [] {

        let currentSlot = state.currentPiece.slot;

        // let stepIndex = state.slots.findIndex((slot: iSlot)=> {
        //     return slot.key === currentSlot.key;
        // });

        let stepIndex = parseInt(currentSlot.orderId);

        let steps = [];
        let endCount = 0;

        for(var i = 0; i < (state.currentRoll || 0); i++) {
       

            const matchSlot: iSlot = state.slots[stepIndex];

            // 1. if matchSlot is an "Exit" special type,
         

            if(matchSlot.slotType == iSlotType.End) {
                endCount += 1;

                if(endCount == 4) {
                    return steps;
                }
            }

            if(matchSlot.occupied ) {
                if(matchSlot?.occupied?.playerNumber != state.currentPlayer?.playerNumber) {
                    steps.push(state.slots[stepIndex]);
                }
            } else {
                steps.push(state.slots[stepIndex]);
            }

            if(matchSlot.specialSlotType === iSpecialSlotType.Jump 
                && i < state.currentRoll
                && !state.slots[state.centerSlotId].occupied) {
               // steps.push
               steps.push(state.slots[state.centerSlotId]);
            }
            if(matchSlot.specialSlotType === iSpecialSlotType.Exit) {
                let endSlotKeys = matchSlot?.owner?.endSlotKeys || [];
                stepIndex = endSlotKeys[0];
            } else {
                stepIndex +=1;
            }

            if(stepIndex === TrackMax) {
                stepIndex = 0;
            }

        }
        return steps;

    }

}


export default GameManager;