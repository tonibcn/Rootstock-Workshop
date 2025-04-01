import { task } from "hardhat/config";
import { Voting } from "../typechain-types"; // Importa el tipo generado por Typechain
import * as dotenv from "dotenv";
dotenv.config();

// Dirección del contrato (reemplázala con la real)
const contractAddress =  '0x27099e7167ce18FFe6974F46F1f1EE109AeeAA99';

// Definir la tarea para agregar votantes
task("addvoter", "Agrega votantes autorizados")
  .addParam("voters", "Direcciones de los votantes a agregar (separadas por coma)")
  .setAction(async (taskArgs, { ethers }) => {
    const [owner] = await ethers.getSigners();
    const voters = taskArgs.voters.split(",").map((address: string) => address.trim());

    const voting: Voting = await ethers.getContractAt("Voting", contractAddress);

    console.log(`Agregando votantes: ${voters.join(", ")}`);
    await voting.addVoters(voters);
    console.log("Votantes agregados con éxito.");
  });

// Definir la tarea para emitir un voto
task("vote", "Emite un voto por un candidato")
  .addParam("candidate", "El candidato por el que votar (Elon, Milei, Altman)")
  .addParam("privatekey", "La clave privada del votante") // Asegúrate de que esté en minúsculas
  .setAction(async (taskArgs, { ethers }) => {
    const { candidate, privatekey } = taskArgs;

    // Verifica si los parámetros están correctamente definidos
    if (!candidate || !privatekey) {
      console.log("Faltan parámetros requeridos.");
      return;
    }

    // Crear un proveedor con el RPC de RSK
    const provider = new ethers.JsonRpcProvider(process.env.RSK_TESTNET_RPC_URL);

    // Crear un wallet con la clave privada proporcionada
    const voter = new ethers.Wallet(privatekey, provider);

    // Obtener el contrato Voting
    const voting = await ethers.getContractAt("Voting", process.env.CONTRACT_ADDRESS!, voter);

    console.log(`Votando por ${candidate} con la clave privada: ${privatekey}`);
    const tx = await voting.vote(candidate);
    await tx.wait();
    console.log(`Voto emitido por ${voter.address} a favor de ${candidate}`);
  });

// Definir la tarea para finalizar la votación
task("setresult", "Finaliza la votación y establece el resultado")
  .setAction(async (_, { ethers }) => {
    const voting: Voting = await ethers.getContractAt("Voting", contractAddress);

    console.log("Finalizando la votación...");
    await voting.setElectionResult();
    console.log("Resultado de la votación establecido con éxito.");
  });

// Definir la tarea para obtener la participación
task("participation", "Muestra el porcentaje de participación")
  .setAction(async (_, { ethers }) => {
    const voting: Voting = await ethers.getContractAt("Voting", contractAddress);

    const participation = await voting.getParticipation();
    console.log(`Porcentaje de participación: ${participation}%`);
  });

// Definir la tarea para obtener el tiempo restante para la votación
task("remainingtime", "Muestra el tiempo restante para que termine la votación")
  .setAction(async (_, { ethers }) => {
    const voting: Voting = await ethers.getContractAt("Voting", contractAddress);

    const remainingTime = await voting.getRemainingTime();
    console.log(`Tiempo restante para que termine la votación: ${remainingTime} minutos`);
  });

// Definir la tarea para obtener la lista de votantes autorizados
task("voterslist", "Muestra la lista de votantes autorizados")
  .setAction(async (_, { ethers }) => {
    const voting: Voting = await ethers.getContractAt("Voting", contractAddress);

    const votersList = await voting.getAllVoters();
    console.log("Lista de votantes autorizados:", votersList.join(", "));
  });
