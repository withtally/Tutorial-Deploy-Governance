
const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {

    // Compile our Contracts, just in case
    await hre.run('compile');

    // Get a signer from the HardHard environment
    // Learn about signers here: https://docs.ethers.io/v4/api-wallet.html
    const [tokenRecipient, timelockAdmin, guardian] = await ethers.getSigners();

    // This gets the contract from 
    const Token = await hre.ethers.getContractFactory("Comp");
    const token = await Token.deploy(tokenRecipient.address);
    await token.deployed();
    await token.deployTransaction.wait();
    
    // Deploy Timelock
    const delay = 172800;
    const Timelock = await ethers.getContractFactory("Timelock");
    const timelock = await Timelock.deploy(timelockAdmin.address, delay);
    await timelock.deployed();
    await timelock.deployTransaction.wait();

    // Deploy Governance
    const Gov = await ethers.getContractFactory("GovernorAlpha");
    const gov = await gov.deploy(timelock.address, token.address, guardian.address);
    await gov.deployed();
    await gov.deployTransaction.wait();

    console.log(`Token deployed to: ${token.address}`);
    console.log(`TimeLock deployed to: ${timelock.address}`);
    console.log(`GovernorAlpha deployed to: ${gov.address}`)

    const initialBalance = await token.balanceOf(tokenRecipient.address);
    console.log(`${initialBalance / 1e18} tokens transfered to ${tokenRecipient.address}`);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
