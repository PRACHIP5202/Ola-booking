import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import InputPage from "./pages/InputPage"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InputPage/>}/>
        <Route path="/map" element={<h2>Map page</h2>}/>
      </Routes>
    </Router>
  )
}

export default App
