const { ethers, network } = require("hardhat")
const fs = require("fs")

FRONT_END_ABI_FILE = "../my-app/constants/abi.json"
FRONT_END_ADDRESSES_FILE = "../my-app/constants/contractAddress.json"

module.exports = async function () {
    if (process.env.UPDATE_FRONT_END) {
        console.log("Updating front end......")
        await updateContractAddresses()
        await updateAbi()
        console.log("front-end updated")
    }
}

async function updateAbi() {
    const whitelist = await ethers.getContract("Whitelist")
    fs.writeFileSync(FRONT_END_ABI_FILE, whitelist.interface.format(ethers.utils.FormatTypes.json))
    console.log("hu")
}

async function updateContractAddresses() {
    const whitelist = await ethers.getContract("Whitelist")
    const chainId = network.config.chainId.toString()
    const currentAddresses = JSON.parse(fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8"))
    if (chainId in currentAddresses) {
        if (!currentAddresses[chainId].includes(whitelist.address)) {
            currentAddresses[chainId].push(whitelist.address)
            console.log("hi")
        }
    }
    {
        currentAddresses[chainId] = [whitelist.address] // if chainId is not present
    }
    fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses))
}

module.exports.tags = ["all", "frontend"]
