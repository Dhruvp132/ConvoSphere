import './App.css'
import {BrowserRouter, Route, Routes } from 'react-router-dom'
import { RoomLanding } from './screen/RoomLanding'
import LandingPage from './screen/Landing'
// import { Room } from './components/Room'

function App() {
  return (

    <BrowserRouter>
    <Routes> 
      <Route path="/room" element={<RoomLanding />} />
      <Route path="/" element={<LandingPage />} />
      {/* <Route path="/room" element={<Room />} /> */}
      </Routes>  
    </BrowserRouter>

  )
}

export default App
