import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { publicProvider } from 'wagmi/providers/public'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { avalancheFuji, hardhat  } from 'wagmi/chains'
// import AOS from 'aos';
// import 'aos/dist/aos.css';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { RPC_URL } from './libs/constants.ts'

// AOS.init()

const { publicClient, webSocketPublicClient } = configureChains(
  [avalancheFuji, hardhat],
  [
    jsonRpcProvider({
      rpc: () => {
        return {
          http: RPC_URL,
          webSocket:  undefined
        } 
      }
    }),
    publicProvider()
  ],
)

console.log(RPC_URL)
 
const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <App />
      <ToastContainer autoClose={3000} hideProgressBar={true}  />
    </WagmiConfig>
  </React.StrictMode>,
)
