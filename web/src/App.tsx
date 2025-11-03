import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Guide from './pages/Guide'
import Search from './pages/Search'
import Bookmarks from './pages/Bookmarks'
import { ProgressProvider } from './context/ProgressContext'

function App() {
  return (
    <ProgressProvider>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/guide/:id" element={<Guide />} />
          <Route path="/search" element={<Search />} />
          <Route path="/category/:id" element={<Search />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
        </Routes>
      </div>
    </ProgressProvider>
  )
}

export default App
