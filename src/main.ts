import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/user.route';


import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './config/swagger.config';
import { connectDB } from './config/db';
import adminRoutes from './routes/admin.routes';
import taskRoutes from './routes/task.routes';
import projectRoutes from './routes/project.routes';
import commentRoutes from './routes/comment.routes';



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
app.use('/user', authRoutes);
app.use('/admin',adminRoutes);
app.use('/tasks',taskRoutes);
app.use('/project',projectRoutes);
app.use('/comments',commentRoutes);


// mongoose.connect(process.env.MONGO_URI!).then(() => {
//   app.listen(3000, () => console.log('Server running'));
// });
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
