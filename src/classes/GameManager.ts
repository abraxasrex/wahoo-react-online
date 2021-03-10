
import {getRandomInt} from '../helpers/Helpers';
import React from 'react';
import Player from './Player';
import Slot from '../view_components/Slot';
import { AnyARecord } from 'dns';

class GameManager {

    currentRoll: number | undefined = 0;
    currentPlayer: Player | undefined;
    players: Array<Player>;
    winner: Player | undefined;
    specialSlots: object;
    slots: Array<any>;
    pieces: object | any;
    currentPiece: any;
    availableSlots: any;
    hasRolled: boolean;
    currentSlot: any;

    constructor(players: Array<Player>) {
        this.players = players;
        this.rollDice = this.rollDice.bind(this);
        this.selectPiece = this.selectPiece.bind(this);
        this.moveToSlot = this.moveToSlot.bind(this);

        this.slots = [];
        this.pieces = {};
        this.specialSlots = {};
        this.currentPiece = {key: undefined};
        this.availableSlots = {};
        this.hasRolled = false;
        this.currentPlayer = undefined;
        this.currentSlot = undefined;
    }

    rollDice(event: Event): number {
      // TODO: put line back after testing
      //  this.currentRoll = getRandomInt(6);
        this.currentRoll = 6;
        this.hasRolled = true;
        return this.currentRoll;
    }

    async selectPiece(id: any) {
        this.currentPiece = this.pieces[id];
        this.currentSlot = this.currentPiece.props.slot;

        if (this.currentPiece.props.player.playerNumber === this.currentPlayer?.playerNumber) {
            await this.highlightSteps();
        }
    }

    async moveToSlot(targetSlot: any, lastSlot: any) {

        let currentSlotIndex = targetSlot.order ? targetSlot.order : targetSlot.props.order;
        let lastSlotIndex = (lastSlot && lastSlot.props) ? lastSlot.props.order : undefined;
        let slots = this.slots;
        let pieces = this.pieces;

        // update piece to next slot
     //   this.currentSlot = this.slots[currentSlotIndex];
        this.currentSlot = this.slots.find((slot: any) => {
            return slot.key == (targetSlot._key ? targetSlot._key : targetSlot.props._key);
        });

        let currentPiece = React.cloneElement(this.currentPiece, 
            {slot: this.currentSlot, x: this.currentSlot.props.x, y: this.currentSlot.props.y});
        this.currentPiece = currentPiece;

        // clone updated elements
        slots[currentSlotIndex] = React.cloneElement(this.currentSlot, {occupied: this.currentPiece.props.player});
        if(lastSlot && lastSlot.props){
            slots[lastSlotIndex] = React.cloneElement(lastSlot, {occupied: false});
        } 
        pieces[this.currentPiece.props._id] = this.currentPiece;

        // update state
        this.slots = slots;
        this.pieces = pieces;
        this.changePlayer();
    }

    changePlayer() {
        let currentPlayer = this.currentPlayer;
        if(currentPlayer?.playerNumber === 4) {
            this.currentPlayer = this.players[0]
        } else {
            // playernumber should be one more than index
            this.currentPlayer = this.players[(currentPlayer?.playerNumber) || 0];
        }
        this.clearSlate();

        this.hasRolled = false;
        this.currentRoll = undefined;
    }

    clearSlate() {
        this.currentPiece = {key: undefined};
     //   this.currentPiece = false;
        this.currentSlot = false;
        this.availableSlots = {};
    }

    async cancelSelect () {
        this.clearSlate();
    }


    async highlightSlotArray (slots: Array<any> = []) {
        this.availableSlots = {};
        for (let i = 0; i < (slots?.length || 0); i++) {
            this.availableSlots[slots[i].key] = true;
        }
    }

    async getTrackSteps () {
        let currentSlot = this.currentPiece.props.slot.props;

        let stepIndex = this.slots.findIndex((slot)=> {
            return slot.props._key === currentSlot._key;
        });

        let steps = [];
        let endCount = 0;

        for(var i = 0; i < (this.currentRoll || 0); i++) {
            stepIndex +=1;
            if(stepIndex === this.slots.length) {
                stepIndex = 0;
            }

            // let matchSlot = this.slots.find((slot)=> {
            //     return slot.props.order == stepIndex;
            // });
            let matchSlot = this.slots[stepIndex];

            // 1. if matchSlot is an "Exit" special type,
            if(matchSlot.props.specialSlotType == "Exit") {
                // 2. find first index of a start piece matching the player
                let endIndex = this.slots.findIndex((slot)=> {
                    return slot.props.owner._id == this.currentPlayer?._id && 
                    slot.props.slotType == "End";
                });
                // 3. set stepIndex here... and pray
                stepIndex = endIndex;
            }

            if(matchSlot.props.slotType == "End") {
                endCount += 1;

                if(endCount == 4) {
                    return steps;
                }
            }

            if(matchSlot.props.occupied ) {
                if(matchSlot.props.occupied.playerNumber !== this.currentPlayer?.playerNumber) {
                    steps.push(this.slots[stepIndex]);
                }
            } else {
                steps.push(this.slots[stepIndex]);

            }
        }
        return steps;
    }

    async highlightSteps () {

        let currentSlot = this.currentPiece.props.slot.props;
        // in Start 
       // let slotsRef = this.slots;
        if (currentSlot.slotType === "Start" && (this.currentRoll === 1 || this.currentRoll === 6)) {
           let entrySlot = currentSlot.owner.specialSlots["Entry"];

           let slotRef = this.slots.find((slot)=> {
                return slot.props.x === entrySlot.x && slot.props.y === entrySlot.y;
           });

            if(!slotRef.occupied && !slotRef.props.occupied) {
                this.highlightSlotArray([entrySlot]);
            }
        }

        //on Track
        if(currentSlot.slotType === "Track"){
            //1. it's a regular track slot: finish  the countTrack function to get your number and
            // then call highLightSlot Array with the slots added up from your current roll,
            // *unless* a highlighted step would pass your finish line.
            // if this exception is passed, calculate only your countTrack up to the finish line,
            // then add the remaining numbers to register the first slots of your end lane.

            //2. it's a corner slot ("Jump" specialSlotType)
            if(currentSlot.specialSlotType === "Jump") {
               // return;
               console.log("Jump!")
            }
            if(currentSlot.owner && currentSlot.owner.specialSlots["Exit"]) {
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
            let steps = await this.getTrackSteps()
            this.highlightSlotArray(steps);
        }

        //in End

        for(var i = 0; i < this.slots.length; i++) {

        }

        // set this.availableSlots
    }

    checkForWin() {

    }

    triggerWinCondition(){

    }
}

export default GameManager;