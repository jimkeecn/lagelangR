module.exports = {
  apps: [
    {
      name: "backend-app",
      script: "./index.js",
      env: {
        PORT: 3000,
        NODE_ENV: "production",
      },
    },
  ],
};
