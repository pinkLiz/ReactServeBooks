import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

const options: swaggerJSDoc.Options = {
  swaggerDefinition: {
    openapi: "3.0.2",
    tags: [
      {
        name: "Libros",
        description: "Operaciones de API PERN con libros",
      }
    ],

    info: {
      title: "REST API Node.js / Express / Typescript",
      version: "1.0.0",
      description: "API Documentacion para libros",
    },
  },
  apis: ["./src/router.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerUiOptions: SwaggerUiOptions = {
  customCss: `
        .topbar-wrapper .link {
            content: url('https://img.freepik.com/vector-gratis/icono-aislado-biblioteca-libros-texto_24877-83372.jpg?semt=ais_hybrid&w=740&q=80');
            height: 80px;
            width: auto;
        }
        .swagger-ui .topbar {
            background-color: #2b3b45;
        }
    `,
  customSiteTitle: "Documentación REST API Express / TypeScript",
};

export default swaggerSpec;

export { swaggerUiOptions };
