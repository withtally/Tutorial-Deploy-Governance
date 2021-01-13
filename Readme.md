TL:DR

Want governance now? Clone the [github](https://github.com/withtally/Tutorial-Deploy-Governance) project, install the dependencies, add your Infura API and private key to the config and type `npx hardhat deploy`

**Tally Governance Tutorial:** 

In this tutorial we show you how to deploy a Compound-style governance system that is secure and ready to be used in your DeFi project or protocol using HardHat.

## About [Tally](https://withtally.com/):

[https://withtally.com/](https://withtally.com/)

Tally is the premier place to interact with Governance on the Ethereum blockchain. We make tools to make governance easier, bring greater community involvement and enhanced transparency for decentralized protocols.

If you would like to have your Compound-Style governance indexed by [Tally](http://www.withTally.com) indexers and added to the website, please [contact us](//dennison@withTally.com).

**What we will accomplish:** 

1. Review components of Compounds Governance system
2. Write a script that deploys Compounds Governance contracts to a network of your choice
3. Create a CLI task in HardHat that allows you to deploy secure governance's from the command line

**Resources:** 

[Complete source code](https://github.com/withtally/Tutorial-Deploy-Governance) for this tutorial

Check out recent votes and proposals on Compound with [Tally](http://www.withTally.com)

[Tally Discord](https://discord.gg/Shx5Yjzqwm)

[Compounds Documentation](https://compound.finance/docs)

[HardHat](https://hardhat.org/getting-started/)

**Why Compound?** 

Compound COMP governance system is one of the best in DeFi. It backs billions of dollars and its community regularly [proposes and votes](https://www.withtally.com/governance/compound) on changes via its governance. It is also the same governance tool used by [Uniswap](https://www.withtally.com/governance/uniswap) for governance and also backs billions of dollars. The system is comprised of three basic contracts, is easy to reason about, and has been very closely audited.

## Background

### The Compound Github

All of the code required to launch your own governance can be found on the Compound Github.

[https://github.com/compound-finance/compound-protocol/tree/master/contracts](https://github.com/compound-finance/compound-protocol/tree/master/contracts)

The three contract we are interested in are: 

**[Comp](https://github.com/compound-finance/compound-protocol/blob/master/contracts/Governance/Comp.sol)**

**[GovernorAlpha](https://github.com/compound-finance/compound-protocol/blob/master/contracts/Governance/GovernorAlpha.sol)**

**[Timelock](https://github.com/compound-finance/compound-protocol/blob/master/contracts/Timelock.sol)**

### **COMP**

[https://github.com/compound-finance/compound-protocol/blob/master/contracts/Governance/Comp.sol](https://github.com/compound-finance/compound-protocol/blob/master/contracts/Governance/Comp.sol)

The COMP contract is what creates the COMP token. It is an ERC20 compatible token with support for checkpoints. Checkpointing is a system by which you can check the token balance of any user at any particular point in history. This is important because when a vote comes up that users need to vote on, you don't want individuals buying or selling tokens specifically to change the outcome of the vote and then dumping straight after a vote closes. To avoid this, checkpoints are used. By the time someone creates a proposal and puts it up for a vote in the Compound ecosystem, the voting power of all token holders is already known, and fixed, at a point in the past. This way users can still buy or sell tokens, but their balances won't affect their voting power. 

### **GovernorAlpha**

[https://github.com/compound-finance/compound-protocol/blob/master/contracts/Governance/GovernorAlpha.sol](https://github.com/compound-finance/compound-protocol/blob/master/contracts/Governance/GovernorAlpha.sol)

The GovernorAlpha contract is the contract that does the actual "governance" part of the ecosystem. There are a number of hard-coded parameters that decide the functionality of governance, and the contract itself is the tool by which proposals are proposed, voted upon, and transferred to a timelock to be executed. The logic for secure voting is handled here. 

### **Timelock**

[https://github.com/compound-finance/compound-protocol/blob/master/contracts/Timelock.sol](https://github.com/compound-finance/compound-protocol/blob/master/contracts/Timelock.sol)

The final component of the system is a Timelock. Timelock contracts essentially "delay" the execution of transactions to give the community a chance for a "sanity check" to be  run over the outcome of a vote. It's important if a last minute bug is found in the system and it needs to be caught before a transaction is implemented.

All three of these components work together with their own sphere of influence. The COMP token essentially functions as a voter registration tool (and as a tradable ERC20 token), the GovernorAlpha acts as a polling location- the place where voting happens, and the Timelock acts as a loading bay that holds decision for a set amount of time before executing them on the network. 

### Get the Source Code

First we need to get the COMP source code. There are two options for this to be sure you're getting the audited and deployed Code: The [Compound Github](https://github.com/compound-finance), or Etherscan via the [Compound Finance Doc's](https://compound.finance/docs). 

**Etherscan:** 

If you go the etherscan route, to get the addresses of the deployed Compound contracts visit [https://compound.finance/docs](https://compound.finance/docs).

Since all Compound Finance code has been verified on Etherscan (don't use any code that isn't verified for a real project!) we can flip over to the contract information to see the source code and copy it. 

**For reference:** 

COMP: [https://etherscan.io/address/0xc00e94cb662c3520282e6f5717214004a7f26888](https://etherscan.io/address/0xc00e94cb662c3520282e6f5717214004a7f26888)

Governance: [https://etherscan.io/address/0xc0da01a04c3f3e0be433606045bb7017a7323e38](https://etherscan.io/address/0xc0da01a04c3f3e0be433606045bb7017a7323e38)

Timelock: [https://etherscan.io/address/0x6d903f6003cca6255d85cca4d3b5e5146dc33925](https://etherscan.io/address/0x6d903f6003cca6255d85cca4d3b5e5146dc33925)

## Create your project

**Requirements:** 

You will need to have `node` installed on your machine. We will be using [HardHat](https://hardhat.org/getting-started/) for our scripting and deployment needs. 

**Get Started:**

First we are going to create a directory for our project: 

`mkdir tutorial-governance` 

then CD into it: 

`cd tutorial-governance`

We will want to initialize our node project: 

`npm init -y`

The "-y" will pre-populate our `.json` file. 

Now we want to setup our HardHat project: 

`npx hardhat`

This will setup our initial HardHat Project with some defaults.

- Create a sample Project
- Accept the project root
- Accept creating a .gitignore
- Accept installing the sample project dependencies

At this point you might want to spend a couple minutes inspecting the HardHat setup if this is your first time working with it. 

Check out this guide for more info: [https://hardhat.org/getting-started/](https://hardhat.org/getting-started/)

### Create the files

We will be creating three files in our `/contracts` folder: `COMP.sol` `Timelock.sol` `GovernorAlpha.sol`. You can take these files directly from the Compound Github or copy from the verified code in Etherescan. 

There will be a leftover file from the HardHat install called `Greeter.sol` in the contracts directory. You can delete this. 

When you are finished your `/contracts` folder should have three contracts in it. 

```markdown
/Contracts
	COMP.sol
	Timelock.sol
	GovernorAlpha.sol
```

**CUSTOMIZE and COMPILE** 

The next step is to compile our contracts, but before we do that we need to configure our Solidity Compiler version. Compounds contracts were compiled with Solidity version: 0.5.16, which is significantly older than the default 0.7.3 which is found in the default HardHat configuration. You can update the Compound files be compatible with the latest compiler, but you will lose the implied security guarantees of the existing audited code if you do that. 

At the top level of your project find the file:

`hardhat.config.js`

At the bottom of the file you will find an exports that includes the Solidity compiler version: 

```jsx
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.3",
};
```

Here change the "0.7.3" to "0.5.16" so the exports looks like this: 

```jsx
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.5.16",
};
```

Now we are ready to compile and this is where HardHat makes the development process so simple.  (Note, make sure you have deleted the `Greeter.sol` contract or else the mismatch in Solidity compile versions will prevent you from compiling). 

`npx hardhat compile`

You should see this output: 

```markdown
❯ npx hardhat compile
Compiling 3 files with 0.5.16
contracts/COMP.sol:6:1: Warning: Experimental features are turned on. Do not use experimental features on live deployments.
pragma experimental ABIEncoderV2;
^-------------------------------^

Compilation finished successfully
```

Easy!

**Customizing Parameters**

A number of parameters in the Compound system are hard coded, these parameters you will most likely want to customize for your installation: 

### **COMP**

```jsx
contract Comp {
    /// @notice EIP-20 token name for this token
    string public constant name = "MyTokenName";

    /// @notice EIP-20 token symbol for this token
    string public constant symbol = "MTN";

    /// @notice EIP-20 token decimals for this token
    uint8 public constant decimals = 18;

    /// @notice Total number of tokens in circulation
    uint public constant totalSupply = 10000000e18; // 10 million myTokens
```

In the COMP contract the constants we might want to alter are right at the top of the file: 

`name`

`symbol`

`decimals` 

`totalSupply`

These are standard ERC20 properties, the Name, and Symbol (for exchanges that list the token), the decimals, and total supply. In this case, you don't want to alter the `decimals`, the ecosystem has made `18` the standard, and using a different number can cause problems or incompatibilities with the rest of the ERC20 ecosystem. 

Feel free to change `name`, `symbol` and `totalSupply` to whatever you like and run `npx hardhat compile` once again. 

### **GovernorAlpha.sol**

The next step is to customize `GovernorAlpha` contract. At the top of the source code file: `/contracts/GovernorAlpha.sol` that you created earlier with the copy-paste code from etherscan you should see the following: 

```jsx
contract GovernorAlpha {
    /// @notice The name of this contract
    string public constant name = "Compound Governor Alpha";

    /// @notice The number of votes in support of a proposal required in order for a quorum to be reached and for a vote to succeed
    function quorumVotes() public pure returns (uint) { return 400000e18; } // 400,000 = 4% of Comp

    /// @notice The number of votes required in order for a voter to become a proposer
    function proposalThreshold() public pure returns (uint) { return 100000e18; } // 100,000 = 1% of Comp

    /// @notice The maximum number of actions that can be included in a proposal
    function proposalMaxOperations() public pure returns (uint) { return 10; } // 10 actions

    /// @notice The delay before voting on a proposal may take place, once proposed
    function votingDelay() public pure returns (uint) { return 1; } // 1 block

    /// @notice The duration of voting on a proposal, in blocks
    function votingPeriod() public pure returns (uint) { return 17280; } // ~3 days in blocks (assuming 15s blocks)
```

Here the items that interest us for customization are: 

`name` 

`quorumVotes()` 

`proposalThreshold()`

`proposalMaxOperations()`

`votingDelay()`

`votingPeriod()`

**Name**: This self explanatory, change it to whatever you would like. 

**QuorumVotes (`quorumVotes()`)** 

The quorum is the number of **YES** votes required to ensure that a vote is valid. The idea behind this is that some minimum number of votes need to be cast in order for the vote to be seen as legitimate: it wouldn't make sense if in an ecosystem of 10 million possible votes a proposal passed 2 yes votes to 1 no vote. In the Compound ecosystem at least 400,000 COMP are required to vote yes for a proposal to pass. In todays money ($155 per comp) thats over $60 Million dollars worth of votes needed to get something to pass. Needless to say, if you customize this, you will want to pick a number you feel is reasonable for your system. 

**ProposalThreshold (`proposalThreshold()`)** 

To prevent a system where countless spam proposals are created, a proposal threshold requires an address has a certain number of votes before they can make a proposal. In the case of COMP, it's 100,000. Pick a number that works for you. 

**ProposalMaxOperations ( `proposalMaxOperations()`)** 

This is the maximum number of operations that can be executed in a single proposal. Unless you have a good reason, I would probably leave this alone. 

**VotingDelay (`votingDelay()`)**

 ********This is the length of time between which a proposal can be created and it is available to be voted upon. By requiring at least one block to pass, the governance is protected from Flash Loan attacks that might borrow a large number of tokens, propose a vote, and vote on it all in one block. Unless you have a good reason, I would leave this alone. 

**VotingPeriod ( `votingPeriod()`)** 

The length of time for which proposals are available to be voted upon, with time in Ethereum Blocks. Pick what you feel is reasonable for use case. 

### **TimeLock.sol**

Looking at your `Timelock.sol` source code you will see there is first a `SafeMath` library contract at the top of your file. The `Timelock` contract starts at line 171. There you will see the following: 

```jsx
contract Timelock {
    using SafeMath for unit;

   [...list of events omitted for clarity]

    uint public constant GRACE_PERIOD = 14 days;
    uint public constant MINIMUM_DELAY = 2 days;
    uint public constant MAXIMUM_DELAY = 30 days;
```

The constants available to modify are: 

`GRACE_PERIOD`

`MINIMUM_DELAY`

`MAXIMUM_DELAY`

**GRACE_PERIOD -** Once a transaction has been loaded into a timelock for execution, it is required that someone still "press the button" to have it execute and pay the gas required. The `GRACE_PERIOD` is essentially how long between the time at which a transaction becomes available to execute, and when  the proposal had intended the transaction to be executed (the `eta` component on a Proposal- see line 140 on `COMP.sol`). After the `GRACE_PERIOD` and `eta` combined expire, the transaction is considered stale (see line 255 `Timelock.sol`) and is not possible to execute. 

**MINIMUM_DELAY & MAXIMUM_DELAY -** When deploying the `Timelock.sol` contract, one of the constructor arguments is `delay` (see: line 195 `Timlock.sol`). The `MINIMUM_DELAY` & `MAXIMUM_DELAY` serve to set as hardcoded limits on how long the `Timelock` contract needs to wait before executing a transaction. 

In general, I would recommend leaving these set as they are, but again- if you need something different feel free to customize them. Once you're set, run `npx hardhat compile` again. 

## **Deployment**:

To deploy a contract using HardHat, we need to first write a script. When we first created our project HardHat created a sample script for us, but we're going to start from scratch. To deploy a COMP governance system we need to deploy our contracts in a specific order as some contracts need the address of the others in their constructor functions: 

First, we will deploy COMP, the token. For this our constructor only needs the address of where to send the initial (fixed) token supply.

Create a `Deploy.js` file in your `/scripts` folder, copy/paste the following code: 

```jsx
const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {

	// Compile our Contracts, just in case
  await hre.run('compile');

	// Get a signer from the HardHard environment
	// Learn about signers here: https://docs.ethers.io/v4/api-wallet.html
  const [tokenRecipient] = await ethers.getSigners();

  // This gets the contract from 
  const Token = await hre.ethers.getContractFactory("Comp");
  const token = await Token.deploy(tokenRecipient.address);

  await token.deployed();
  console.log(`Token deployed to: ${token.address}`);
  

  const initialBalance = await token.balanceOf(tokenRecipient.address);
  console.log(`${initialBalance / 1e18} tokens transfered to ${tokenRecipient.address}`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
```

To run it using the built in HardHard environment blockchain use: 

`npx hardhat run scripts/Deploy.js`

You should see the following output (Your addresses and token balance might be different)

```markdown
❯ npx hardhat run scripts/Deploy.js
Nothing to compile
Token deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
10000000 tokens transfered to 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

Great! We've just deployed our COMP token to an ephemeral development blockchain that exists only inside this running program instance. (We will get to deploying to a real network later). 

**Timelock**

Next we will deploy the Timelock because the governance needs to know the Timelock address. 

First, lets get another address to be the Timelock admin, change line: 

```jsx
const [tokenRecipient] = await ethers.getSigners();
```

to get another signer

```jsx
const [tokenRecipient, timelockAdmin] = await ethers.getSigners();

```

Now that we have a signer to be our `Timelock` admin, we can choose a delay between our `MINIMUM_DELAY` and `MAXIMUM_DELAY` constants, and pass that in. 

Add to our file, after the line where we `await token.deployed()` the following: 

```jsx
		// deploy timelock 
		const delay = 5;
    const Timelock = await ethers.getContractFactory("Timelock");
    const timelock = await Timelock.deploy(timelockAdmin.address, delay);
    await timelock.deployed();
    await timelock.deployTransaction.wait();
		// A nice sanity check to see the address
    console.log(`TimeLock deployed to: ${timelock.address}`);
```

Run `npx hardhat run scripts/Deploy.js` again. 

NOTE: If you get the following error: `Error: VM Exception while processing transaction: revert Timelock::constructor: Delay must exceed minimum delay.` This means your deployment of Timelock didn't go through because the delay you chose wasn't between your `MINIMUM_DELAY` and `MAXIMUM_DELAY`. The trick is though that in the code, these days are specified in **DAYS**, which Solidity estimates in SECONDS. The delay you send in to the constructor is denoted in seconds, so you have to choose a number of seconds that represents the time in days you want to use as a delay. So if you want **5** days instead of 5 seconds in the example above you would do: 5*60*60*24= **432,000**, and you would use that number for your delay instead.

 ****Run `npx hardhat run scripts/Deploy.js` again and it should work. 

**GovernorAlpha**

Now that you've deployed your governance token, your timelock contract, it's time to deploy the GovernorAlpha contract. 

To deploy we will use the same pattern as above. First let's get another signer, a "Guardian", an address that has the power to cancel proposals (use this wisely!). 

```jsx
const [tokenRecipient, timelockAdmin, guardian] = await ethers.getSigners();
```

Now add the following code after the Timelock gets deployed: 

```jsx
		// Deploy Governance
    const Gov = await ethers.getContractFactory("GovernorAlpha");
    const gov = await gov.deploy(timelock.address, token.address, guardian.address);
    await gov.deployed();
    await gov.deployTransaction.wait();

		...
		console.log(`GovernorAlpha deployed to: ${gov.address}`)
```

The full code so far is: 

```jsx
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
    const gov = await Gov.deploy(timelock.address, token.address, guardian.address);
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
```

# Deploy to Network:

Now that we have this working, deploying to a real network requires only two things: 

1. Changes to the `hardhat.config.js` file to add a new network
2. Private keys to the addresses you with to use as Signers. 

**Update the `hardhat.config.js` file**

To deploy to a network using HardHat we need to first give it some information about the network we want to deploy to. In our case, we are deploying to `Rinkeby` and we're going to use Infura as our network connection. (Sign up at [Infura](https://infura.io/) to get your own API key).

We will also need some private keys, which unfortunately even in 2020 (going on 2021), is still the most cumbersome part of the deployment. 

Add a `networks` property to your  `hardhat.config.js` file exports and as a sub-property add your network (in our case `Rinkeby`) along with an array of private keys.

```jsx
module.exports = {
  networks: {
    rinkeby: {
      url: "https://rinkeby.infura.io/v3/<<Your infura Key>>",
      accounts: ["PrivateKey1", "PrivateKey2", "PrivateKey3"]
    }
  },
  solidity: "0.5.16",
};
```

Now to deploy to your network you type: 

```jsx
npx hardhat run scripts/Deploy.js --network rinkeby
```

## **Create a Task**

Finally, we're using HardHat because it helps automate deployments. Let's create a task so we can deploy our governance directly from the command line. 

Inside your `hardhat.config.js` file, we will add the following task, below the already existing sample task (delete the sample task if you like) 

```markdown
task("Deploy", "Deploys a COMPound style governance system", async () => {
..... we will fill this out.

});
```

Lets reuse our code that we wrote in our script, the goal is to make the deployment script modular and export the function so we can import it in our task. 

```markdown
// Delete this as it will cause our task to run twice
// main()
//     .then(() => process.exit(0))
//     .catch(error => {
//         console.error(error);
//         process.exit(1);
//     });

// Add a module.exports 
module.exports = {
        deploy: main
    }
```

Additionally, we're going to want to pass in the address for the initial token holder, guardian, etc.., so that it's not based on `ethers.getSigners()` which comes from our config file (and requires private keys!)  

Lets pass in an object `{tokenRecipient, timeLockAdmin, guardian}` into our `main()` function so that it looks like this: 

```markdown
async function main({tokenRecipient, timeLockAdmin, guardian})
```

Unlike the output from `getSigners()` these variables will not be signers- there won't be private keys attached, so there will be no `.address` property, instead their value is the address. Remove the `.address` from just these three variables when they are passed into the deployment functions. Your new code should look like this: 

```jsx
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
```

Now we need to add to the HardHat task the ability to get `tokenRecipient`, `timeLockAdmin`, `guardian` from the command line and pass it to our `main` function. To do this, HardHard allows you to collect Params directly from the command line using the `.addParam()` function and access it inside the task. 

Update the task to look like this:

```jsx
task("Deploy", "Deploys a COMPound style governance system")
.addParam("token", "The address to receive the initial supply")
.addParam("timelock", "The timelock administrator")
.addParam("guardian", "The governor guardian").setAction(async taskArgs => {
    
  const { deploy } = require("./scripts/Deploy");

    await deploy({
      tokenRecipient: taskArgs.token,
      timeLockAdmin: taskArgs.timelock,
      guardian: taskArgs.guardian
    });

})
```

Now to deploy you need only one private key in your `module.exports` in the `hardhat.config.js` file, this private key is used to deploy the contracts, but even if it's compromised, your governance system isn't in danger as they key addresses for the governance system are entered on the CLI. It also means you can deploy as many governance systems as you like, quickly and easily, from the CLI. 

To deploy: 

`npx hardhat Deploy --token 0xAddressToReceivetokens --timelock 0xAddressTimeLockAdmin --guardian 0xAddressGovernorAlphaAdmin --network rinkeby`

You can see the final code here: 

[https://github.com/withtally/Tutorial-Deploy-Governance](https://github.com/withtally/Tutorial-Deploy-Governance)