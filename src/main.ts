import express from 'express';
import dotenv from 'dotenv';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './config/swagger.config';
import { connectDB } from './config/db';
import routes from './routes';

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

app.listen(process.env.PORT!, () => {
  console.log('Server running on port 3000');
});
