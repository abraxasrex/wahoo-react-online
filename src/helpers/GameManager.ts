
import {getRandomInt} from './Helpers';
import React from 'react';
import {iPlayer} from '../classes/Player';
// import {iSlot} from '../view_components/Slot';
import { AnyARecord } from 'dns';
import { iPiece } from '../classes/Piece';
import { iSlot, iSlotType, iSpecialSlotType } from '../classes/Slot';


export class GameManager {

    constructor() {
        this.highlightSteps = this.highlightSteps.bind(this);
        this.highlightSlotArray = this.highlightSlotArray.bind(this);
        this.changePlayer = this.changePlayer.bind(this);
        this.clearSlate = this.clearSlate.bind(this);
    }

     async rollDice (state: any, stateSetter: any) {
        let currentRoll;
        let hasRolled: boolean = true;
        // TODO: put line back after testing
        // currentRoll = getRandomInt(6);
        currentRoll = 6;

        await stateSetter("hasRolled", hasRolled);
        await stateSetter("currentRoll", currentRoll);

        return state.currentRoll;
    }

    async selectPiece (id: string, state: any, setter: any) {

        let currentPiece: iPiece = state?.pieces[id];
        let currentSlot: iSlot = currentPiece?.slot || {};
        let currentPlayer = state?.currentPlayer;

        if(currentPiece?.owner?.playerNumber === currentPlayer?.playerNumber) {
            await this.highlightSteps(state, setter);
        }

    }

    async highlightSteps (state: any, stateSetter:any) {

        
        let currentSlot: iSlot = state.currentPiece.slot;
        let specialSlots: any = currentSlot?.owner?.specialSlots
        // in Start 
       // let slotsRef = this.slots;
        if (currentSlot?.slotType === iSlotType.Start && (state.currentRoll === 1 || state.currentRoll === 6)) {
           let entrySlot = specialSlots["Entry"];

           let slotRef = state.slots.find((slot: iSlot)=> {
                return slot.x === entrySlot.x && slot.y === entrySlot.y;
           });

            if(!slotRef.occupied && !slotRef.props.occupied) {
                this.highlightSlotArray([entrySlot], stateSetter);
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
               console.log("Jump!")
            }
            if(currentSlot.owner && specialSlots["Exit"]) {
                console.log("Exit!");

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
            this.highlightSlotArray(steps, stateSetter);
        }

        //in End


    }

    async moveToSlot (targetSlot: iSlot, lastSlot: iSlot, state: any, stateSetter: any) {

        let currentSlotIndex = targetSlot?.orderId || '';
        let lastSlotIndex = (lastSlot && lastSlot) ? lastSlot.orderId : undefined;
        let slots = state.slots;
        let pieces = state.pieces;

        // update piece to next slot
     //   this.currentSlot = this.slots[currentSlotIndex];

     let currentSlot: any;

        for ( let [key, _value] of Object.entries(slots)) {
            let value: any = _value;
            if(value.key == targetSlot?.key) {
                currentSlot = value;
            }
        }

        // let currentSlot:iSlot = slots.find((slot: any) => {
        //     return slot.key == (targetSlot.key ? targetSlot.key : targetSlot.key);
        // });

        let currentPiece: iPiece = Object.assign(state.currentPiece, 
            {slot: currentSlot, x: currentSlot?.x, y: currentSlot?.y});
       // this.currentPiece = currentPiece;

        await stateSetter("currentPiece", currentPiece);
        await stateSetter("currentSlot", currentSlot);

        // clone updated elements
        slots[currentSlotIndex || 0] = Object.assign((currentSlot || {}), {occupied: currentPiece.owner});
        if(lastSlot && lastSlotIndex){
            slots[lastSlotIndex] = Object.assign(lastSlot, {occupied: false});
        } 
        pieces[state.currentPiece._id] = currentPiece;

        // update state
        // this.slots = slots;
        // this.pieces = pieces;
        await stateSetter("slots", slots);
        await stateSetter("pieces", pieces);
        return await this.changePlayer(state, stateSetter);

    }

    async changePlayer (state: any, stateSetter: any) {
        // TODO: change currentRound
        let currentPlayer = state.currentPlayer;
        if(currentPlayer?.playerNumber === 4) {
          // this.currentPlayer = this.players[0]
            await stateSetter("currentPlayer", state.players[0])
        } else {
            // playernumber should be one more than index
            currentPlayer = state.players[(currentPlayer?.playerNumber) || 0];
        }
        await this.clearSlate(state, stateSetter);
        // this.hasRolled = false;
        // this.currentRoll = undefined;
        await stateSetter("hasRolled", false);
        await stateSetter("currentRoll", undefined);
        await stateSetter("currentRound", state.currentRound + 1);
    }

    async clearSlate (state: any, stateSetter: any) {
        stateSetter("currentPiece", {key: undefined});
        //   this.currentPiece = false;
        stateSetter("currentSlot", false);
        stateSetter("availableSlots", {});
        //    this.currentSlot = false;
        //    this.availableSlots = {};
    }

    cancelSelect (state: any, stateSetter: any) {
        this.clearSlate(state, stateSetter);
    }

    highlightSlotArray (slots: iSlot[], stateSetter: any) {
        let availableSlots: any= {};

        for (let i = 0; i < (slots?.length || 0); i++) {
            let key = slots[i].key
            if(key) {
                availableSlots[slots[i].key] = true;
            }
        }

        stateSetter("availableSlots", availableSlots);

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

            // let matchSlot = this.slots.find((slot)=> {
            //     return slot.props.order == stepIndex;
            // });
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



// class _GameManager {

//     constructor() {
//    //     this.players = players;
//         this.rollDice = this.rollDice.bind(this);
//         this.selectPiece = this.selectPiece.bind(this);
//         this.moveToSlot = this.moveToSlot.bind(this);
//     }

//     rollDice(event: Event): number {
//       // TODO: put line back after testing
//       //  this.currentRoll = getRandomInt(6);
//         this.currentRoll = 6;
//         this.hasRolled = true;
//         return this.currentRoll;
//     }

//     async selectPiece(id: any) {
//         this.currentPiece = this.pieces[id];
//         this.currentSlot = this.currentPiece.props.slot;

//         if (this.currentPiece.props.player.playerNumber === this.currentPlayer?.playerNumber) {
//             await this.highlightSteps();
//         }
//     }

//     async moveToSlot(targetSlot: any, lastSlot: any) {

//         let currentSlotIndex = targetSlot.order ? targetSlot.order : targetSlot.props.order;
//         let lastSlotIndex = (lastSlot && lastSlot.props) ? lastSlot.props.order : undefined;
//         let slots = this.slots;
//         let pieces = this.pieces;

//         // update piece to next slot
//      //   this.currentSlot = this.slots[currentSlotIndex];
//         this.currentSlot = this.slots.find((slot: any) => {
//             return slot.key == (targetSlot._key ? targetSlot._key : targetSlot.props._key);
//         });

//         let currentPiece = React.cloneElement(this.currentPiece, 
//             {slot: this.currentSlot, x: this.currentSlot.props.x, y: this.currentSlot.props.y});
//         this.currentPiece = currentPiece;

//         // clone updated elements
//         slots[currentSlotIndex] = React.cloneElement(this.currentSlot, {occupied: this.currentPiece.props.player});
//         if(lastSlot && lastSlot.props){
//             slots[lastSlotIndex] = React.cloneElement(lastSlot, {occupied: false});
//         } 
//         pieces[this.currentPiece.props._id] = this.currentPiece;

//         // update state
//         this.slots = slots;
//         this.pieces = pieces;
//         this.changePlayer();
//     }

//     changePlayer() {
//         let currentPlayer = this.currentPlayer;
//         if(currentPlayer?.playerNumber === 4) {
//             this.currentPlayer = this.players[0]
//         } else {
//             // playernumber should be one more than index
//             this.currentPlayer = this.players[(currentPlayer?.playerNumber) || 0];
//         }
//         this.clearSlate();

//         this.hasRolled = false;
//         this.currentRoll = undefined;
//     }

//     clearSlate() {
//         this.currentPiece = {key: undefined};
//      //   this.currentPiece = false;
//         this.currentSlot = false;
//         this.availableSlots = {};
//     }

//     async cancelSelect () {
//         this.clearSlate();
//     }


//     async highlightSlotArray (slots: Array<any> = []) {
//         this.availableSlots = {};
//         for (let i = 0; i < (slots?.length || 0); i++) {
//             this.availableSlots[slots[i].key] = true;
//         }
//     }

//     async getTrackSteps () {
//         let currentSlot = this.currentPiece.props.slot.props;

//         let stepIndex = this.slots.findIndex((slot)=> {
//             return slot.props._key === currentSlot._key;
//         });

//         let steps = [];
//         let endCount = 0;

//         for(var i = 0; i < (this.currentRoll || 0); i++) {
//             stepIndex +=1;
//             if(stepIndex === this.slots.length) {
//                 stepIndex = 0;
//             }

//             // let matchSlot = this.slots.find((slot)=> {
//             //     return slot.props.order == stepIndex;
//             // });
//             let matchSlot = this.slots[stepIndex];

//             // 1. if matchSlot is an "Exit" special type,
//             if(matchSlot.props.specialSlotType == "Exit") {
//                 // 2. find first index of a start piece matching the player
//                 let endIndex = this.slots.findIndex((slot)=> {
//                     return slot.props.owner._id == this.currentPlayer?._id && 
//                     slot.props.slotType == "End";
//                 });
//                 // 3. set stepIndex here... and pray
//                 stepIndex = endIndex;
//             }

//             if(matchSlot.props.slotType == "End") {
//                 endCount += 1;

//                 if(endCount == 4) {
//                     return steps;
//                 }
//             }

//             if(matchSlot.props.occupied ) {
//                 if(matchSlot.props.occupied.playerNumber !== this.currentPlayer?.playerNumber) {
//                     steps.push(this.slots[stepIndex]);
//                 }
//             } else {
//                 steps.push(this.slots[stepIndex]);

//             }
//         }
//         return steps;
//     }

//     async highlightSteps () {

//         let currentSlot = this.currentPiece.props.slot.props;
//         // in Start 
//        // let slotsRef = this.slots;
//         if (currentSlot.slotType === "Start" && (this.currentRoll === 1 || this.currentRoll === 6)) {
//            let entrySlot = currentSlot.owner.specialSlots["Entry"];

//            let slotRef = this.slots.find((slot)=> {
//                 return slot.props.x === entrySlot.x && slot.props.y === entrySlot.y;
//            });

//             if(!slotRef.occupied && !slotRef.props.occupied) {
//                 this.highlightSlotArray([entrySlot]);
//             }
//         }

//         //on Track
//         if(currentSlot.slotType === "Track"){
//             //1. it's a regular track slot: finish  the countTrack function to get your number and
//             // then call highLightSlot Array with the slots added up from your current roll,
//             // *unless* a highlighted step would pass your finish line.
//             // if this exception is passed, calculate only your countTrack up to the finish line,
//             // then add the remaining numbers to register the first slots of your end lane.

//             //2. it's a corner slot ("Jump" specialSlotType)
//             if(currentSlot.specialSlotType === "Jump") {
//                // return;
//                console.log("Jump!")
//             }
//             if(currentSlot.owner && currentSlot.owner.specialSlots["Exit"]) {
//                 console.log("Exit!");

//                 // let entrySlot = currentSlot.owner.specialSlots["Entry"];

//                 // let slotRef = this.slots.find((slot)=> {
//                 //      return slot.props.x === entrySlot.x && slot.props.y === entrySlot.y;
//                 // });
     
//                 //  if(!slotRef.occupied && !slotRef.props.occupied) {
//                 //      this.highlightSlotArray([entrySlot]);
//                 //  }
                
//                 // this.highlightSlotArray()

//             }

            
//             // 1. find Index in this.slots of  currentSlot
//             let steps = await this.getTrackSteps()
//             this.highlightSlotArray(steps);
//         }

//         //in End

//         for(var i = 0; i < this.slots.length; i++) {

//         }

//         // set this.availableSlots
//     }

//     checkForWin() {

//     }

//     triggerWinCondition(){

//     }
// }

export default GameManager;