import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';

const povidersRouter = Router();

povidersRouter.use(ensureAuthenticated);
const providersController = new ProvidersController();

povidersRouter.get('/', providersController.index);

export default povidersRouter;
