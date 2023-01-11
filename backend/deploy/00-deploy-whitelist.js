module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deployer } = await getNamedAccounts()
    const { deploy, log } = deployments

    const whitelist = await deploy("Whitelist", {
        from: deployer,
        log: true,
        args: [],
    })
    log("--------------------")
}

module.exports.tags = ["all"]
