import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Filter from './pages/Filter'
import Quiz from './pages/Quiz'
import Wiki from './pages/Wiki'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="d-flex flex-column vh-100">
      <main className="flex-grow-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/filter" element={<Filter />} />
          <Route path="/game/quiz" element={<Quiz />} />
          <Route path="/wiki" element={<Wiki />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
