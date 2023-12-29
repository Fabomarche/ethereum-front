import { Route, Routes } from "react-router-dom"
import Auth from "./pages/Auth"
import Home from "./pages/Home"
import './app.css'

function App() {
  return (
    <main className="main">
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<Home />} />
      </Routes>

    </main>
  )
}

export default App
