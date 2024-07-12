
import { useEffect, useState } from 'react';
import { BrowserRouter,Route,Routes,Link } from 'react-router-dom';


import App1 from './Api';

import Home from './Components/Home';

function App() {
  const [active,setActive]=useState(1);
  
  return (
   
    <div className="App">
   {/* <nav>
<ul>
<li>
    <Link to="/">Home</Link>
</li>
</ul>
</nav> */}
   <div id="page-body">
<Home></Home>
   </div>
   </div>
  

/* <div className='App'>
<Home></Home>
</div> */

  );
}


export default App;