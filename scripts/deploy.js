async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy dua mock token ERC20
    const ERC20 = await ethers.getContractFactory("MockERC20");
    const token1 = await ERC20.deploy("Token1", "TK1", 1000000);
    const token2 = await ERC20.deploy("Token2", "TK2", 1000000);
    await token1.waitForDeployment();
    await token2.waitForDeployment();

    // Deploy DexHKA dengan alamat kedua token
    const DexHKA = await ethers.getContractFactory("DexHKA");
    const dexHKA = await DexHKA.deploy(token1.target, token2.target);
    await dexHKA.waitForDeployment();

    console.log("DexHKA deployed to:", dexHKA.target);
    console.log("Token1:", token1.target);
    console.log("Token2:", token2.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});