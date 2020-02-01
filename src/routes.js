import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliveryManController from './app/controllers/DeliveryManController';
import PackageController from './app/controllers/PackageController';
import DeliveryController from './app/controllers/DeliveryController';
import FileController from './app/controllers/FileController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import NotificationController from './app/controllers/NotificationController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);
routes.post('/delivery/:delivery_id/problems', DeliveryProblemController.store);
routes.post(
  '/problem/:delivery_id/cancel-delivery',
  DeliveryProblemController.cancelDelivery
);

routes.get('/deliveryman/:deliveryman_id/deliveries', DeliveryController.index);
routes.get(
  '/deliveryman/:deliveryman_id/deliveries/new',
  DeliveryController.indexNewPackages
);
routes.get('/delivery/problems', DeliveryProblemController.indexAll);
routes.get('/delivery/:delivery_id/problems', DeliveryProblemController.index);

routes.put('/deliveries/:id', DeliveryController.update);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.post('/deliverymen', DeliveryManController.store);
routes.post('/packages', PackageController.store);
routes.post('/files', upload.single('file'), FileController.store);

routes.get('/recipients', RecipientController.index);
routes.get('/deliverymen', DeliveryManController.index);
routes.get('/packages', PackageController.index);
routes.get('/notifications', NotificationController.index);

routes.put('/recipients/:id', RecipientController.update);
routes.put('/deliverymen/:id', DeliveryManController.update);
routes.put('/packages/:id', PackageController.update);
routes.put('/notifications/:id', NotificationController.update);

routes.delete('/recipients/:id', RecipientController.delete);
routes.delete('/deliverymen/:id', DeliveryManController.delete);
routes.delete('/packages/:id', PackageController.delete);

module.exports = routes;
