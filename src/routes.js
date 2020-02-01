import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliveryManController from './app/controllers/DeliveryManController';
import PackageController from './app/controllers/PackageController';
import DeliveryController from './app/controllers/DeliveryController';
import FileController from './app/controllers/FileController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);
routes.get('/deliveryman/:id/deliveries', DeliveryController.index);
routes.get(
  '/deliveryman/:id/deliveries/new',
  DeliveryController.getNewPackages
);
routes.put('/deliveries/:id', DeliveryController.update);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.post('/deliverymen', DeliveryManController.store);
routes.post('/packages', PackageController.store);
routes.post('/files', upload.single('file'), FileController.store);

routes.get('/recipients', RecipientController.index);
routes.get('/deliverymen', DeliveryManController.index);
routes.get('/packages', PackageController.index);

routes.put('/recipients/:id', RecipientController.update);
routes.put('/deliverymen/:id', DeliveryManController.update);
routes.put('/packages/:id', PackageController.update);

routes.delete('/recipients/:id', RecipientController.delete);
routes.delete('/deliverymen/:id', DeliveryManController.delete);
routes.delete('/packages/:id', PackageController.delete);

module.exports = routes;
