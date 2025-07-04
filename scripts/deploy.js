async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Ganti dengan alamat token ERC20 yang ingin digunakan
    const token1 = "0x4a08e2252C55fd3bE632Ff79724194D8c1831ECF";
    const token2 = "0xBaE7D093d86cdE1e5FB35936294824638f0358d4";

    const DexHKA = await ethers.getContractFactory("DexHKA");
    const dexHKA = await DexHKA.deploy(token1, token2);
    await dexHKA.deployed();
    console.log("DexHKA deployed to:", dexHKA.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});