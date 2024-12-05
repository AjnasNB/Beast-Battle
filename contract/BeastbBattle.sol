// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BeastBattleBet {
    struct Player {
        address playerAddress;
        uint256 betAmount;
        string beastName;
    }

    struct Game {
        uint256 startTime;
        uint256 endTime;
        string[3] beasts;
        string[3] arenas;
        string revealedArena;
        bool ended;
        string winningBeast;
        uint256 totalPool;
    }

    address public owner;
    Game[] public games;
    mapping(uint256 => Player[]) public gamePlayers;
    mapping(address => uint256) public winnings;

    event GameStarted(uint256 gameId, uint256 startTime, uint256 endTime, string[3] beasts, string[3] arenas, string revealedArena);
    event BetPlaced(uint256 gameId, address player, uint256 amount, string beastName);
    event GameEnded(uint256 gameId, string winningBeast, uint256 totalPool);
    event WinningsWithdrawn(address winner, uint256 amount);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    function startGame(string[3] memory beasts, string[3] memory arenas, string memory revealedArena) public onlyOwner {
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + 40 seconds;

        games.push(Game({
            startTime: startTime,
            endTime: endTime,
            beasts: beasts,
            arenas: arenas,
            revealedArena: revealedArena,
            ended: false,
            winningBeast: "",
            totalPool: 0
        }));

        uint256 gameId = games.length - 1;
        emit GameStarted(gameId, startTime, endTime, beasts, arenas, revealedArena);
    }

    function placeBet(uint256 gameId, string memory beastName) public payable {
        require(gameId < games.length, "Invalid game ID");
        Game storage game = games[gameId];
        require(block.timestamp < game.endTime, "Game has ended");
        require(msg.value > 0, "Bet amount must be greater than zero");

        gamePlayers[gameId].push(Player({
            playerAddress: msg.sender,
            betAmount: msg.value,
            beastName: beastName
        }));

        game.totalPool += msg.value;

        emit BetPlaced(gameId, msg.sender, msg.value, beastName);
    }

    function endGame(uint256 gameId, string memory winningBeast) public onlyOwner {
        require(gameId < games.length, "Invalid game ID");
        Game storage game = games[gameId];
        require(!game.ended, "Game has already ended");
        require(block.timestamp >= game.endTime, "Game has not ended yet");

        game.ended = true;
        game.winningBeast = winningBeast;

        uint256 winningPool = 0;

        Player[] storage players = gamePlayers[gameId];
        for (uint256 i = 0; i < players.length; i++) {
            if (keccak256(abi.encodePacked(players[i].beastName)) == keccak256(abi.encodePacked(winningBeast))) {
                winningPool += players[i].betAmount;
            }
        }

        if (winningPool > 0) {
            for (uint256 i = 0; i < players.length; i++) {
                if (keccak256(abi.encodePacked(players[i].beastName)) == keccak256(abi.encodePacked(winningBeast))) {
                    uint256 winnerShare = (players[i].betAmount * game.totalPool) / winningPool;
                    winnings[players[i].playerAddress] += winnerShare;
                }
            }
        }

        emit GameEnded(gameId, winningBeast, game.totalPool);
    }

    function withdrawWinnings() public {
        uint256 amount = winnings[msg.sender];
        require(amount > 0, "No winnings to withdraw");

        winnings[msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        emit WinningsWithdrawn(msg.sender, amount);
    }

    function getGameInfo(uint256 gameId) public view returns (
        uint256 startTime,
        uint256 endTime,
        string[3] memory beasts,
        string[3] memory arenas,
        string memory revealedArena,
        bool ended,
        string memory winningBeast,
        uint256 totalPool
    ) {
        require(gameId < games.length, "Invalid game ID");
        Game storage game = games[gameId];
        return (
            game.startTime,
            game.endTime,
            game.beasts,
            game.arenas,
            game.revealedArena,
            game.ended,
            game.winningBeast,
            game.totalPool
        );
    }

    function getPlayerCount(uint256 gameId) public view returns (uint256) {
        require(gameId < games.length, "Invalid game ID");
        return gamePlayers[gameId].length;
    }

    function getPlayerInfo(uint256 gameId, uint256 playerIndex) public view returns (
        address playerAddress,
        uint256 betAmount,
        string memory beastName
    ) {
        require(gameId < games.length, "Invalid game ID");
        require(playerIndex < gamePlayers[gameId].length, "Invalid player index");
        Player storage player = gamePlayers[gameId][playerIndex];
        return (player.playerAddress, player.betAmount, player.beastName);
    }
}

