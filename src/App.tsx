import Navbar from './components/navbar'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Container from './components/utils/Container';
import HomePage from './pages/home';
import StakePage from './pages/stake';
import ProposalPage from './pages/proposals';
import GameHistoryPage from './pages/game-history';
import VotingPage from './pages/proposals/votingPage';
import MyGames from './pages/my-games';



function App() {

  return (
    <div className='root h-screen '>

      <BrowserRouter>

        <Navbar/>

        <div className='h-20'></div>

        <Container>

          <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/stake' element={<StakePage />}/>
            <Route path='/my-games' element={<MyGames /> } />
            <Route path='/proposals' element={<ProposalPage />}/>
            <Route path='/proposals/:id' element={<VotingPage />}/>
            <Route path='/game-history' element={<GameHistoryPage />}/>
            <Route path='/game/:id' element={<HomePage/>}/>
          </Routes>

        </Container>
        
      </BrowserRouter>

    </div>
  )
}

export default App
