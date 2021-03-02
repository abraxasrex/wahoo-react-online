
import {getRandomInt} from '../helpers/Helpers';
import React from 'react';

class GameManager {

    currentRoll = 0;
    currentPlayer;
    winner;
    specialSlots;

    constructor(players) {
        this.players = players;
        this.rollDice = this.rollDice.bind(this);
        this.selectPiece = this.selectPiece.bind(this);
        this.moveToSlot = this.moveToSlot.bind(this);

        this.slots = [];
        this.pieces = [];
        this.specialSlots = {};
        this.currentPiece = {key: undefined};
        this.availableSlots = {};
        this.hasRolled = false;
    }

    rollDice(event) {
      // TODO: put line back after testing
      //  this.currentRoll = getRandomInt(6);
        this.currentRoll = 6;
        this.hasRolled = true;
        return this.currentRoll;
    }

    async selectPiece(id) {
        this.currentPiece = this.pieces.find((piece)=> {
            return piece.props._id === id;
        });

        this.currentSlot = this.currentPiece.props.slot;

        if (this.currentPiece.props.player.playerNumber === this.currentPlayer.playerNumber) {
            await this.highlightSteps();
        }
    }

 

    async moveToSlot(targetSlot) {
      //  let destKey = targetSlot.key || targetSlot._key;
        let lastSlot = this.currentSlot;
        let currentSlotIndex = targetSlot.order;
        let lastSlotIndex = lastSlot.order;

        this.currentSlot = this.slots[targetSlot.order];
      //  this.currentSlot = this.slots[currentSlotIndex];

        // 1. take in whateverSlotInfo available on this slot + current state
        // a. this.currentSlot
        // b. this.currentPiece
        // c. slot: order, occupied, order/count,
        // 2.  get cloned and modified instances of last and current slots and current piece
        // 2.5. break into two async sub functions changePiece and changeSlot
        // 3. changeplayer

        // let currentSlotIndex = this.slots.findIndex((slot)=> {
        //     return slot.props._key === destKey;
        // });

        // let lastSlotIndex = this.slots.findIndex((slot)=> {
        //   //  debugger;
        //     return slot.key === lastSlot.key;
        // });
      //  this.currentSlot = this.slots[currentSlotIndex];

        let currentPiece = React.cloneElement(this.currentPiece, 
            {slot: this.currentSlot, x: this.currentSlot.props.x, y: this.currentSlot.props.y});
        this.currentPiece = currentPiece;
        let pieces = this.pieces;
        let pieceIndex = pieces.findIndex((piece) => {
            // crappy test until pieces get their own ids...
            return piece.props.player === this.currentPiece.props.player 
                && piece.props._id === this.currentPiece.props._id;
        });
        debugger;

      //  debugger;
        let slots = this.slots;
        slots[currentSlotIndex] = React.cloneElement(this.currentSlot, {occupied: this.currentPiece.props.player});
        slots[lastSlotIndex] = React.cloneElement(lastSlot, {occupied: false});
        pieces[pieceIndex] = this.currentPiece;
        this.slots = slots;
        this.pieces = pieces;
        this.changePlayer();
    }

    changePlayer() {
        let currentPlayer = this.currentPlayer;
        if(currentPlayer.playerNumber === 4) {
            this.currentPlayer = this.players[0]
        } else {
            // playernumber should be one more than index
            this.currentPlayer = this.players[currentPlayer.playerNumber];
        }
        this.clearSlate();

        this.hasRolled = false;
        this.currentRoll = false;
    
    }

    clearSlate() {
        this.currentPiece = {key: undefined};
        this.currentPiece = false;
        this.currentSlot = false;
        this.availableSlots = {};
    }

    async cancelSelect () {
        this.clearSlate();
    }


    async highlightSlotArray (slots) {
      //  debugger;
        this.availableSlots = {};
        for (let i = 0; i < slots.length; i++) {
            this.availableSlots[slots[i]] = true;
        }
    }

    async getTrackSteps () {

        let currentSlot = this.currentPiece.props.slot.props;

        let stepIndex = this.slots.findIndex((slot)=> {
            return slot.props._key === currentSlot._key;
        });

        let steps = [];

        for(var i = 0; i < this.currentRoll; i++) {
            stepIndex +=1;
            if(stepIndex === this.slots.length) {
                stepIndex = 0;
            }

            // to-add: remove steps with own piece before returning
            if(this.slots[stepIndex].props.occupied ) {
                if(this.slots[stepIndex].props.occupied.playerNumber !== this.currentPlayer.playerNumber) {
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
        if (currentSlot.slotType === "Start" && (this.currentRoll === 1 || this.currentRoll === 6)) {
           let entrySlot = currentSlot.owner.specialSlots["Entry"].key;
           // debugger;
           // debugger;
            if(!entrySlot.occupied) {
               // debugger;
                this.highlightSlotArray([entrySlot])
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
           // debugger;
        //   debugger;
            if(currentSlot.specialSlotType === "Jump") {
               // return;
               console.log("Jump!")
            }
            //3. it's a closing spot ("exit")
            if(currentSlot.owner && currentSlot.owner.specialSlots["Exit"]) {
                console.log("Exit!");
                
                this.highlightSlotArray()

            }

          //  this.currentRoll
            // 1. find Index in this.slots of  currentSlot
          //  debugger;
            let steps = await this.getTrackSteps()

            this.highlightSlotArray(steps);
            // 2. using that index, count up in array along the track until you find elements with order +1.
            // 2.5. save their indices
            // 3. send all keys to highlightSlotArray

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