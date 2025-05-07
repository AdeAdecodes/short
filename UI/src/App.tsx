import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import List from './pages/List'
import Stats from './pages/Stats'
import RedirectHandler from './pages/RedirectHandler'
import ApiDocs from './pages/ApiDocs'
import axios from 'axios'

function App() {
  useEffect(() => {
    axios.get('https://short-af4u.onrender.com')
      .then(() => console.log('✅ Backend woken up'))
      .catch((err) => console.error('❌ Backend wake-up failed:', err))
  }, [])

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list" element={<List />} />
        <Route path="/stats/:urlPath" element={<Stats />} />
        <Route path="/:urlPath" element={<RedirectHandler />} />
        <Route path="/api-docs" element={<ApiDocs />} />
      </Routes>
    </>
  )
}

export default App
