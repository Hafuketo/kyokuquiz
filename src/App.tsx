import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Filter from './pages/Filter'
import Quiz from './pages/Quiz'
import Wiki from './pages/Wiki'
import Dictionary from './pages/Dictionary'
import Techniques from './pages/Techniques'
import TechniquesGrade from './pages/TechniquesGrade'
import About from './pages/About'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="d-flex flex-column vh-100">
      <main className="flex-grow-1 overflow-auto pb-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz/filter" element={<Filter />} />
          <Route path="/quiz/game" element={<Quiz />} />
          <Route path="/wiki" element={<Wiki />} />
          <Route path="/dictionary" element={<Dictionary />} />
          <Route path="/techniques" element={<Techniques />} />
          <Route path="/techniques/:grade" element={<TechniquesGrade />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
