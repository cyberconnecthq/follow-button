import { useState } from 'react';
import './App.css';
import Web3 from 'web3';
import {
  FollowButton,
  Env,
  Blockchain,
} from '@cyberconnect/react-follow-button';

function App() {
  const [account, setAccount] = useState<string>('');
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      console.error('MetaMask is installed!');
    }
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    setAccount(accounts[0]);
    setIsWalletConnected(true);
  };

  return (
    <div className="App">
      {isWalletConnected ? (
        <div className="demo">
          <div className="address">
            <b>Account:</b> {account}
          </div>
          <FollowButton
            key="0xe6aab1f16ff560d309ed7ce8e08d290306a0906c"
            provider={Web3.givenProvider}
            namespace="CyberConnect"
            toAddr="0xe6aab1f16ff560d309ed7ce8e08d290306a0906c"
            env={Env.PRODUCTION}
            chain={Blockchain.ETH}
            onSuccess={(e) => {
              console.log(e);
            }}
            onFailure={(e) => {
              console.log(e);
            }}
          />
        </div>
      ) : (
        <button className="connect-button" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default App;
