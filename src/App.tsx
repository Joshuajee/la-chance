import Navbar from './components/navbar'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Container from './components/utils/Container';
import HomePage from './pages/home';
import StakePage from './pages/stake';
import ProposalPage from './pages/proposals';
import GameHistoryPage from './pages/game-history';
import MyGames from './pages/my-games';
import GetTestToken from './pages/get-tokens';
import Lending from './pages/lending';
import ScrollToTop from './ScrollToTop';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { useEffect, useState } from 'react';
import { avalancheFuji } from 'wagmi/chains';
import { DEFAULT_CHAIN_ID } from './libs/constants';
import { networkNameByChainId } from './libs/utils';
import CreateProposal from './pages/proposals/create-proposal';



function App() {


  const [isWrongNet, setIsWrongNet] = useState(false);
  const { chain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()

  useEffect(() => {
    if (chain?.id && (chain.id != DEFAULT_CHAIN_ID)) {
      setIsWrongNet(true)
    } else {
      setIsWrongNet(false)
    }
  }, [chain?.id]);


  return (
    <BrowserRouter>

      <Navbar/>

      <div className='h-20'></div>

      {
        (chain?.id && isWrongNet) &&
          <div className='fixed top-14 bg-orange-400 w-full z-10 text-center px-4 py-2'>
            You are connected to 
            <strong> {networkNameByChainId(chain?.id)} </strong> 
            network please switch to  
            <button onClick={() => switchNetwork?.(DEFAULT_CHAIN_ID)} className='ml-2 underline font-bold'> {avalancheFuji.name} </button>
          </div>
      }

      <Container>

        <Routes>
          <Route path='/' element={<HomePage/>}/>
          <Route path='/stake' element={<StakePage />}/>
          <Route path='/my-games' element={<MyGames /> } />
          <Route path='/get-tokens' element={<GetTestToken /> } />
          <Route path='/proposals' element={<ProposalPage />}/>
          <Route path='/proposals/create' element={<CreateProposal />}/>
          <Route path='/game-history' element={<GameHistoryPage />}/>
          <Route path='/game/:id' element={<HomePage/>}/>
          <Route path='/lending' element={<Lending />}/>
        </Routes>

        <ScrollToTop />

      </Container>
      
    </BrowserRouter>
  )
}

export default App
