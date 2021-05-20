
import {getRandomInt} from './Helpers';
import React from 'react';
import {iPlayer} from '../classes/Player';
// import {iSlot} from '../view_components/Slot';
import { AnyARecord } from 'dns';
import { iPiece } from '../classes/Piece';
import {iGame} from '../classes/Game';
import { iSlot, iSlotType, iSpecialSlotType } from '../classes/Slot';


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

        let _currentPiece: iPiece = state?.pieces[id];
        let _currentSlot: iSlot = _currentPiece?.slot || {};
        let currentPlayer = state?.currentPlayer;

        let newState = {...state, currentPiece: _currentPiece, currentSlot: _currentSlot};
        await setter(newState);

        if(_currentPiece?.owner?.playerNumber === currentPlayer?.playerNumber) {
            await this.highlightSteps(newState, setter);
        }

    }

    async highlightSteps (state: any, stateSetter:any) {

        
        let currentSlot: iSlot = state.currentPiece.slot;
        let specialSlots: any = currentSlot?.owner?.specialSlots
        // in Start 
        if (currentSlot?.slotType === iSlotType.Start && (state.currentRoll === 1 || state.currentRoll === 6)) {
           let entrySlot = specialSlots["Entry"];

           let slotRef: any = undefined;


           for (const _slot in state.slots) {
                let slot: any = state.slots[_slot]
                if(slot.x === entrySlot.x && slot.y === entrySlot.y) {
                    slotRef = slot;
                    break;
                }
            }

            if(!slotRef?.occupied) {
                this.highlightSlotArray([entrySlot], state, stateSetter);
            }
        }

        //on Track
        if(currentSlot?.slotType === iSlotType.Track){
            //1. it's a regular track slot: finish  the countTrack function to get your number and
            // then call highLightSlot Array with the slots added up from your current roll,
            // *unless* a highlighted step would pass your finish line.
            // if this exception is passed, calculate only your countTrack up to the finish line,
            // then add the remaining numbers to register the first slots of your end lane.

            //2. it's a corner slot ("Jump" specialSlotType)
            if(currentSlot.specialSlotType === iSpecialSlotType.Jump) {
               // return;
            }
            if(currentSlot.owner && specialSlots["Exit"]) {

                // let entrySlot = currentSlot.owner.specialSlots["Entry"];

                // let slotRef = this.slots.find((slot)=> {
                //      return slot.props.x === entrySlot.x && slot.props.y === entrySlot.y;
                // });
     
                //  if(!slotRef.occupied && !slotRef.props.occupied) {
                //      this.highlightSlotArray([entrySlot]);
                //  }
                
                // this.highlightSlotArray()

            }

            
            // 1. find Index in this.slots of  currentSlot
            let steps = await this.getTrackSteps(state, stateSetter);
            this.highlightSlotArray(steps, state, stateSetter);
        }

        //in End

    }

    async moveToSlot (targetSlot: iSlot, lastSlot: iSlot, state: any, stateSetter: any) {

        let currentSlotIndex = targetSlot?.orderId || '';
        let lastSlotIndex = (lastSlot && lastSlot) ? lastSlot.orderId : undefined;
        let slots = state.slots;
        let pieces = state.pieces;

        // update piece to next slot

     let currentSlot: any;

        for ( let [key, _value] of Object.entries(slots)) {
            let value: any = _value;
            if(value.key == targetSlot?.key) {
                currentSlot = value;
            }
        }

        let currentPiece: iPiece = Object.assign(state.currentPiece, 
            {slot: currentSlot, x: currentSlot?.x, y: currentSlot?.y});

        await stateSetter({...state, currentPiece: currentPiece});
        await stateSetter({...state, currentSlot: currentSlot});

        // clone updated elements
        slots[currentSlotIndex || 0] = Object.assign((currentSlot || {}), {occupied: currentPiece.owner});
        if(lastSlot && lastSlotIndex){
            slots[lastSlotIndex] = Object.assign(lastSlot, {occupied: false});
        } 
        pieces[state.currentPiece._id] = currentPiece;

        // update state
        await stateSetter({...state, slots: slots, pieces: pieces});
        return await this.changePlayer(state, stateSetter);

    }

    async changePlayer (state: any, stateSetter: any) {
        // TODO: change currentRound
        let currentPlayer = state.currentPlayer;
        if(currentPlayer?.playerNumber === 4) {
            await stateSetter({...state, currentPlayer: state.players[0]});
        } else {
            // playernumber should be one more than index
            currentPlayer = state.players[(currentPlayer?.playerNumber) || 0];
        }
        await this.clearSlate(state, stateSetter);
        await stateSetter({...state, hasRolled: false, currentRoll: undefined, currentRound: state.currentRound + 1});
    }

    async clearSlate (state: any, stateSetter: any) {
        stateSetter({...state, currentPiece: {key: undefined}, currentSlot: false, availableSlots: {}});
    }

    cancelSelect (state: any, stateSetter: any) {
        this.clearSlate(state, stateSetter);
    }

    highlightSlotArray (slots: iSlot[], state: iGame, stateSetter: any) {
        let availableSlots: any= {};

        for (let i = 0; i < (slots?.length || 0); i++) {
            let key = slots[i].key
            if(key) {
                availableSlots[slots[i].key] = true;
            }
        }

        stateSetter({...state, availableSlots: availableSlots});

    }

    getTrackSteps (state: any, stateSetter: any): iSlot [] {

        let currentSlot = state.currentPiece.slot;

        let stepIndex = state.slots.findIndex((slot: iSlot)=> {
            return slot.key === currentSlot.key;
        });

        let steps = [];
        let endCount = 0;

        for(var i = 0; i < (state.currentRoll || 0); i++) {
            stepIndex +=1;
            if(stepIndex === state.slots.length) {
                stepIndex = 0;
            }

            let matchSlot: iSlot = state.slots[stepIndex];

            // 1. if matchSlot is an "Exit" special type,
            if(matchSlot.specialSlotType == iSpecialSlotType.Exit) {
                // 2. find first index of a start piece matching the player
                let endIndex = state.slots.findIndex((slot: any)=> {
                    return slot.owner._id == state.currentPlayer?._id && 
                    slot.slotType == iSlotType.End;
                });
                // 3. set stepIndex here... and pray
                stepIndex = endIndex;
            }

            if(matchSlot.slotType == iSlotType.End) {
                endCount += 1;

                if(endCount == 4) {
                    return steps;
                }
            }

            if(matchSlot.occupied ) {
                if(matchSlot?.owner?.playerNumber !== state.currentPlayer?.playerNumber) {
                    steps.push(state.slots[stepIndex]);
                }
            } else {
                steps.push(state.slots[stepIndex]);

            }
        }
        return steps;

    }

}


export default GameManager;