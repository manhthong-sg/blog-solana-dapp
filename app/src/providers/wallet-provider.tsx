import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
// import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import React, { FC, useMemo } from 'react'

// <WalletModalProvider>
//  <ConnectWalletBtn />
// </WalletModalProvider>
export const WalletProvider: FC = (props: { children?: React.ReactNode }) => {
  const network = WalletAdapterNetwork.Devnet

  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{props.children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  )
}
