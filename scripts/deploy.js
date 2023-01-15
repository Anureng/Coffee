
const hre = require("hardhat");

async function main() {


  const Coffee = await hre.ethers.getContractFactory("Coffee");
  const coffee = await Coffee.deploy();

  await coffee.deployed();

  console.log(
    `Lock with 1 ETH and deployed to ${coffee.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


// 0x043dF69FAe188fA4516A0E5cA0FA1c126d009FC4