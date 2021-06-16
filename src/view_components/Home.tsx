
import React from 'react';

export function Home() {
    return (
        <div className="home-container">
            <div className="home-headline">
                Oofda!
            </div>
            <div className="home-subtitle">
                An online board game for up to 4 players.
            </div>
            <div className="home-button-box">
                <button className="home-nav-button">
                    <a href="/gameLobby">
                        Start New Game
                    </a> 
                </button>
                <button className="home-nav-button">
                    Join Existing
                </button>
            </div>
        </div>
    )
}