import { ethers } from 'ethers';

const contractAddress = '0x7438af9FC68fE976e33029E570720d19A975baC7';
const contractABI = [
  "function startGame(string[3] memory beasts, string[3] memory arenas, string memory revealedArena) public",
  "function placeBet(uint256 gameId, string memory beastName) public payable",
  "function endGame(uint256 gameId, string memory winningBeast) public",
  "function withdrawWinnings() public",
  "function getGameInfo(uint256 gameId) public view returns (uint256 startTime, uint256 endTime, string[3] memory beasts, string[3] memory arenas, string memory revealedArena, bool ended, string memory winningBeast)",
  "function getPlayerCount(uint256 gameId) public view returns (uint256)",
  "function getPlayerInfo(uint256 gameId, uint256 playerIndex) public view returns (address playerAddress, uint256 betAmount, string memory beastName)",
  "event GameStarted(uint256 gameId, uint256 startTime, uint256 endTime, string[3] beasts, string[3] arenas, string revealedArena)",
  "event BetPlaced(uint256 gameId, address player, uint256 amount, string beastName)",
  "event GameEnded(uint256 gameId, string winningBeast, uint256 totalPool)",
  "event WinningsWithdrawn(address winner, uint256 amount)"
];

export const getContract = async () => {
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  }
  throw new Error('Please install MetaMask to use this app');
};

export const startGame = async (beasts: string[], arenas: string[], revealedArena: string) => {
  const contract = await getContract();
  const tx = await contract.startGame(beasts, arenas, revealedArena);
  await tx.wait();
  return tx;
};

export const placeBet = async (gameId: number, beastName: string, betAmount: string) => {
  const contract = await getContract();
  const tx = await contract.placeBet(gameId, beastName, { value: ethers.utils.parseEther(betAmount) });
  await tx.wait();
  return tx;
};

export const endGame = async (gameId: number, winningBeast: string) => {
  const contract = await getContract();
  const tx = await contract.endGame(gameId, winningBeast);
  await tx.wait();
  return tx;
};

export const withdrawWinnings = async () => {
  const contract = await getContract();
  const tx = await contract.withdrawWinnings();
  await tx.wait();
  return tx;
};

export const getGameInfo = async (gameId: number) => {
  const contract = await getContract();
  return await contract.getGameInfo(gameId);
};

export const getPlayerCount = async (gameId: number) => {
  const contract = await getContract();
  return await contract.getPlayerCount(gameId);
};

export const getPlayerInfo = async (gameId: number, playerIndex: number) => {
  const contract = await getContract();
  return await contract.getPlayerInfo(gameId, playerIndex);
};

