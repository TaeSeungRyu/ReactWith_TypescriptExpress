import React, { useState }   from 'react'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
 
function Main(arg) {
  const navigate = useNavigate();
  const [ id, setId ] = useState("") 
  const [ pwd, setPassword ] = useState("") 

  const onId = ({target: {name, value}})=> setId(value);
  const setPwd = ({target: {name, value}})=> setPassword(value);


  const gogo = ()=>{
    //navigate('/result',{ state : {param1 : 1234, param2 : 'abcd' } }) 
    console.log({id, password:pwd})
    
    axios.post('data/joinOrLogIn',{id, password:pwd}).then(arg=>{
      console.log(arg)
    })
  }

  return (
    <div>
      main page

      <div>
        <span>id</span> : <input type='text' onChange={onId} value={id} />
      </div>
      <div>
        <span>pwd</span> : <input type='text' onChange={setPwd} value={pwd} />
      </div>      
      <div onClick={gogo}>go to result</div>
    </div>
  );
}

export default Main;
