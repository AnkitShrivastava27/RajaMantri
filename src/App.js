// import React, { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';

// const socket = io('http://localhost:3001', {
//   transports: ['websocket', 'polling'], // Allow WebSocket and polling
// });

// const App = () => {
//   const [roomId, setRoomId] = useState('');  // Room ID
//   const [username, setUsername] = useState('');  // Username for each player
//   const [players, setPlayers] = useState([]);  // List of players in the room
//   const [roomCreatedMessage, setRoomCreatedMessage] = useState('');  // Message after room creation

//   useEffect(() => {
//     // Listen for room creation
//     socket.on('roomCreated', (roomId) => {
//       setRoomCreatedMessage(`Room ${roomId} created successfully!`);
//     });

//     // Listen for players joining the room
//     socket.on('playerJoined', (playerList) => {
//       setPlayers(playerList);
//     });

//     // Clean up on unmount
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   // Create a room
//   const createRoom = () => {
//     const newRoomId = 'room1'; // A unique room ID
//     socket.emit('createRoom', { roomId: newRoomId, username });
//     setRoomId(newRoomId);
//   };

//   // Join a room
//   const joinRoom = () => {
//     if (roomId && username) {
//       socket.emit('joinRoom', { roomId, username });
//     }
//   };

//   return (
//     <div>
//       <h1>Game Room</h1>

//       {/* Input for username */}
//       <input
//         type="text"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//         placeholder="Enter your name"
//       />

//       {/* Button to create a room */}
//       <button onClick={createRoom}>Create Room</button>

//       {/* Input for room ID */}
//       <input
//         type="text"
//         value={roomId}
//         onChange={(e) => setRoomId(e.target.value)}
//         placeholder="Enter Room ID"
//       />

//       {/* Button to join a room */}
//       <button onClick={joinRoom}>Join Room</button>

//       {/* Display room creation success message */}
//       {roomCreatedMessage && <p>{roomCreatedMessage}</p>}

//       <h2>Players in Room:</h2>

//       {/* List of players */}
//       <ul>
//         {players.map((player, index) => (
//           <li key={index}>{player.username}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default App;
// src/App.js



// import React from 'react';
// import PlayerForm from './Components/PlayerForm';

// function App() {
//     return (
//         <div className="App">
//             <h1>Chor, Sipahi, Raja, Mantri Game</h1>
//             <PlayerForm />
//         </div>
//     );
// }

// export default App;
import 'bootstrap/dist/css/bootstrap.min.css';
import bgm from './images/bgm.png'

import React from 'react';
import Game from './Components/Game';
//style={{ backgroundImage: `url(${bgm})`}}

function App() {
    return (
        <div className="App " >
            <Game/>
        </div>
    );
}

export default App;
