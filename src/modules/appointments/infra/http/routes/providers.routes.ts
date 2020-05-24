import { Router } from 'express';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProvidersController from '../controllers/ProvidersController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';

const povidersRouter = Router();

povidersRouter.use(ensureAuthenticated);
const providersController = new ProvidersController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();

povidersRouter.get('/', providersController.index);
povidersRouter.get(
  '/:provider_id/month-availability',
  providerMonthAvailabilityController.index,
);
povidersRouter.get(
  '/:provider_id/day-availability',
  providerDayAvailabilityController.index,
);

export default povidersRouter;
