var pm2Config = {
    "apps": [
        {
            "name": "index",
            "script": "index.ts",
            "exec_mode": "cluster_mode"
        }
    ]
}
module.exports = pm2Config;