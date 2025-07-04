async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const DexHKA = await ethers.getContractFactory("DexHKA");
    const dexHKA = await DexHKA.deploy();
    await dexHKA.deployed();
    console.log("DexHKA deployed to:", dexHKA.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});