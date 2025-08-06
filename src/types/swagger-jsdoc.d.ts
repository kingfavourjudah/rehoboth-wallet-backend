// types/swagger-jsdoc.d.ts or inside your project’s types folder
declare module 'swagger-jsdoc' {
  import { OpenAPIV3 } from 'openapi-types';

  interface SwaggerJsdocOptions {
    definition: OpenAPIV3.Document;
    apis: string[];
  }

  function swaggerJsdoc(options: SwaggerJsdocOptions): OpenAPIV3.Document;

  export = swaggerJsdoc;
}
