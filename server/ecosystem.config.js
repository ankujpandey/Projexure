module.exports = {
    apps: [
        {
            name: "project-managment",
            script: "npm",
            args: "run dev",
            env: {
                NODE_ENV: "development",
            }
        }
    ]
}