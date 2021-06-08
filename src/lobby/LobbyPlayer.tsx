import React from 'react';


interface iLobbyForm {
    gameColor?: string,
    playerName?: string
}
class LobbyPlayer extends React.Component<any> {

    player;
    setLobby;
    lobby;
    index;
    form: iLobbyForm = {playerName: '', gameColor: ''};

    constructor(props: any) {
        super(props);
        this.player = props.player;
        this.setLobby = props.setLobby;
        this.lobby = props.lobby;
        this.index = props.index;

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
            this.submitChanges();
        }

        nameOnChange() {

            this.submitChanges();
        }

        submitChanges () {
            let _players = [...this.lobby.players];
            _players[this.index] = this.form;
            this.setLobby({...this.lobby, players: _players});
        }

        

        // sendForm () {

        // }

        render () {
            return (
            <div className={"player player-view player-" + this.player?.playerNumber}>
                {/* <span> name: {this.player?.playerName} </span> */}
                <form>
                    <p> edit values: </p>
                    <label>name: </label>
                    <p>{this.form.playerName}</p>
                    <input type="text" value={this.form.playerName} onChange={this.nameOnChange}></input>
                    <label>game color: </label>
                    <button background-color="red" onClick={(e)=> this.selectColor(e, "red")}>Red</button>
                    <button background-color="blue" onClick={(e)=> this.selectColor(e, "blue")}>Blue</button>
                    <button background-color="green" onClick={(e)=> this.selectColor(e, "green")}>Green</button>
                    <button background-color="yellow" onClick={(e)=> this.selectColor(e, "yellow")}>Yellow</button>
                </form>
            </div>
            );
        }
}
export default LobbyPlayer;