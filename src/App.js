import { useEffect, useState } from 'react'
import './App.css';
import io from 'socket.io-client'
import Chat from './Chat';
import { URL_BACKEND } from './constant';



const socket = io.connect('https://backend-real-chat.onrender.com')
function App() {
  const [username, setUsername] = useState('')
  const [room, setRoom] = useState('')
  const [chat, setChat] = useState(false)
  let check = () => {
    if (username === '') {
      document.getElementById('label-name').style.display = 'block'
      document.getElementById('label-name').style.color = 'red'
    }
    else {
      document.getElementById('label-name').style.display = 'none'
    }
    if (room === '') {
      document.getElementById('label-room').style.display = 'block'
      document.getElementById('label-room').style.color = 'red'
    }
    else {
      document.getElementById('label-room').style.display = 'none'
    }
  }
  let joinRoom = () => {
    check()
    if (username !== '' && room !== '') {
      socket.emit('join_room', room)
      setChat(true)
    }
  }
  useEffect(() => {
    let handleKeydown = ({ key }) => {
      if (key === "Enter") joinRoom()

    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  })
  return (
    <div className="App">
      {
        chat === true ? (<Chat room={room} socket={socket} username={username}></Chat>) : (<div className="chat-room">
          <div className="header-room">Chat App</div>
          <input type="text" id='name' width={'300px'} height={'50px'} className='input form-control' placeholder='Join with your Name ...' value={username} onChange={(e) => setUsername(e.target.value)} />
          <label for="" id='label-name' style={{ display: 'none' }}>Join Name is invalid</label>
          <input type="text" className='input form-control' placeholder='Room ID...' value={room} onChange={(e) => setRoom(e.target.value)} />
          <label for="" id='label-room' style={{ display: 'none' }}>Room ID is invalid</label>
          <button type="button" className="btn button-63" onClick={() => joinRoom()}>Join a Room</button>

        </div>)
      }
    </div>
  );
}

export default App;
