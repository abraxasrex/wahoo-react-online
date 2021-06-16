import React from 'react';
import {iLobbyForm} from '../interfaces/index';

// interface MyProps {
//     ...
//   }
  
  interface MyState {
    value: string
  }

//   interface iLobbyPlayerProps extends React.Props<any> {
//     player: any;
//     key: any;
//     index: any;
//     lobby: any;
//     setLobby: any;
// }

class LobbyPlayer extends React.Component<any> {

    // player;
    // setLobby;
    // lobby;
    // index;
    form: iLobbyForm = {playerName: '', gameColor: ''};
    state: any;
    setLobby: any;
    clientPlayer: any;



    constructor(props: any) {
        super(props);

        this.setLobby = this.props.setLobby;
        this.clientPlayer = this.props.clientPlayer;

        let _state: any = {
            player: props.player,
            setLobby: props.setLobby,
            lobby: props.lobby,
            index:  props.index,
            form: this.form
        }

       this.state = _state;
    

        this.nameOnChange = this.nameOnChange.bind(this);
    }
        // let name = player?.name;
        // console.log(" a player view has rendered!");

        selectColor (e: any, color: any) {
            e.preventDefault();
            // let _players = [...this.lobby.players];
            // let _player = this.player;
            // _player.gameColor = color;
            // _players[this.index] = _player;

            // this.setLobby({...this.lobby, players: _players});
            this.form.gameColor = color;
            this.setState({...this.props.lobby, form: this.form});
            this.submitChanges();
        }

        nameOnChange(e: any) {
            console.log("e: ", e.target.value);
           this.form.playerName = e.target.value;
           this.setState({...this.props.lobby, form: this.form});
            this.submitChanges();
        }

        async submitChanges () {
            let _players = [...this.state.lobby.players];
            _players[this.state.index] = {..._players[this.state.index], ...this.form};
         //   console.log("my state submit playyers: ", _players);
          await  this.setLobby({...this.state.lobby, players: _players});
          //  console.log("lobby after change: ", this.state.lobby, this.props.lobby);
           await  this.setState({lobby: this.props.lobby, player: this.props.player});
           console.log("props and state before emission: ", this.props, this.state);

           let emitState = {player: this.props.player, gameCode: this.state.lobby.gameCode};
            this.props.emitter(emitState);
        }

        render () {
           console.log("clients to compare: ", this.clientPlayer, this.props.player);
            return (
            <div className={"player player-view player-" + this.state.player?.playerNumber + " lobby-player"}>
                {/* <span> name: {this.player?.playerName} </span> */}
                <fieldset disabled={this.clientPlayer !== this.props.player.playerId}>
                    <form className="lobbyForm">
                        <p> edit values: </p>
                        <label>name: </label>
                        <p>{this.form.playerName}</p>
                        <input type="text" value={this.form.playerName} onChange={this.nameOnChange} />
                        <label>game color: </label>
                        <div className="form-colors">
                
                            <button style={{backgroundColor: "red"}} className={this.form.gameColor =='red' ? "lobbycolor-select" : ''} onClick={(e)=> this.selectColor(e, "red")}>Red</button>
                            <button style={{backgroundColor: "blue"}} className={this.form.gameColor =='blue' ? "lobbycolor-select" : ''} onClick={(e)=> this.selectColor(e, "blue")}>Blue</button>
                            <button style={{backgroundColor: "green"}} className={this.form.gameColor =='green' ? "lobbycolor-select" : ''} onClick={(e)=> this.selectColor(e, "green")}>Green</button>
                            <button style={{backgroundColor: "yellow"}} className={this.form.gameColor =='yellow' ? "lobbycolor-select" : ''} onClick={(e)=> this.selectColor(e, "yellow")}>Yellow</button>
                
                        </div>
                    </form>
                </fieldset>
            </div>
            );
        }
}
export default LobbyPlayer;