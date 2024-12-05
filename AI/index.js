const express = require('express');
const bodyParser = require('body-parser');
const { Ollama } = require('ollama');

const app = express();
app.use(bodyParser.json());

// Initialize Ollama
const ollama = new Ollama({
  baseUrl: 'http://localhost:11434', // Default Ollama server endpoint
});

// Beast and Arena Definitions
const beasts = [
  { name: "Inferno Dragon", power: 10, speed: 5, agility: 3, stamina: 2 },
  { name: "Frost Wolf", power: 4, speed: 7, agility: 6, stamina: 3 },
  { name: "Thunder Falcon", power: 3, speed: 10, agility: 7, stamina: 1 },
  { name: "Shadow Panther", power: 5, speed: 8, agility: 10, stamina: 2 },
  { name: "Blazing Tiger", power: 8, speed: 6, agility: 4, stamina: 2 },
  { name: "Celestial Leviathan", power: 9, speed: 4, agility: 6, stamina: 8 },
  { name: "Eclipse Lion", power: 7, speed: 5, agility: 5, stamina: 9 },
  { name: "Storm Wyvern", power: 6, speed: 10, agility: 6, stamina: 4 },
];

const arenas = [
  { name: "Lava Pit", focus: "Power" },
  { name: "Frosted Tundra", focus: "Stamina" },
  { name: "Thunder City", focus: "Speed" },
  { name: "Mystic Forest", focus: "Agility" },
];

// Helper Function: Generate Ollama Prompt
const generatePrompt = (selectedBeasts, arenaFocus) => {
  const beastStats = selectedBeasts
    .map(beast => `${beast.name}: Power ${beast.power}, Speed ${beast.speed}, Agility ${beast.agility}, Stamina ${beast.stamina}`)
    .join("\n");

  return `Predict the winner of the battle in the ${arenaFocus} arena. 
Beast stats are as follows:
${beastStats}
Use the arena focus to evaluate performance and give a logical prediction.`;
};

// API Endpoint for Predicting Winner
app.post('/predict', async (req, res) => {
  const { selectedBeasts, arena } = req.body;

  if (!selectedBeasts || !arena) {
    return res.status(400).json({ error: "Missing selectedBeasts or arena." });
  }

  try {
    const prompt = generatePrompt(selectedBeasts, arena.focus);

    // Call Ollama's chat API
    const response = await ollama.chat({
      model: "llama2", // Replace with your installed Ollama model
      messages: [{ role: "system", content: prompt }],
    });

    const prediction = response.text.trim();
    res.json({ prediction });
  } catch (error) {
    console.error("Error predicting winner:", error);
    res.status(500).json({ error: "Failed to predict the winner." });
  }
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
