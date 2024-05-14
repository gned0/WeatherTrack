const swaggerJSDoc = require("swagger-jsdoc");
const fs = require("fs");
const yamljs = require("yamljs");

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "WeatherTrack",
      version: "1.0.0",
      description: "API for the WeatherTrack system",
    },
    servers: [
      {
        url: "http://localhost:3000", 
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js"], 
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

fs.writeFileSync("./swagger.json", JSON.stringify(swaggerSpec, null, 2));
