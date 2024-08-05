const hre = require("hardhat");

const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

const sendShieldedTransaction = async (signer, destination, data, value) => {
  const rpcLink = hre.network.config.url;
  const [encryptedData] = await encryptDataField(rpcLink, data);
  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
  const contractAddress = "0xFCf02b3C1b4E1CB75a1dF40219D473fCA96CfFDd"
  const [signer] = await hre.ethers.getSigners();
  const contractFactory = await hre.ethers.getContractFactory("ZunXBT");
  const contract = contractFactory.attach(contractAddress);
  const functionName = "safeMint";
  const safeMintTx = await sendShieldedTransaction(
    signer,
    contractAddress,
    contract.interface.encodeFunctionData(functionName, [signer.address, 1]),
    0
  );
  await safeMintTx.wait();
  console.log(`Transaction URL of Mint: https://explorer-evm.testnet.swisstronik.com/tx/${safeMintTx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
