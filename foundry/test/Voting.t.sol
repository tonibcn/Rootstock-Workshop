// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Test, console} from "forge-std/Test.sol";
import "../src/Voting.sol";

contract VotingTest is Test {
    Voting public votingContract;
    address public fakeOwner;

    // Direcciones de prueba
    address voter1 = address(2);
    address voter2 = address(3);
    address voter3 = address(4);
    address[] voters;

    // Inicialización del contrato
    function setUp() public {
        // Desplegar el contrato de votación y asignar el fakeOwner como propietario
        fakeOwner = address(1);
        vm.prank(fakeOwner);
        votingContract = new Voting();
    }

    // Test para verificar que el propietario es asignado correctamente
    function testOwnerAssignedCorrectly() public {
        assertEq(votingContract.owner(), fakeOwner, "El owner no esta correctamente asignado.");
    }

    // Test para añadir votantes correctamente
    function testAddVoters() public {
        voters.push(voter1);
        voters.push(voter2);

        vm.prank(fakeOwner); // Simula que la transacción es realizada por el propietario
        votingContract.addVoters(voters);

        // Verificar que los votantes han sido añadidos
        assertTrue(votingContract.allowedVoters(voter1), "Votante 1 no anadido correctamente.");
        assertTrue(votingContract.allowedVoters(voter2), "Votante 2 no anadido correctamente.");
    }

    // Test para evitar que alguien vote sin haber sido añadido previamente
    function testCannotVoteIfNotAdded() public {
        vm.prank(voter1);
        vm.expectRevert(Voting.NotAllowedToVote.selector);
        votingContract.vote(Voting.Candidate.Elon);
    }

    // Test para votar correctamente después de ser añadido al censo
    function testVote() public {
        voters.push(voter1);
        voters.push(voter2);

        vm.prank(fakeOwner);
        votingContract.addVoters(voters);

        // Votar por Elon
        vm.prank(voter1);
        votingContract.vote(Voting.Candidate.Elon);

        // Obtener los votos de Elon después de votar
        (uint256 elonVotes, , ) = votingContract.votes();
        assertEq(elonVotes, 1, "El voto a Elon no fue registrado correctamente.");
    }

    // Test para intentar votar después de que haya terminado la votación
    function testVotingEndsAfterDeadline() public {
        voters.push(voter1);

        vm.prank(fakeOwner);
        votingContract.addVoters(voters);

        // Avanzar el tiempo para que la votación haya terminado
        vm.warp(block.timestamp + 8 minutes);

        vm.prank(voter1);
        vm.expectRevert(Voting.VotedEnded.selector);
        votingContract.vote(Voting.Candidate.Elon);
    }

    // Test para finalizar la votación y establecer el resultado
    function testSetElectionResult() public {
        voters.push(voter1);
        voters.push(voter2);

        vm.prank(fakeOwner);
        votingContract.addVoters(voters);

        vm.prank(voter1);
        votingContract.vote(Voting.Candidate.Elon);

        vm.warp(block.timestamp + 8 minutes);

        vm.prank(fakeOwner);
        votingContract.setElectionResult();

        assertEq(votingContract.electionWinner(), "Elon", "El ganador de la eleccion no es correcto.");
        assertEq(votingContract.electionWinnerVotes(), 1, "El conteo de votos no es correcto.");
    }

    // Test para obtener la participación en la votación
    function testGetParticipation() public {
        voters.push(voter1);
        voters.push(voter2);

        vm.prank(fakeOwner);
        votingContract.addVoters(voters);

        vm.prank(voter1);
        votingContract.vote(Voting.Candidate.Elon);

        uint256 participation = votingContract.getParticipation();
        assertEq(participation, 50, "El calculo de participacion no es correcto.");
    }
}
