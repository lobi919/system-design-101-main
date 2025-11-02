import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Category from './pages/Category'
import Guide from './pages/Guide'
import Search from './pages/Search'
import Bookmarks from './pages/Bookmarks'
import { PreferencesProvider } from './context/PreferencesContext'
import { ProgressProvider } from './context/ProgressContext'

export default function App() {
  return (
    <PreferencesProvider>
      <ProgressProvider>
        <div className="app" data-age="12+">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:id" element={<Category />} />
            <Route path="/guide/:id" element={<Guide />} />
            <Route path="/search" element={<Search />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
          </Routes>
          <div className="sr" aria-live="polite" aria-atomic="true" />
        </div>
      </ProgressProvider>
    </PreferencesProvider>
  )}
