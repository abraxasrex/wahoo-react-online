import React, {useState} from 'react';
import Slot from './Slot';
import GamePiece from './GamePiece';
import GamePieceList from './GamePieceList';

const GridStartBound = 0;

const GridEndBound = 14;

const TrackMax = 56;
const EndMax = 12;

// multiplier to expand slot distribution to fit board.
const multiplier = 25;

const TrackStartPositions = [{x:0, y:5}];

const TrackPattern = [
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

const StartLaneStartPositions = [
    {x: 1, y: 1},
    {x: 1, y: 13},
    {x: 13, y: 13},
    {x: 13, y: 1}
]
    
const StartLanePattern = [
    {x: 1, y: 1, duration: 3},
    {x: 1, y: -1, duration: 3},
    {x: -1, y: -1, duration: 3},
    {x: -1, y: 1, duration: 3}
];
const EndLaneStartPositions = [
    {x: 1, y: 7},
    {x: 7, y: 13},
    {x: 13, y: 7},
    {x: 7, y: 1}
]
const EndLanePattern = [
    ["x", 1, 3],
    ["y", -1, 3],
    ["x", -1, 3],
    ["y", 1, 3]
];

const CenterSlotStartPosition = [{x: 7, y: 7}];

const CenterSlotPattern = [];



class GameBoard extends React.Component  {

    state = {slots: [], pieces: []};

    constructor(props) {
        super(props);
        // this.setPositions = setPositions;
        // this.addSlot = addSlot;
        // this.setPatterns = setPatterns;
       // this.setGameEntities();
       // debugger;
        // this.props;
        // this.setState({pieces: [...this.props.game.manager.pieces]});
        // this.setState({slots: [...this.props.game.manager.slots]});
    }

    async setPatterns (players) {

        const slots = [];
        await this.setPositions(TrackPattern, TrackStartPositions, slots, "Track", players, false, "Straight");
        await this.setPositions(EndLanePattern, EndLaneStartPositions, slots, "End", players, true, "Straight");
        await this.setPositions(CenterSlotPattern, CenterSlotStartPosition, slots, "Center", players, false, "Straight");
        await this.setPositions(StartLanePattern, StartLaneStartPositions, slots, "Start", players, true, "Diagonal");
        return slots; 
    }
    
    async addSlot(slot, slots, counter) {
         
        let _slot = <Slot x={slot.x} y={slot.y} occupied={slot.occupied} slotType={slot.slotType} game={this.props.game} setGame={this.props.setGame} manager={this.props.game.manager}
            order={slot.order} key={ (counter.toString() + slot.owner.toString() + slot.order.toString() + slot.slotType.toString() + slot.y.toString() + slot.x.toString())} owner={slot.owner}>
            </Slot>
        await slots.push(_slot);
        await (counter += 1);
    }
    
    setPositions (pattern, startPositions, slots, slotType, players, directMap, orientation) {
        // Slot--------------
    // x: int
    // y: int
    // occupied: GamePiece | falsey
    // slotType: "Track" | "Start" | "End"
    // order: 0-56 (track), 0-4 (start, end)
    // owner: Player ()
    // ------------------------
        let x = 0;
        let y = 0;
        let count = 0;
        let occupied = false;
        let player = false;
        // let slotType = slotType;
    
        // calculate path of slots from 1 or more starting places
        for (var i = 0; i < startPositions.length; i++) {
    
            // initialize x and y for pattern start
            x = (startPositions[i].x * multiplier);
            y = (startPositions[i].y * multiplier);
    
            // if there's a player, set player
            if (slotType === "End" || slotType === "Start") {
                player = players[i];
            }
            // let props = this.props;
            let slot = {x: x, y: y, occupied: occupied, slotType: slotType, order: count, owner: player}
            this.addSlot(slot, slots, count, this.props);     
    
            // calculates tht direction to move and place the next slot
            // if its directly mapped the pattern is 1:1 with the startposition array
            var j = directMap ? i : 0;
            var bound = directMap ? (j + 1) : pattern.length;
            for (j; j < bound; j++) {
    
                // Diagonal scales differently
                if (orientation === "Diagonal") {
                    let duration = pattern[j]["duration"] || 1;
    
                    for (var k = 0; k < duration; k++) {
                        let model = {x: x, y: y};
                        model["x"] += (pattern[j]["x"] * multiplier);
                        model["y"] += (pattern[j]["y"] * multiplier);
                        let slot = {x: model.x, y: model.y, occupied: occupied, slotType: slotType, order: count, owner: player}
                        this.addSlot(slot, slots, count);
                        x = model.x;
                        y = model.y;
                    }
                } else {
                    for (var k = 0; k < pattern[j][2]; k++) {
    
                        let model = {x: x, y: y};
        
                        model[pattern[j][0]] += (pattern[j][1] * multiplier);
        
                        let slot = {x: model.x, y: model.y, occupied: occupied, slotType: slotType, order: count, owner: player}
                        this.addSlot(slot, slots, count);
        
                        x = model.x;
                        y = model.y;
                    }
                }
            }
        }
        return slots;
    }

    async setManagerState(field, values) {
        let manager = this.props.game.manager;
        manager[field] = values;
        // debugger;
        await this.props.setGame({manager: manager});
    }

    async getPositions() {
        let players = this.props.game.manager.players;
        let slots = await this.setPatterns(players, this.props);
        // this.setState({slots: slots});
        // debugger;
        await this.setManagerState("slots", slots);
    }
    async setPieces() {

    //     let _slot = <Slot x={slot.x} y={slot.y} occupied={slot.occupied} slotType={slot.slotType} 
    //     order={slot.order} owner={slot.owner}>
    //     </Slot>
    // await slots.push(_slot);
    // await (counter += 1);
        let pieces = [];
        let slots = this.props.game.manager.slots;
        // debugger;
        for (var i = 0; i < slots.length; i++) {
            if(slots[i].props.slotType === "Start") {
                let game = this.props.game;
                let setGame = this.props.setGame;
                let piece = <GamePiece slot={slots[i]} key={i} _id={i} game={game} manager={game.manager}
                    setGame={setGame} selectPiece={this.selectPiece}></GamePiece>;
                await pieces.push(piece);
            }
        }

       // await this.setState({pieces: pieces});
        await this.setManagerState("pieces", pieces)

    }

    async setGameEntities() {
        console.log("props in entities: ", this.props);
        await this.getPositions(this.props);
        console.log("did slots load? :", this.props.game.manager.slots)
        await this.setPieces(this.props);
        console.log("did pieces load? :", this.props.game.manager.pieces)
        // this.setState({pieces: [...this.props.game.manager.pieces]});
        // this.setState({slots: [...this.props.game.manager.slots]});
    }
    selectPiece = () => {
        console.log("entities", this.setGameEntities);
        // debugger;
        // this.setGameEntities();
        this.setPieces(this.props);

        // this.setState({pieces: [...this.props.game.manager.pieces]});
        // this.setState({slots: [...this.props.game.manager.slots]});
        // this.setState({pieces: []});
    }
    componentDidMount() {
        this.setGameEntities();
        // let pieces = [];
        // for(var i = 0; i < this.props.game.manager.pieces; i++) {
        //     pieces.push({...this.props.game.manager.pieces[i]});
        // }
        // this.state.pieces = pieces;    
        // this.setState({pieces: [...this.props.game.manager.pieces]})
        // this.setState({slots: [...this.props.game.manager.slots]})
    }

    componentWillUpdate(nextProps, nextState) {
        console.log("NEXT: ", nextProps);
      //  let pieces = [];
        // for(var i = 0; i < nextProps.game.manager.pieces; i++) {
        //     pieces.push({...nextProps.game.manager.pieces[i]});
        // }
        // this.state.pieces = pieces;

    }

    render() {
        // let pieces = [];

        // for(var i = 0; i < this.props.game.manager.pieces; i++) {
        //     pieces.push({...this.props.game.manager.pieces[i]});
        // }
        // this.pieces = pieces;    

        // this.state.pieces = [];
        // for (var i = 0; i < this.props.game.manager.pieces; i++) {
        //     this.state.pieces.push(this.props.game.manager.pieces[i]);
        // }

        // this.state.slots = [...this.props["game"]["manager"]["slots"]] || [];        
        // this.state.pieces = [...this.props["game"]["manager"]["pieces"]] || [];

        return (
            <div className="game-board">

            {this.props["game"]["manager"]["slots"]}
            {this.props["game"]["manager"]["pieces"]}
            {/*this.state.slots.map(slot => slot)*/}
            {/*this.state.pieces.map(piece => piece)*/}

            {/*(<GamePieceList gamePieces={this.props["game"]["manager"]["pieces"]}></GamePieceList>)*/}

            {/*<p>plungus: {this.props["game"]["manager"]["currentPiece"] || "plungus"} </p>*/}
                {/*this.props["game"]["manager"]["slots"].map(slot => slot ) || []*/}
                {/*this.props["game"]["manager"]["pieces"].map(piece => piece) || []*/}
            </div>
        );
    }
}

export default GameBoard;