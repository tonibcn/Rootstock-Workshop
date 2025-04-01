// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

//Rootstook: ¿Quien es para ti el personaje del año de lo que va de 2025?

contract Voting {
    // Definición de los candidatos disponibles
    enum Candidate { Elon, Milei, Altman }

    // Estructura para almacenar los votos de cada candidato
    struct Votes {
        uint256 elonVotes;
        uint256 mileiVotes;
        uint256 altmanVotes;
    }

    // Variable pública para almacenar los votos de todos los candidatos
    Votes public votes; 

    // Mapeos para verificar quién ha votado y quién tiene permitido votar
    mapping(address => bool) public hasVoted;
    mapping(address => bool) public allowedVoters;
    address[] public allowedVotersList;

    // Variables del contrato
    uint256 public votingEnd; // Marca el final de la votación
    address public owner; // Almacena la dirección del propietario
    bool public isElectionFinalized; // Indica si la elección ha finalizado
    string public electionWinner; // Almacena el candidato ganador
    uint256 public electionWinnerVotes; // Almacena la cantidad de votos del ganador

    // Errores personalizados
    error YouVeAlreadyVoted();
    error VotedEnded();
    error NotAllowedToVote();
    error VotingNotEnded();
    error NoOneVoted();

    // Modificador para restringir funciones al propietario
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    // Eventos para registrar acciones importantes
    event VotersAdded(address[] voters);
    event VotingEnded(string winner, uint256 totalVotes);

    // Constructor: Se ejecuta solo una vez al desplegar el contrato
    constructor() {
        owner = msg.sender;
        votingEnd = block.timestamp + 7 minutes; // Duración de la votación
    }

    // Permite al propietario agregar votantes autorizados
    // Añadir con el siguiente formato: ["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db"]
    
    function addVoters(address[] memory _voters) external onlyOwner {
        require(_voters.length > 0, "There must be at least one voter");
        for (uint i = 0; i < _voters.length; i++) {
            if (!allowedVoters[_voters[i]]) {
                allowedVoters[_voters[i]] = true;
                allowedVotersList.push(_voters[i]);
            }
        }
        emit VotersAdded(_voters); // Emite el evento con la lista completa
    }

    // Función para emitir un voto por un candidato específico
    function vote(Candidate _votingChoice) external {
        if (hasVoted[msg.sender]) revert YouVeAlreadyVoted();
        if (votingEnd < block.timestamp) revert VotedEnded();
        if (!allowedVoters[msg.sender]) revert NotAllowedToVote();

        hasVoted[msg.sender] = true;
        
        // Incrementa el voto del candidato correspondiente
        if (_votingChoice == Candidate.Elon) {
            votes.elonVotes += 1;
        } else if (_votingChoice == Candidate.Milei) {
            votes.mileiVotes += 1;
        } else if (_votingChoice == Candidate.Altman) {
            votes.altmanVotes += 1;
        }
    }

    // Función para establecer el resultado de la elección
    // Función que establece el resultado de la elección

    function setElectionResult() external onlyOwner {
        // Verifica que la votación haya terminado antes de establecer el resultado
        if (block.timestamp < votingEnd) {
            revert VotingNotEnded();
        }

        uint256 maxVotes = 0;
        Candidate winner = Candidate.Elon; // Se inicializa con un valor válido

        // Verifica los votos de Elon
        if (votes.elonVotes > maxVotes) {
            maxVotes = votes.elonVotes;
            winner = Candidate.Elon;
        }
        // Verifica los votos de Milei
        if (votes.mileiVotes > maxVotes) {
            maxVotes = votes.mileiVotes;
            winner = Candidate.Milei;
        }
        // Verifica los votos de Altman
        if (votes.altmanVotes > maxVotes) {
            maxVotes = votes.altmanVotes;
            winner = Candidate.Altman;
        }

        // Si no hay votos, se revierte con un error
        if (maxVotes == 0) {
            revert NoOneVoted();
        }

        // Asigna el nombre del ganador como string
        string memory winnerName;
        if (winner == Candidate.Elon) {
            winnerName = "Elon";
        } else if (winner == Candidate.Milei) {
            winnerName = "Milei";
        } else {
            winnerName = "Altman";
        }

        // Guarda el resultado y marca la elección como finalizada
        electionWinner = winnerName;
        electionWinnerVotes = maxVotes;
        isElectionFinalized = true;

        // Emite el evento con el nombre del ganador y la cantidad de votos
        emit VotingEnded(electionWinner, electionWinnerVotes);
}


    // Obtiene el porcentaje de participación en la votación
    function getParticipation() external view returns (uint256) {
        if (allowedVotersList.length == 0) return 0;

        uint256 totalVoters = 0;
        uint256 voterRegistryCount  = allowedVotersList.length;

        for (uint i = 0; i < voterRegistryCount ; i++) {
            if (hasVoted[allowedVotersList[i]]) {
                totalVoters++;
            }
        }
        
        return (totalVoters * 100) / voterRegistryCount;
    }

    // Obtiene el tiempo restante para que termine la votación en minutos
    function getRemainingTime() external view returns (uint256) {
        if (block.timestamp >= votingEnd) return 0;
        return (votingEnd - block.timestamp) / 60;
    }

    // Obtiene la lista de votantes autorizados
    function getAllVoters() public view returns (address[] memory) {
        return allowedVotersList;
    }

}
