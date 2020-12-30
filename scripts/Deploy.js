
const hre = require("hardhat");
const ethers = hre.ethers;

async function main({tokenRecipient, timeLockAdmin, guardian}) {

    // Compile our Contracts, just in case
    await hre.run('compile');

    // This gets the contract from 
    const Token = await hre.ethers.getContractFactory("Comp");
    const token = await Token.deploy(tokenRecipient);
    await token.deployed();
    await token.deployTransaction.wait();
    
    // Deploy Timelock
    const delay = 172800;
    const Timelock = await ethers.getContractFactory("Timelock");
    const timelock = await Timelock.deploy(timeLockAdmin, delay);
    await timelock.deployed();
    await timelock.deployTransaction.wait();

    // Deploy Governance
    const Gov = await ethers.getContractFactory("GovernorAlpha");
    const gov = await Gov.deploy(timelock.address, token.address, guardian);
    await gov.deployed();
    await gov.deployTransaction.wait();

    console.log(`Token deployed to: ${token.address}`);
    console.log(`TimeLock deployed to: ${timelock.address}`);
    console.log(`GovernorAlpha deployed to: ${gov.address}`)

    const initialBalance = await token.balanceOf(tokenRecipient);
    console.log(`${initialBalance / 1e18} tokens transfered to ${tokenRecipient}`);
}

module.exports = {
        deploy: main
    }