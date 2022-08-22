import {
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
// import { getPhantomWallet } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { FC } from "react";
import { BlogProvider } from "src/context/Blog";
import { Router } from "src/router";

// const wallets = [getPhantomWallet()];
const endPoint = clusterApiUrl("devnet");
// // const localnetEndpoint = "http://localhost:8899"


import './index.css'

// import { MantineProvider } from '@mantine/core'
// import { NotificationsProvider } from '@mantine/notifications'
// import { Lang } from 'i18n'
// import { LanguageProvider } from 'providers'
import React from 'react'
import ReactDOM from 'react-dom'
// import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'

import { AuthProvider, WalletProvider } from './providers'
// import reportWebVitals from './reportWebVitals'
// import theme from './theme'

// const queryClient = new QueryClient()

export const App: FC = () => {
  return (
    <ConnectionProvider endpoint={endPoint}>
      <WalletProvider>
        <BlogProvider>
          <Router />
        </BlogProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
