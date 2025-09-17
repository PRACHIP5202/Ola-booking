import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import InputPage from "./pages/InputPage"
import MapPage from "./pages/MapPage"
import VehiclePage from "./pages/VehiclePage"
import SummaryPage from "./pages/SummaryPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InputPage/>}/>
        <Route path="/map" element={<MapPage/>}/>
        <Route path="/vehicle" element={<VehiclePage/>}/>
        <Route path="/summary" element={<SummaryPage/>}/>
      </Routes>
    </Router>
  )
}

export default App
