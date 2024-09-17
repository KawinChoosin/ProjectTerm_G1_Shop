export default {
  server: {
    proxy: {
      "/api": {
        target: "http://g1-backend:3000", // Use Docker service name instead of localhost
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    host: "0.0.0.0",
    port: 5173,
  },
};
