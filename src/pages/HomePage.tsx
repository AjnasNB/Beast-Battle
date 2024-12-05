import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BeastModal from '../components/BeastModal';
import background from '../assets/background.png'; // Import background image

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

interface HomePageProps {
  account: string | null;
}

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

const beastArenaData = beasts.map((beast, index) => ({
  beast,
  arena: arenas[index]
}));

const HomePage: React.FC<HomePageProps> = ({ account }) => {
  const navigate = useNavigate();
  const [selectedBeast, setSelectedBeast] = useState<Beast | null>(null);
  const [selectedArena, setSelectedArena] = useState<Arena | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (beast: Beast, arena: Arena) => {
    setSelectedBeast(beast);
    setSelectedArena(arena);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Welcome to Beast Battle Bet
          </h1>
          <p className="text-xl text-gray-300 mb-8">Prepare for epic battles in mystical arenas!</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/game')}
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg transition duration-300 hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 shadow-lg"
          >
            Start Battle
          </motion.button>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {beastArenaData.map((pair, index) => (
            <motion.div
              key={pair.beast.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              onClick={() => openModal(pair.beast, pair.arena)}
            >
              <div className="relative h-48">
                <div className="absolute inset-0 flex">
                  <div className="w-1/2 h-full overflow-hidden">
                    <img src={pair.beast.image} alt={pair.beast.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="w-1/2 h-full overflow-hidden">
                    <img src={pair.arena.image} alt={pair.arena.name} className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-60"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-white text-lg font-semibold mb-1">{pair.beast.name}</p>
                    <p className="text-gray-300 text-sm">{pair.arena.name}</p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-purple-300">Beast Abilities</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Power:</span>
                    <span className="text-white">{pair.beast.power}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Speed:</span>
                    <span className="text-white">{pair.beast.speed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Agility:</span>
                    <span className="text-white">{pair.beast.agility}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Stamina:</span>
                    <span className="text-white">{pair.beast.stamina}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-400">Arena Focus: <span className="text-white">{pair.arena.focus}</span></p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedBeast && selectedArena && (
        <BeastModal
          beast={selectedBeast}
          arena={selectedArena}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default HomePage;

