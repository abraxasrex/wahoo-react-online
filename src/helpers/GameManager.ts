
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
     
    async kickHome (gameState: any, setGame: any, moveToSlot: any, piece: any, manager:any, keepMoving: boolean) {
        let thisPiece = piece;
        let thisSlot = thisPiece.slot;

       for(let i = 0; i < piece.owner.startSlotKeys.length; i++) {
            let key = piece.owner.startSlotKeys[i];
            if(!gameState.slots[key].occupied) {


                thisPiece.slot = gameState.slots[key];
                thisSlot.occupied = undefined;

                let newState = gameState;

                newState.pieces[thisPiece._id] = thisPiece;
                newState.slots[thisSlot.key] = thisSlot;

                setGame(newState);

                if (keepMoving) {
                    moveToSlot(thisSlot, newState.currentPiece.slot, manager, newState, setGame);
                }
                return;
            }
        }
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

        state = {...state, currentPiece, currentSlot};

        // clone updated elements
        slots[currentSlotIndex || 0] = Object.assign((currentSlot || {}), {occupied: currentPiece.owner});
        if(lastSlot && lastSlotIndex){
            slots[lastSlotIndex] = Object.assign(lastSlot, {occupied: false});
        } 
        pieces[state.currentPiece._id] = currentPiece;

    

      state = {...state, slots, pieces};

      if(targetSlot.slotType == iSlotType.End) {
        state.currentPlayer.endCounter = state.currentPlayer.endCounter + 1;
      }

      if(state.currentPlayer.endCounter > 3) {

        state.winner = state.currentPlayer;
        await stateSetter(state);
        alert(`Player ${state.currentPlayer.playerNumber} won the game!`)
      } else {
        await this.changePlayer(state, stateSetter, originalState);
      }
    }

    async changePlayer (newState: any, stateSetter: any, originalState: any) {
        let state = newState;
        let currentPlayer = state.currentPlayer;
        if(currentPlayer?.playerNumber === 4) {
           state = {...state, currentPlayer: state.players[0]};
        }

            currentPlayer = state.players[(currentPlayer?.playerNumber) || 0];
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
        let stepIndex = parseInt(currentSlot.orderId);
        let steps = [];
        let endCount = 0;

        for(var i = 0; i < (state.currentRoll || 0); i++) {
       
            // get slot at index
            const matchSlot: iSlot = state.slots[stepIndex];

            // End Case
            if(matchSlot.slotType == iSlotType.End) {

                if(matchSlot.owner !== state.currentPlayer) {
                    console.log("This should'nt happen!");
                }
                
                if(matchSlot.owner?.endSlotKeys?.length) {
                    let lastEndSlot: any = matchSlot?.owner?.endSlotKeys[3];
                    if(lastEndSlot.key == matchSlot.key) {
                        steps.push(matchSlot);
                        return steps;
                    }
                }

            }

            // jump case
            if(matchSlot.specialSlotType === iSpecialSlotType.Jump 
                && i < state.currentRoll
                && !state.slots[state.centerSlotId].occupied) {

                    steps.push(state.slots[state.centerSlotId]);
            }

            // exit case
            if(matchSlot.specialSlotType === iSpecialSlotType.Exit
                && matchSlot.owner == state.currentPlayer) {
                let endSlotKeys = state.currentPlayer.endSlotKeys || [];
                
                let openEndKey = endSlotKeys.find((id: any)=> {
                    if(!state.slots[id].occupied) {
                        return true;
                    }
                });
                stepIndex = openEndKey
            }

            // Track case
            if(matchSlot.occupied ) {
                if(matchSlot?.occupied?.playerNumber != state.currentPlayer?.playerNumber) {
                    steps.push(state.slots[stepIndex]);
                }
            } else {
                steps.push(state.slots[stepIndex]);
            }
            
            if(matchSlot.specialSlotType === iSpecialSlotType.Exit
                && matchSlot.owner == state.currentPlayer) {
                let endSlotKeys = state.currentPlayer.endSlotKeys || [];

                stepIndex = endSlotKeys[0];
            } else {
                stepIndex += 1;
            }
            

            //case : reset track
            if(stepIndex >= TrackMax) {
                stepIndex = 0;
            }

        }
        return steps;

    }

}


export default GameManager;