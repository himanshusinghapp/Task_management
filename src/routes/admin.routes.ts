import Joi from 'joi';
import { Router } from 'express';
import { AdminController } from '@controllers/admin.controller';
import { Auth } from '@middlewares/auth.middleware';
import { BasicAuth } from '@middlewares/basicAuth';
import { Validate } from '@middlewares/validate';

const router = Router();
const controller = new AdminController();

router.post(
  '/login',
  BasicAuth.public(),
  Validate.middleware(
    Joi.object({
      email: Joi.string().trim().email().max(100).required(),
      password: Joi.string().trim().max(100).required(),
    })
  ),
  controller.login
);

router.get('/profile', Auth.authenticate('admin'), controller.getProfile);
router.delete('/logout', Auth.authenticate('admin'), controller.logout);
router.get('/users', Auth.authenticate('admin'), controller.getAllUsers);

router.patch(
  '/block/:userId',
  Auth.authenticate('admin'),
  Validate.middleware(
    Joi.object({
      userId: Joi.string().required(),
    })
  ),
  controller.blockUser
);

router.patch(
  '/unblock/:userId',
  Auth.authenticate('admin'),
  Validate.middleware(
    Joi.object({
      userId: Joi.string().required(),
    })
  ),
  controller.unblockUser
);

router.get(
  '/search',
  Auth.authenticate('admin'),
  Validate.middleware(
    Joi.object({
      query: Joi.string().trim().min(1).max(100).required(),
    })
  ),
  controller.searchUsers
);

export default router;