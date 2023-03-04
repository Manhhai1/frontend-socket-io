import React, { useEffect, useState } from 'react';
import onlineIcon from '../src/assets/images/circle.svg'
import './Chat.css'
function Chat({ username, room, socket }) {
    const [message, setMessage] = useState('')
    const [data, setData] = useState({})
    const [messageArr, setMessageArr] = useState([])
    let sendMessage = async () => {
        if (message) {
            let data = { room, author: username, message: message, time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes() }
            let copyMsgs = [...messageArr, data]
            console.log(copyMsgs)
            setMessageArr(copyMsgs)
            await socket.emit('send_message', data)
            setMessage('')
        }
    }
    useEffect(() => {
        socket.on('receive_message', (data) => {
            let copyMsgs = [...messageArr, data]
            setMessageArr(copyMsgs)
            //setData(data)
        })
        const handleKeyDown = ({ key }) => {
            if (key === "Enter") {
                sendMessage()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        //clean up after component unmounted
        return () => window.removeEventListener('keydown', handleKeyDown)

    })
    let handleOnchangeMessage = (e) => {
        setMessage(e.target.value)

    }
    return (
        <div className='chat-container'>
            <div className="header"><span className='header-chat'>Live Chat</span></div>
            <div className="body-chat">
                {
                    messageArr.length > 0 && messageArr.map((item, index) => {
                        if (item) {
                            return item.author === username ? (<div id="you-chat" key={index}><span style={{ float: 'left', marginTop: '10px', marginLeft: '10px', background: "#54B435", padding: '8px', borderRadius: '15px', color: 'white', fontSize: '0.9em' }}>{item.message}
                            </span>
                                <p className='time'>{item.time} <b>{item.author}</b></p>
                            </div>
                                
                            ) :
                                (<div id="other-chat" key={index}><span style={{ float: 'right', marginTop: '10px', marginRight:'10px', background: '#3E54AC', padding: '8px', borderRadius: '15px', color: 'white', fontSize: '0.9em' }} >{item.message} </span>
                                    <p className='time-other'><span>{item.time} <b>{item.author}</b></span></p></div>)
                        }
                     
                    })
                    
                }

            </div>
            <div className="footer-chat">
                <input type="text" id='message' className='input form-control' placeholder='Message...' value={message} onChange={(e) => handleOnchangeMessage(e)} />
                <button onClick={()=>sendMessage()} id='btn-footer' className='btn-footer'>Send</button>
            </div>

        </div>
    );
}

export default Chat;