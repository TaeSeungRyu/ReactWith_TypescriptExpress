import React, {  useState, useEffect  }   from 'react'
import { useLocation } from "react-router";
import useWebSocket from 'react-use-websocket';

 
function Chatting(arg) {
    let {state : {value, _id}} = useLocation();
     
    const [socketUrl, ] = useState(`ws://localhost:8001/wsocket?id=${_id}`);
    const [messageHistory, setMessageHistory] = useState([]);
    const [message, setMessage] = useState('');
  
    const { sendMessage, lastMessage } = useWebSocket(socketUrl);

    const onMessage = (event)=>{
        setMessage(event.target.value)
    }
  
    const sendMsg = ()=>{
		let msg = {  //전송 규격
			_room_id : value._room_id,
			_id : _id,
			send : 'send',
			message:message
		}	        
        sendMessage(JSON.stringify(msg))
    }
  

   useEffect(() => {
      if (lastMessage !== null) {
        setMessageHistory((prev) => prev.concat(lastMessage));
      }
    }, [lastMessage, setMessageHistory]);


    useEffect(()=>{
        let join = {  //전송 규격
            _room_id : value._room_id,
            password : value.password,
            _id : _id,
            join : 'join'
        }
        sendMessage(JSON.stringify(join))
    },[value, _id, sendMessage])

    return (
        <div className='container'>
            chatting
            <input type='text' onChange={onMessage} value={message}  />
            <button onClick={sendMsg}>send test</button>

            <div>
                <div>
                    {lastMessage ? <span>최근 메시지: {lastMessage.data}</span> : null}
                </div>
                <div>전체 메시지</div>
                <ul>
                    {messageHistory.map((message, idx) => (
                    <span key={idx}>{message ? message.data : null}</span>
                    ))}
                </ul>                
            </div>
        </div>
    );
}

export default Chatting;
