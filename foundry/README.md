# Rootstock Foundry Workshop

## Instrucciones para el Workshop

## 0.Previo: Instalar foundry (revisar requisitos)

https://book.getfoundry.sh/getting-started/installation

## 1.Una vez instalado, ejecutar:
foundryup

## (Opcional) Inicializar un nuevo proyecto; abrir en un editor de codigo una nueva carpeta donde desplegar el proyecto (sin control de versiones en este ejemplo)
forge init --no-commit

## 2. Descargar el repositorio

git clone https://github.com/tonibcn/Rootstock-Workshop.git

## 3. Asegurarnos que estamos en la ruta del repositorio

cd Rootstock-Workshop/foundry

## 4. Compilar los scripts
forge build

## 5. Comprobar el testeo de las funciones
forge test

## (Opcional): Realizar pruebas en una blockchain local
anvil

## 6. Antes de desplegar en contrato en la blockchain,para facilitar la legibilidad de los comandos necesitamos definir una serie de variables, usaremos un fichero .env
Necesitamos informar:
	El nodo de conexión, por ejemplo el del proveedor alchemy o podria ser el que nos da rootstock:  ALCHEMY_RPC_URL, 
	La primary key de la address con el que vamos a desplegar (usar una wallet donde no tengas fondos reles): PK_DEPLOYER
	Si queremos también simular como seria una votación real, necesitaremos otras address para votar e informar las private keys: PK_VOTER1, PK_VOTER2
	Adicionalmente, una vez despleguemos el contrato, podemos añadir la dirección generada: CONTRACT_ADDRESS

## Tras esto para que se actualicen las variables podemos ejecutar 
source .env

## (Opcional): Si tuvieramos que desplegar varios scripts o quisieramos desplegar el actual con alguna acción adicional podemos ejecutar un script:
forge script ./script/Voting.s.sol: VotingDeployScript --rpc-url $ALCHEMY_RPC_URL --private-key $PRIVATE_KEY --legacy

## 7. Compilar y desplegar directamente en la blockchain:
forge create ./src/Voting.sol:Voting --rpc-url $ALCHEMY_RPC_URL --private-key $PK_DEPLOYER --legacy 

## (Opcional): Verificar el contrato

forge verify-contract \
  --rpc-url $ALCHEMY_RPC_URL \
  --verifier blockscout \
  --verifier-url 'https://rootstock-testnet.blockscout.com/api/' \
  $CONTRACT_ADDRESS \
  src/Voting.sol:Voting

## 8. Realizar consultas (no modicamos el estado de la blockchain):
## Consultar la participacion
cast call $CONTRACT_ADDRESS "getParticipation()" --rpc-url $ALCHEMY_RPC_URL | cast --to-dec
## Consultar el listado de votantes (censo)
cast call $CONTRACT_ADDRESS "allowedVotersList()" --rpc-url $ALCHEMY_RPC_URL
## Consultar si ha votado una dirección en concreto
cast call $CONTRACT_ADDRESS "hasVoted(address)(bool)" $VOTER1_ADDRESS --rpc-url $ALCHEMY_RPC_URL
## Consultar si ha finalizado la votación
cast call $CONTRACT_ADDRESS "isElectionFinalized()" --rpc-url $ALCHEMY_RPC_URL | cast --to-dec
## Consultar el ganador
cast call $CONTRACT_ADDRESS "electionWinner()" --rpc-url $ALCHEMY_RPC_URL
## Consultar los votos del ganador
cast call $CONTRACT_ADDRESS "electionWinnerVotes()" --rpc-url $ALCHEMY_RPC_URL


## 9. Escribir (sí modificamos la blockchain)
## Añadimos votantes
cast send $CONTRACT_ADDRESS "addVoters(address[] memory)" ["0xaEBe808C339D5F4384c06A9e7e11ac921d495aE3","0xe4bAAB547d6c533ECD6901BF11912f924c3a4130","0xF865575b4B94615f6b1354C5b8D79C08EAe3F9CE"] \
rpc-url $ALCHEMY_RPC_URL --private-key $PK_DEPLOYER --legacy

## Votamos
cast send $CONTRACT_ADDRESS "vote(uint8)" 0 --rpc-url $ALCHEMY_RPC_URL --private-key $PK_VOTER1 --gas-limit 500000 --legacy
cast send $CONTRACT_ADDRESS "vote(uint8)" 0 --rpc-url $ALCHEMY_RPC_URL --private-key $PK_VOTER2 --gas-limit 500000 --legacy

## Finalizamos la votación (solo el administrador)
cast send $CONTRACT_ADDRESS "setElectionResult()" --rpc-url $ALCHEMY_RPC_URL --private-key $PK_DEPLOYER --legacy
