# Rootstock Hardhat Workshop

## Instrucciones para el Workshop

### 0. Revisar las instrucciones y requisitos del directorio de Rootstock Hardhat Quickstart

Antes de comenzar, asegúrate de revisar las instrucciones y los requisitos para trabajar con Rootstock y Hardhat:

[Rootstock Hardhat Quickstart](https://dev.rootstock.io/developers/quickstart/hardhat/)

### 1. Clonar el repositorio del workshop

Clona el repositorio de este workshop para obtener los archivos del proyecto:

git clone https://github.com/tonibcn/Rootstock-Workshop.git

### 2. Asegurar que estás en el directorio correcto. Una vez clonado el repositorio, navega al directorio del proyecto:

cd rootstock-hardhat-starterkit

### 3. Instalar todas las dependencias (package.json)

npm install

### 4. Crear un fichero .env para informar la conexión a la blockchain mediante ALCHEMY_RPC_URL o ROOTSTOCK_RPC_URL, la addres del administrador (el que despliega el contrato), y las claves primarias de los votantes (ejecutar el script para generar address y private keys para poder realizar la votación)

npx hardhat run generateAddresses.ts

### 5. Compilar el contrato
npx hardhat compile

### 6. Testear el smart contract
npx hardhat test
npx hardhat test test/Counter-test.ts

### 7. Despligue en rootstock
npx hardhat deploy --network rskTestnet

### 8. Verificar el contrato
npx hardhat verify --network rskTestnet 'dirección del contrato desplegado'

### 9. Creamos varios scripts con diferentes tasks
### 9.1 Hemos de añadir el importar la task en el archivo de hardhat.config.ts y añadir el address del contrato desplegado en 'voting_tasks.ts'

### 10. Ejecutar las task del fichero 'voting_tasks.ts'. Por ejemplo:
npx hardhat addvoter --network rskTestnet --voters "0xaEBe808C339D5F4384c06A9e7e11ac921d495aE3,0xe4bAAB547d6c533ECD6901BF11912f924c3a4130"
npx hardhat vote --network rskTestnet --candidate 0 --privatekey '0x13d5733625463ab6b9a54d917d24a01058bbc8d499c4a7f3c289b3f60ef620b9' 
