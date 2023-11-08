import Navbar from './components/navbar'
import { BrowserRouter as Router } from "react-router-dom";


function App() {

  return (
    <Router>
      <div className='bg-gray-900 h-screen root'>
        <Navbar />
      </div>
    </Router>
  )
}

export default App
