import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import kingImage from '../images/King.png';
import mantriImage from '../images/Mantri.png';
import chorImage from '../images/chor.png';
import sipahiImage from '../images/Sipahi.png';
import main from '../images/main.png'
import './Game.css'
const apiKey = process.env.REACT_APP_API_URL;
const socket = io(apiKey);



const Game = () => {
    const [players, setPlayers] = useState([]);
    const [myRole, setMyRole] = useState('');
    const [scores, setScores] = useState({});
    const [gameStarted, setGameStarted] = useState(false);
    const [guessResult, setGuessResult] = useState(null);
    const [playerName, setPlayerName] = useState('');
    const [joined, setJoined] = useState(false);
    const [isRaja, setIsRaja] = useState(false);
    const [showNextRoundButton, setShowNextRoundButton] = useState(false);
    const [isHost, setIsHost] = useState(false);
    const [showNewGameButton, setShowNewGameButton] = useState(false);
    const [countdown, setCountdown] = useState(15); // Countdown timer state
    const [allow ,SetAllow]= useState(false);

   
    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server:', socket.id);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        socket.on('updatePlayers', (playerList) => {
            console.log('Updated Players List:', playerList);
            setPlayers(playerList);
        });

        // Listen for role assignments
        socket.on('rolesAssigned', (role, isRaja) => {
            console.log('Your role:', role);
            setMyRole(role);
            setIsRaja(isRaja);
            const roleMessage = isRaja ? `You are the Raja!` : `Your role is: ${role}`;
            alert(roleMessage);
        });

        socket.on('gameStarted', (started) => {
            setGameStarted(started);
            if (started) {
                console.log('The game has started!');
                SetAllow(true);
                setCountdown(25); // Reset countdown when the game starts
            } else {
                console.log('The game has ended.');
            }
        });

        socket.on('guessResult', (result) => {
            setGuessResult(result);
        });

        socket.on('updateScores', (updatedScores) => {
            console.log('Updated Scores:', updatedScores);
            setScores(updatedScores);
        });

        socket.on('gameOver', (message) => {
            alert(message);
            setShowNewGameButton(true);
        });

        socket.on('showNextRoundButton', (show) => {
            setShowNextRoundButton(show);
        });

        socket.on('isHost', (isHostPlayer) => {
            setIsHost(isHostPlayer);
        });

        // Listen for countdown updates from server
        socket.on('countdown', (timeLeft) => {
            setCountdown(timeLeft);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('updatePlayers');
            socket.off('rolesAssigned');
            socket.off('gameStarted');
            socket.off('guessResult');
            socket.off('updateScores');
            socket.off('gameOver');
            socket.off('showNextRoundButton');
            socket.off('isHost');
            socket.off('countdown'); // Cleanup countdown listener
        };
    }, []);

    useEffect(() => {
        // Timer logic to decrement countdown
        let timer;
        if (countdown > 0 && gameStarted) {
            timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        }

        // Clear timer on unmount or when countdown reaches zero
        return () => clearInterval(timer);
    }, [countdown, gameStarted]);

    const handleJoinGame = () => {
        if (!playerName.trim()) {
            alert('Please enter a valid name');
            return;
        }
        socket.emit('joinGame', playerName);
        setJoined(true);
    };

    const handleGuess = (guess) => {
        socket.emit('makeGuess', { guess });
    };

    const handleNextRound = () => {
        socket.emit('nextRound');
        setShowNextRoundButton(false);
        setCountdown(45); // Reset countdown for next round
    };

    const handleNewGame = () => {
        socket.emit('newGame');
        setShowNewGameButton(false);
        setGuessResult(null);
        setScores({});
        setPlayers([]);
        setCountdown(15); // Reset countdown for a new game
    };
    const roleBackgrounds = {
        Raja: kingImage,
        Chor: chorImage,
        Sipahi: sipahiImage ,
        Mantri:  mantriImage ,
    };

    const backgroundImage = roleBackgrounds[myRole] || main;
       
      
    return (
        <div
            className="container text-center img-fluid"
            style={{ backgroundImage: `url(${backgroundImage})`, width:'100%'  }}
        >
            <div className="-3 mb-2 inner text-dark" >
        <h1 className="my-4 text-primary">Chor, Sipahi, Raja, Mantri Game</h1>
        {!joined ? (
            <div className='.bg-info.bg-gradient'>
                <input 
                    type="text"
                    className="form-control mb-3"
                    placeholder="Enter your name"
                    disabled={allow}
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                />
                <button className="btn btn-success" disabled={allow} onClick={handleJoinGame}>Join Game</button>
            </div>
        ) : (
            <div className="row ">
                <div className="col-md-6">
                    <h2>Players:</h2>
                    <ul className="list-group mb-4">
                        {players.map((player, index) => (
                            <li className="list-group-item" key={index}>
                                {player} - {player === playerName ? myRole : 'Role Hidden'}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col-md-6">
                    <h2>Scores:</h2>
                    <ul className="list-group mb-4 ">
                        {Object.keys(scores).map((player, index) => (
                            <li className="list-group-item" key={index}>
                                {player}: {scores[player]}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )}
        {isRaja && (
            <div>
                <h2>Guess the Chor:</h2>
                {players.map((player, index) => (
                    player !== playerName && (
                        <button key={index} className="btn btn-warning mx-2" onClick={() => handleGuess(player)}>
                            {player}
                        </button>
                    )
                ))}
            </div>
        )}
        {guessResult && <h3 className="mt-3">{guessResult}</h3>}
        <h2>Time Left: <span className="text-danger">{countdown} seconds</span></h2>
        {showNextRoundButton && isHost && (
            <button className="btn btn-info my-3" onClick={handleNextRound}>Next Round</button>
        )}
        {showNewGameButton && isHost && (
            <button className="btn btn-danger my-3" onClick={handleNewGame}>New Game</button>
        )}
        </div>
    </div>
);

    
};

export default Game;
