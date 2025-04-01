import { ethers } from "hardhat";
import { expect } from "chai";
import { Voting } from "../typechain-types";

// Tipos de candidatos (Elon, Milei, Altman)
enum Candidate {
  Elon = 0,
  Milei = 1,
  Altman = 2
}

describe("Voting contract", function () {
  let voting: Voting;
  let owner: string;
  let voter1: string;
  let voter2: string;
  let voter3: string;

  beforeEach(async function () {
    // Desplegar el contrato antes de cada test
    const [deployer, _voter1, _voter2, _voter3] = await ethers.getSigners();
    owner = deployer.address;
    voter1 = _voter1.address;
    voter2 = _voter2.address;
    voter3 = _voter3.address;

    const Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
  });

  it("should deploy the Voting contract and set the owner", async function () {
    expect(await voting.owner()).to.equal(owner);
  });

  it("should add allowed voters correctly", async function () {
    await voting.addVoters([voter1, voter2]);
    
    expect(await voting.allowedVoters(voter1)).to.equal(true);
    expect(await voting.allowedVoters(voter2)).to.equal(true);
  });

  it("should prevent non-allowed voters from voting", async function () {
    await expect(voting.connect(await ethers.getSigner(voter3)).vote(Candidate.Elon))
      .to.be.revertedWithCustomError(voting, "NotAllowedToVote");
  });

  it("should allow allowed voters to vote", async function () {
    await voting.addVoters([voter1, voter2]);

    await voting.connect(await ethers.getSigner(voter1)).vote(Candidate.Elon);
    await voting.connect(await ethers.getSigner(voter2)).vote(Candidate.Milei);

    const votes = await voting.votes();
    expect(votes.elonVotes).to.equal(1);
    expect(votes.mileiVotes).to.equal(1);
  });

  it("should prevent double voting", async function () {
    await voting.addVoters([voter1]);

    await voting.connect(await ethers.getSigner(voter1)).vote(Candidate.Elon);

    await expect(voting.connect(await ethers.getSigner(voter1)).vote(Candidate.Milei))
      .to.be.revertedWithCustomError(voting, "YouVeAlreadyVoted");
  });

  it("should set the election result correctly", async function () {
    await voting.addVoters([voter1, voter2]);

    // Simula los votos
    await voting.connect(await ethers.getSigner(voter2)).vote(Candidate.Milei);

    // Simula que la votación ya terminó
    await ethers.provider.send("evm_increaseTime", [420]); // Aumenta el tiempo (7 minutos)
    await ethers.provider.send("evm_mine", []); // Minar el bloque para que el tiempo avance

    await voting.setElectionResult();

    const winner = await voting.electionWinner();
    const winnerVotes = await voting.electionWinnerVotes();


    expect(winner).to.equal("Milei"); // Debería ser Milei ya que tiene 1 voto
    expect(winnerVotes).to.equal(1); // Debería tener 1 voto
  });

  it("should calculate participation percentage correctly", async function () {
    await voting.addVoters([voter1, voter2, voter3]);
    await voting.connect(await ethers.getSigner(voter1)).vote(Candidate.Elon);

    const participation = await voting.getParticipation();
    expect(participation).to.equal(33); // 1 de 3 votantes ha votado (33%)
  });

  it("should return remaining voting time correctly", async function () {
    const remainingTime = await voting.getRemainingTime();
    expect(remainingTime).to.be.at.most(7); // Debería devolver un valor de hasta 7 minutos.
  });
});
