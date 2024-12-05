import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import background from '../assets/background.png';

interface LocationState {
  winner: { name: string; score: number };
  selectedBeast: string | null;
  betAmount: string;
  gameId: number;
}

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { winner, selectedBeast, betAmount, gameId } = location.state as LocationState;

  const [isWinner, setIsWinner] = useState(false);
  const [winningAmount, setWinningAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [players, setPlayers] = useState<{ address: string; amount: string; beast: string }[]>([]);

  useEffect(() => {
    const handleGameEnd = async () => {
      try {
        // Simulate game end process
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsWinner(selectedBeast === winner.name);
        if (selectedBeast === winner.name) {
          setWinningAmount(parseFloat(betAmount) * 2);
        }
      } catch (error) {
        console.error("Error handling game end:", error);
      } finally {
        setIsLoading(false);
      }
    };

    handleGameEnd();
  }, [winner.name, selectedBeast, betAmount]);

  useEffect(() => {
    // Dummy data for players
    const dummyPlayers = [
      { address: '0x1234...5678', amount: '0.1', beast: 'Inferno Dragon' },
      { address: '0xabcd...efgh', amount: '0.2', beast: 'Frost Wolf' },
      { address: '0x9876...5432', amount: '0.15', beast: 'Thunder Falcon' },
      { address: '0x1111...2222', amount: betAmount, beast: selectedBeast || '' },
    ];
    setPlayers(dummyPlayers);
  }, [betAmount, selectedBeast]);

  if (isLoading) {
    return <div className="text-center text-white text-2xl mt-10">Processing results...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-gray-800 bg-opacity-90 rounded-lg shadow-lg p-8 text-center"
      >
        <h1 className="text-4xl font-bold mb-6 text-purple-300">Battle Results</h1>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 500, damping: 30 }}
          className="mb-8"
        >
          <p className="text-2xl mb-4 text-gray-300">Winning Beast: <span className="text-yellow-400 font-bold">{winner.name}</span></p>
          <p className="text-xl mb-4 text-gray-300">Winning Score: <span className="text-green-400 font-bold">{winner.score.toFixed(2)}</span></p>
        </motion.div>
        {selectedBeast && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mb-8"
          >
            <p className="text-xl mb-2 text-gray-300">Your Beast: <span className="text-blue-400 font-bold">{selectedBeast}</span></p>
            <p className="text-xl mb-2 text-gray-300">Your Bet: <span className="text-blue-400 font-bold">{betAmount} ETH</span></p>
          </motion.div>
        )}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, type: 'spring', stiffness: 500, damping: 30 }}
          className={`text-5xl font-bold mb-8 ${isWinner ? 'text-green-400' : 'text-red-400'}`}
        >
          {isWinner ? (
            <>
              <span className="block mb-2">You Won!</span>
              <span className="text-yellow-400">{winningAmount.toFixed(2)} ETH</span>
            </>
          ) : (
            <span>Better luck next time!</span>
          )}
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-8 bg-gray-800 bg-opacity-50 rounded-lg p-4"
        >
          <h2 className="text-2xl font-bold mb-4 text-purple-300">Leaderboard</h2>
          <div className="space-y-2">
            {players.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount)).map((player, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-300">
                  {player.address}
                </span>
                <span className="text-purple-400">{player.beast}</span>
                <span className={`font-bold ${player.beast === winner.name ? 'text-green-400' : 'text-red-400'}`}>
                  {player.amount} ETH
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/home')}
          className="px-8 py-4 bg-purple-600 text-white rounded-full font-semibold text-lg transition duration-300 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
        >
          Back to Home
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ResultsPage;

