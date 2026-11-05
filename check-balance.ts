import { network } from "hardhat";

const { ethers, networkName } = await network.create({
  network: "sepolia",
});

const [signer] = await ethers.getSigners();
const address = await signer.getAddress();
const balance = await ethers.provider.getBalance(address);

console.log("Network:", networkName);
console.log("Wallet:", address);
console.log("Sepolia ETH balance:", ethers.formatEther(balance), "ETH");
