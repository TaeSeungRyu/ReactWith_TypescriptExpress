import React  from 'react'
import { useLocation } from "react-router";

function Result() {
  let param = useLocation();
  console.log(param) 
  return (
    <div>
      Result page
    </div>
  );
}

export default Result;
