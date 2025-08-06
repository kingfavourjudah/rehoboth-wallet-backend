import swaggerJsdoc from "swagger-jsdoc";

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Wallet Backend API",
      version: "1.0.0",
      description: "Documentation for your modular wallet backend (Stellar + others)",
    },
    servers: [
      {
        url: "http://localhost:3000", // Change to your base URL
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Path to your route files
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
