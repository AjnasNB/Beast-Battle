import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import background from '../assets/background.png';

declare global {
  interface Window {
    ethereum?: import('ethers').providers.ExternalProvider;
  }
}

interface LoginPageProps {
  setAccount: (account: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ setAccount }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        navigate('/home');
      } else {
        alert('Please install MetaMask to use this app');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask', error);
      alert('Failed to connect to MetaMask');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${background})` }}>
      <div className="w-full max-w-4xl bg-gray-900 bg-opacity-90 p-8 rounded-lg shadow-2xl">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold mb-6 text-purple-300">Beast Battle Bet</h1>
          <p className="mb-6 text-xl text-gray-300">Enter the arena and bet on mythical beasts!</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">How to Play</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>Connect your wallet to enter the game</li>
              <li>Choose a beast to bet on</li>
              <li>Place your bet in ETH</li>
              <li>Watch the battle unfold in real-time</li>
              <li>If your beast wins, claim your rewards!</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-purple-300">Game Features</h2>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>8 unique mythical beasts with different abilities</li>
              <li>Dynamic battle arenas that affect beast performance</li>
              <li>Real-time betting and battle simulation</li>
              <li>Leaderboard to track top players</li>
              <li>Secure smart contract for fair gameplay and payouts</li>
            </ul>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-purple-300">How to Pay</h2>
          <p className="text-gray-300 mb-4">
            Beast Battle Bet uses Ethereum (ETH) for all transactions. Make sure you have ETH in your wallet before placing a bet.
          </p>
          <ol className="list-decimal list-inside text-gray-300 space-y-2">
            <li>Connect your Ethereum wallet (e.g., MetaMask)</li>
            <li>Choose the amount of ETH you want to bet</li>
            <li>Confirm the transaction in your wallet</li>
            <li>Wait for the transaction to be processed on the Ethereum network</li>
            <li>Your bet will be placed once the transaction is confirmed</li>
          </ol>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={connectWallet}
          disabled={isLoading}
          className="w-full px-6 py-3 bg-purple-600 text-white rounded-full font-semibold text-lg transition duration-300 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50"
        >
          {isLoading ? 'Connecting...' : 'Connect Wallet to Enter'}
        </motion.button>
      </div>
    </div>
  );
};

export default LoginPage;

