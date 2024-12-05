import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface BeastModalProps {
  beast: Beast;
  arena: Arena;
  isOpen: boolean;
  onClose: () => void;
}

const BeastModal: React.FC<BeastModalProps> = ({ beast, arena, isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 mb-4 md:mb-0 md:mr-4">
                <img src={beast.image} alt={beast.name} className="w-full h-64 object-cover rounded-lg" />
              </div>
              <div className="md:w-1/2">
                <h2 className="text-2xl font-bold mb-4 text-purple-300">{beast.name}</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400">Power:</p>
                    <p className="text-white font-semibold">{beast.power}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Speed:</p>
                    <p className="text-white font-semibold">{beast.speed}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Agility:</p>
                    <p className="text-white font-semibold">{beast.agility}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Stamina:</p>
                    <p className="text-white font-semibold">{beast.stamina}</p>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-purple-300">Preferred Arena</h3>
                <div className="mb-4">
                  <p className="text-gray-400">Name: <span className="text-white">{arena.name}</span></p>
                  <p className="text-gray-400">Focus: <span className="text-white">{arena.focus}</span></p>
                </div>
                <img src={arena.image} alt={arena.name} className="w-full h-32 object-cover rounded-lg" />
              </div>
            </div>
            <button
              onClick={onClose}
              className="mt-6 w-full bg-purple-600 text-white rounded-full py-2 px-4 hover:bg-purple-700 transition duration-300"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BeastModal;

