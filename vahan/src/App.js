import react, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes as Switch } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar'
import AddEntity from './pages/AddEntity'
import InsertData from './pages/InsertData';
import ReadData from './pages/ReadData';
import UpdateData from './pages/UpdateData';
import FTUE from './components/FTUE';
import Dashboard from './components/Dashboard';

function App() {
  const [showIntro, setShowIntro] = useState(true);

  if(!sessionStorage.getItem("time"))
    sessionStorage.setItem("time", "4000");

  let t = +sessionStorage.getItem("time");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
      sessionStorage.setItem("time", 0)
    }, t);

    return () => clearTimeout(timer);
  }, []);
  // return (
  //   <Router>
  //   {showIntro? '':<Navbar/>}
  //       <Switch>
  //         <Route path="/" exact element={showIntro ? <FTUE /> : <Home />}></Route>
  //         <Route path="/createEntity" element={<AddEntity/>}/>
  //         <Route path='/insertData/:entityName' element={<InsertData/>}></Route>
  //         <Route path='/readData/:entityName/' element={<ReadData/>}></Route>
  //         <Route path='/updateData/:entityName/:id' element={<UpdateData/>}></Route>
  //       </Switch>
  //   </Router> 
  // );
  return (
    <Router>
      <Switch>
        <Route path="/" exact element={showIntro ? <FTUE /> : <Dashboard />}>
          <Route path="/" element={<Home />} />
          <Route path="/createEntity" element={<AddEntity />} />
          <Route path='/insertData/:entityName' element={<InsertData />}></Route>
          <Route path='/readData/:entityName/' element={<ReadData />}></Route>
          <Route path='/updateData/:entityName/:id' element={<UpdateData />}></Route>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
