import React from 'react';
import { iLobby } from '../GameLobby';
import {iLobbyForm} from '../interfaces/index';


  
  interface LobbyPLayerState {
    player: any,
    setLobby: any,
    lobby: iLobby,
    index: number,
    form: any
  }


class LobbyPlayer extends React.Component<any> {

    form: iLobbyForm = {playerName: '', gameColor: ''};
    state: any;
    setLobby: any;
    clientPlayer: any;

    constructor(props: any) {
        super(props);

        this.setLobby = this.props.setLobby;
        this.clientPlayer = this.props.clientPlayerId;
        this.form = {
            gameColor: this.props.player.gameColor, 
            playerName: this.props.player.playerName
        };

        let _state: LobbyPLayerState = {
            player: props.player,
            setLobby: props.setLobby,
            lobby: props.lobby,
            index:  props.index,
            form: this.form
        }

       this.state = _state;
        this.nameOnChange = this.nameOnChange.bind(this);
    }
     

        selectColor (e: any, color: any) {
            e.preventDefault();

            this.form.gameColor = color;
            this.setState({...this.props.lobby, form: this.form});
            this.submitChanges();
        }

        nameOnChange(e: any) {
           this.form.playerName = e.target.value;
           this.setState({...this.props.lobby, form: this.form});
            this.submitChanges();
        }

        async submitChanges () {
            let _players = [...this.state.lobby.players];

            _players[this.state.index] = {..._players[this.state.index], ...this.form};

            await  this.setLobby({...this.state.lobby, players: _players});

            await  this.setState({lobby: this.props.lobby, player: this.props.player});

            let emitState = {player: this.props.player, gameCode: this.state.lobby.gameCode};

            this.props.emitter(emitState);
        }

        render () {

           let nonPlayable = this.clientPlayer !== this.props.player.playerId;
            console.log("client & props player: ", this.clientPlayer, this.props.player)
           this.form.gameColor = nonPlayable ? this.props.player.gameColor : this.form.gameColor;

            return (
            <div className={"player player-view player-" + this.state.player?.playerNumber + " lobby-player"}>
                <fieldset disabled={nonPlayable}>
                    <form className="lobbyForm">
                        <p> edit values: </p>
                        <label>name: </label>
                        <p>{this.form.playerName}</p>
                        <input type="text" value={nonPlayable ? this.props.player.playerName : this.form.playerName} onChange={this.nameOnChange} />
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