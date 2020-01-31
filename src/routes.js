import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliveryManController from './app/controllers/DeliveryManController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);
routes.use(authMiddleware);
routes.post('/recipients', RecipientController.store);
routes.post('/deliverymen', DeliveryManController.store);

routes.get('/recipients', RecipientController.index);
routes.get('/deliverymen', DeliveryManController.index);

routes.put('/recipients/:id', RecipientController.update);
routes.put('/deliverymen/:id', DeliveryManController.update);

routes.delete('/recipients/:id', RecipientController.delete);
routes.delete('/deliverymen/:id', DeliveryManController.delete);

module.exports = routes;
