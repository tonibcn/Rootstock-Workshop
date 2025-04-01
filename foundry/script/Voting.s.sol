// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import {Script, console} from "forge-std/Script.sol";
import "../src/Voting.sol";

contract VotingDeployScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast(); // Inicia la transmisión de la transacción
        Voting votingContract = new Voting();
        vm.stopBroadcast(); // Finaliza la transmisión

        console.log("Voting contract deployed to:", address(votingContract));
    }
}

