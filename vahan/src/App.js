import react from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes as Switch } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './components/Navbar'
import AddEntity from './components/AddEntity'
import InsertData from './components/InsertData';
import ReadData from './components/ReadData';
function App() {
  return (
    <Router>
    <Navbar/>
        <Switch>
          <Route path="/" element={<Home/>} />
          <Route path="/createEntity" element={<AddEntity/>}/>
          <Route path='/insertData/:entityName' element={<InsertData/>}></Route>
          <Route path='/readData/:entityName' element={<ReadData/>}></Route>
          <Route path='/updateData/:entityName' element={<ReadData/>}></Route>
        </Switch>
    </Router> 
  );
}

export default App;
