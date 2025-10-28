// next.config.js
module.exports = {
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "n8n.tucbbs.com.ar" },
            { protocol: "https", hostname: "tu-cdn-o-s3.amazonaws.com" },
        ],
    },
};
