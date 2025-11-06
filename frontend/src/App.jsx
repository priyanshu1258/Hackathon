import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Electricity from './pages/Electricity'
import Water from './pages/Water'
import FoodWaste from './pages/FoodWaste'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/electricity" element={<Electricity />} />
            <Route path="/water" element={<Water />} />
            <Route path="/food-waste" element={<FoodWaste />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
