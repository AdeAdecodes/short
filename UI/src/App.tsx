import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import List from './pages/List'
import Stats from './pages/Stats'
import RedirectHandler from './pages/RedirectHandler'
import ApiDocs from './pages/ApiDocs'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/list" element={<List />} />
      <Route path="/stats/:urlPath" element={<Stats />} />
      <Route path="/:urlPath" element={<RedirectHandler />} />
      <Route path="/api-docs" element={<ApiDocs />} />
    </Routes>
  )
}

export default App
