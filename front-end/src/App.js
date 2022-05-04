import { Routes, Route } from 'react-router-dom'

import Login from './pages/Login'
import Employee from './pages/Employee'
function App() {

  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/employee' element = {<Employee />}/>
    </Routes>
  );
}

export default App;
