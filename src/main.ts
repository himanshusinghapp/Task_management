import express from 'express';
import dotenv from 'dotenv';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './config/swagger.config';
import { connectDB } from './config/db';
import routes from './routes';
import { errorHandler } from '@middlewares/errorHandler';

dotenv.config();
const app = express();
app.use(express.json());
connectDB();
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
  explorer: true,
  swaggerOptions: {
    docExpansion: 'none',
    defaultModelsExpandDepth: -1,
    displayRequestDuration: true,
    filter: true,
    showExtensions: true,
    showCommonExtensions: true,
  },
}));
app.use(routes);
app.use(errorHandler);
const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}/users`);
  console.log(`Swagger is running on http://localhost:${port}/api-docs/`);
});
