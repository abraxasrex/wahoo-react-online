
import {getRandomInt} from '../helpers/Helpers';
import React from 'react';

class GameManager {

    currentRoll = 0;
    currentPlayer;
    currentPieceId;
    winner;
    specialSlots;

    constructor(players) {
        this.players = players;
        this.rollDice = this.rollDice.bind(this);
        this.selectPiece = this.selectPiece.bind(this);

        this.slots = [];
        this.pieces = [];

        this.specialSlots = [];

        this.currentPieceId = 420;

        this.availableSlots = {};
    }

    startGame(players) {
        this.currentPlayer = players[0];
        return this.currentPlayer;
    }

    rollDice(event) {
        this.currentRoll = getRandomInt(6);
      //  console.log("dice: ", this.currentRoll);
        return this.currentRoll;
    }

    async selectPiece(id) {
        
        this.currentPieceId = id;
        this.currentPiece = this.pieces.find((piece)=> {
            return piece.props._id === id;
        });
      //  console.log("clicked piece: ", this.currentPiece);
      //  debugger;
        if (this.currentPiece.props.player.playerNumber === this.currentPlayer.playerNumber) {
      //  debugger;

          //  console.log("piece!: ", this.currentPieceId);
          //  await this.clearAvailability();
            await this.highlightSteps();
        }

        // return;
    }

    async clearAvailability () {
        for(var i = 0; i < this.slots.length;i++) {
            if(this.slots[i].props.availableSlot) {
                this.slots.splice(
                    React.cloneElement(this.slots[i], { availableSlot: false }), 1
                );
            }
        }
        return;
    }

    async secondaryPathfinding() {

    }



    markTracks () {

    }

    async highlightSlotArray (slots) {
        debugger;
      //  console.log("highlight these slots: ");
        this.availableSlots = {};
        for (let i = 0; i < slots.length; i++) {
            this.availableSlots[slots[i].key] = true;
        }
        // blah blah blah, highlighting logic. 
        // - also: make sure this gets selection and moving UI triggered

        // make use of similar logic to the selected-piece class application,
        // - but: with a different color on GamePiece border from the selection color
    }

    countTracks() {
        // 1. count normally up from the id value according to 'this.currentRoll'
         //  -  move cached array to highLightSlotArray
        // 2. is special slot, go into special slot section
        // 2a: exit- highLightSlotarray with user's exit lane slots
        // 2b: jump: use the same logic as 1, except add the center slot to the array
    }

    async highlightSteps () {

        let currentSlot = this.currentPiece.props.slot.props;
        // in Start 
     //   debugger;
        if (currentSlot.slotType === "Start" && (this.currentRoll === 1 || this.currentRoll === 6)) {
            // slot with specialSlotType Entry && its playerNumber matches this.currentPlayer
            let entrySlot = currentSlot.owner.specialSlots["Entry"]
        //    debugger;
            this.highlightSlotArray([entrySlot])
          //  this.players[this.currentPlayer]
            // if(currentSlot.specialSlotType ==="Entry" && this.currentPlayer === currentSlot.playerNumber) {
            //     console.log("bump!: ", currentSlot, this.currentPlayer);
            // }
            // this shouldn't have to cycle; needs object map :/ ???
        //    console.log("SpecialSlots : ", this.specialSlots);
            // 1. go and map the player's starting slot to the player's state
            // 2. call highlightSlotArray with this player's starting slot.
        } else if (currentSlot.slotType === "Start") {
            return false;
        }

        //on Track
        if(currentSlot.slotType === "Track"){
            //1. it's a regular track slot: finish  the countTrack function to get your number and
            // then call highLightSlot Array with the slots added up from your current roll,
            // *unless* a highlighted step would pass your finish line.
            // if this exception is passed, calculate only your countTrack up to the finish line,
            // then add the remaining numbers to register the first slots of your end lane.

            //2. it's a corner slot ("Jump" specialSlotType)
            //3. it's a closing spot ("exit")

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