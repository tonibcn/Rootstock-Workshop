import { ethers } from "ethers";
import fs from "fs";

async function generateAddresses() {
  const addresses: string[] = [];
  const privateKeys: string[] = [];
  
  for (let i = 0; i < 5; i++) {
    const wallet = ethers.Wallet.createRandom();
    addresses.push(wallet.address);
    privateKeys.push(wallet.privateKey);
  }

  // Guardar las direcciones y claves privadas en archivos JSON
  fs.writeFileSync("addresses.json", JSON.stringify(addresses, null, 2));
  fs.writeFileSync("privatekeys.json", JSON.stringify(privateKeys, null, 2));

  console.log("Direcciones generadas y guardadas.");
}

generateAddresses().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
