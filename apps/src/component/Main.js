import React  from 'react'
import {useNavigate} from 'react-router-dom'

 
function Main(arg) {
  const navigate = useNavigate();
  const gogo = ()=>{
    navigate('/result',{ state : {param1 : 1234, param2 : 'abcd' } }) 
  }

  return (
    <div>
      main page
      <div onClick={gogo}>go to result</div>
    </div>
  );
}

export default Main;
