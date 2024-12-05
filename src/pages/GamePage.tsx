import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Import images
import infernoDragon from '../assets/inferno dragon.png';
import frostWolf from '../assets/frost wolf.png';
import thunderFalcon from '../assets/thunder-falcon.png';
import shadowPanther from '../assets/shadow-panther.png';
import blazingTiger from '../assets/Blazing tiger.png';
import celestialLeviathan from '../assets/Celestial Leviathan.png';
import eclipseLion from '../assets/Eclipse Lion.png';
import stormWyvern from '../assets/storm-wyvern.png';

import lavaPit from '../assets/lava-pit.png';
import frostedTundra from '../assets/frosted tundra.png';
import thunderCity from '../assets/Thunder-city.png';
import mysticForest from '../assets/Mystic-shadow-forest.png';
import infernoPlateauImg from '../assets/Infernou platue.webp';
import etherealExpanse from '../assets/Ethereal Expanse.png';
import solarZenith from '../assets/solar-zenith.png';
import tempestSummit from '../assets/tempest-summit.png';

interface Beast {
  name: string;
  power: number;
  speed: number;
  agility: number;
  stamina: number;
  image: string;
}

interface Arena {
  name: string;
  focus: 'Power' | 'Speed' | 'Agility' | 'Stamina';
  image: string;
}

interface Player {
  address: string;
  beast: string;
  amount: string;
}

const beasts: Beast[] = [
  { name: "Inferno Dragon", power: 10, speed: 5, agility: 3, stamina: 2, image: infernoDragon },
  { name: "Frost Wolf", power: 4, speed: 7, agility: 6, stamina: 3, image: frostWolf },
  { name: "Thunder Falcon", power: 3, speed: 10, agility: 7, stamina: 1, image: thunderFalcon },
  { name: "Shadow Panther", power: 5, speed: 8, agility: 10, stamina: 2, image: shadowPanther },
  { name: "Blazing Tiger", power: 8, speed: 6, agility: 4, stamina: 2, image: blazingTiger },
  { name: "Celestial Leviathan", power: 9, speed: 4, agility: 6, stamina: 8, image: celestialLeviathan },
  { name: "Eclipse Lion", power: 7, speed: 5, agility: 5, stamina: 9, image: eclipseLion },
  { name: "Storm Wyvern", power: 6, speed: 10, agility: 6, stamina: 4, image: stormWyvern }
];

const arenas: Arena[] = [
  { name: "Lava Pit", focus: "Power", image: lavaPit },
  { name: "Frosted Tundra", focus: "Stamina", image: frostedTundra },
  { name: "Thunder City", focus: "Speed", image: thunderCity },
  { name: "Mystic Forest", focus: "Agility", image: mysticForest },
  { name: "Inferno Plateau", focus: "Power", image: infernoPlateauImg },
  { name: "Ethereal Expanse", focus: "Agility", image: etherealExpanse },
  { name: "Solar Zenith", focus: "Stamina", image: solarZenith },
  { name: "Tempest Summit", focus: "Speed", image: tempestSummit }
];

const GamePage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(40);
  const [selectedBeasts, setSelectedBeasts] = useState<Beast[]>([]);
  const [selectedArenas, setSelectedArenas] = useState<Arena[]>([]);
  const [revealedArena, setRevealedArena] = useState<Arena | null>(null);
  const [hiddenArenas, setHiddenArenas] = useState<Arena[]>([]);
  const [fluctuatingScores, setFluctuatingScores] = useState<{ name: string; score: number }[]>([]);
  const [betAmount, setBetAmount] = useState('');
  const [selectedBeast, setSelectedBeast] = useState<string | null>(null);
  const [isBetPlaced, setIsBetPlaced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gameId, setGameId] = useState<number>(0);
  const [players, setPlayers] = useState<Player[]>([
    { address: '0x1234...5678', beast: 'Inferno Dragon', amount: '0.1' },
    { address: '0xabcd...efgh', beast: 'Frost Wolf', amount: '0.2' },
    { address: '0x9876...5432', beast: 'Thunder Falcon', amount: '0.15' },
  ]);
  const navigate = useNavigate();

  const calculateScore = useCallback((beast: Beast, arena: Arena) => {
    const baseScore = beast[arena.focus.toLowerCase() as keyof Beast];
    return baseScore + Math.random() * 2;
  }, []);

  const startFluctuation = useCallback(() => {
    if (!revealedArena) return;

    const intervalId = setInterval(() => {
      const fluctuatedScores = selectedBeasts.map(beast => ({
        name: beast.name,
        score: calculateScore(beast, revealedArena)
      }));
      setFluctuatingScores(fluctuatedScores);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [selectedBeasts, revealedArena, calculateScore]);

  useEffect(() => {
    const initializeGame = () => {
      const shuffledBeasts = [...beasts].sort(() => 0.5 - Math.random());
      const shuffledArenas = [...arenas].sort(() => 0.5 - Math.random());

      const selectedBeasts = shuffledBeasts.slice(0, 3);
      const selectedArenas = shuffledArenas.slice(0, 3);
      const revealedArena = shuffledArenas[0];

      setSelectedBeasts(selectedBeasts);
      setSelectedArenas(selectedArenas);
      setRevealedArena(revealedArena);
      setHiddenArenas(shuffledArenas.slice(1, 3));
      setGameId(Math.floor(Math.random() * 1000)); // Dummy game ID
    };

    initializeGame();
  }, []);

  useEffect(() => {
    const endTime = Date.now() + timeLeft * 1000;

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
      
      setTimeLeft(remaining);

      if (remaining === 0) {
        clearInterval(timer);
        navigate('/results', {
          state: {
            gameId,
            winner: fluctuatingScores.sort((a, b) => b.score - a.score)[0],
            selectedBeast,
            betAmount,
            selectedArenas
          }
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, gameId, fluctuatingScores, selectedBeast, betAmount, selectedArenas]);

  useEffect(() => {
    const cleanupFluctuation = startFluctuation();
    return () => {
      if (cleanupFluctuation) cleanupFluctuation();
    };
  }, [startFluctuation]);

  const handleBet = async () => {
    if (selectedBeast && betAmount) {
      setIsLoading(true);
      try {
        // Simulate bet placement
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsBetPlaced(true);
        setPlayers(prevPlayers => [
          ...prevPlayers,
          { address: '0x1111...2222', beast: selectedBeast, amount: betAmount }
        ]);
        console.log(`Bet placed: ${betAmount} ETH on ${selectedBeast}`);
      } catch (error) {
        console.error("Failed to place bet:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Beast Battle Arena
          </h1>
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-7xl font-bold text-red-500 mb-2"
          >
            {timeLeft}
          </motion.div>
          <p className="text-2xl text-gray-300">seconds remaining</p>
        </div>

        {/* Selected Beasts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {selectedBeasts.map((beast, index) => (
            <motion.div
              key={beast.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer ${
                selectedBeast === beast.name ? 'ring-4 ring-purple-500' : ''
              }`}
              onClick={() => !isBetPlaced && setSelectedBeast(beast.name)}
            >
              <div className="relative h-64">
                <img src={beast.image} alt={beast.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <p className="text-white text-lg font-semibold mb-1">{beast.name}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Score Speedometer */}
        <div className="mb-12 text-center">
          <h3 className="text-2xl font-semibold text-gray-300 mb-4">Battle Progress</h3>
          <div className="flex justify-center space-x-8">
            {fluctuatingScores.map((score, index) => (
              <motion.div
                key={index}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(score.score * 10, 100)}%` }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-purple-400 to-pink-500 h-6 rounded-full shadow-lg relative"
              >
                <span className="absolute text-sm text-white left-2">Unknown Beast</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Battle Arena */}
        <div className="flex justify-center items-center space-x-8">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: ['0px 0px 0px rgba(124, 58, 237, 0)', '0px 0px 20px rgba(124, 58, 237, 0.7)', '0px 0px 0px rgba(124, 58, 237, 0)'],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
          >
            <div className="relative h-64 w-full sm:w-96">
              <img src={revealedArena?.image} alt={revealedArena?.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center">
                <p className="text-2xl font-semibold text-white mb-2">{revealedArena?.name}</p>
                <p className="text-lg text-gray-300">Focus: <span className="font-bold text-purple-400">{revealedArena?.focus}</span></p>
              </div>
            </div>
          </motion.div>
          <div className="flex space-x-4">
            {hiddenArenas.map((arena, index) => (
              <motion.div
                key={arena.name}
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center"
              >
                <span className="text-2xl font-bold text-purple-400">?</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Betting Input */}
        <div className="flex flex-col items-center justify-center space-y-4 mt-5">
          <input
            type="number"
            value={betAmount}
            onChange={(e) => !isBetPlaced && setBetAmount(e.target.value)}
            placeholder="Enter bet amount (ETH)"
            className="px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64 text-center"
            disabled={isBetPlaced || isLoading}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBet}
            disabled={!selectedBeast || !betAmount || isBetPlaced || isLoading}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg transition duration-300 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? 'Placing Bet...' : isBetPlaced ? 'Bet Placed' : 'Place Bet'}
          </motion.button>
        </div>

        {/* Player List / Task Bar */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-gray-300 mb-4">Current Bets</h3>
          <div className="bg-gray-800 rounded-lg p-4">
            {players.map((player, index) => (
              <div key={index} className="flex justify-between items-center mb-2 last:mb-0">
                <span className="text-sm text-gray-300">
                  {player.address}
                </span>
                <span className="text-sm text-purple-400">{player.beast}</span>
                <span className="text-sm text-green-400">{player.amount} ETH</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;

