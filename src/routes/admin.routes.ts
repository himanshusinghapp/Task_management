import Joi from 'joi';
import { Router } from 'express';
import { AdminController } from '@controllers';
import { Auth, Validate,BasicAuth } from '@middlewares';
import { ROLE } from '@/common/constants';

const router = Router();
const controller = new AdminController();

const userIdParam = Joi.object({
  userId: Joi.string().required(),
});

router.post(
  '/login',
  BasicAuth.public(),
  Validate.body(
    Joi.object({
      email: Joi.string().trim().email().max(100).required(),
      password: Joi.string().trim().max(100).required(),
    })
  ),
  controller.login
);

router.get('/profile', Auth.authenticate([ROLE.ADMIN]), controller.getProfile);
router.delete('/logout', Auth.authenticate([ROLE.ADMIN]), controller.logout);
router.get('/users', Auth.authenticate([ROLE.ADMIN]), controller.getAllUsers);

router.patch(
  '/block/:userId',
  Auth.authenticate([ROLE.ADMIN]),
  Validate.params(userIdParam),
  controller.blockUser
);

router.patch(
  '/unblock/:userId',
  Auth.authenticate([ROLE.ADMIN]),
  Validate.params(userIdParam),
  controller.unblockUser
);

const searchQuery = Joi.object({
  query: Joi.string().trim().min(1).max(100).required(),
});

router.get(
  '/search',
  Auth.authenticate([ROLE.ADMIN]),
  Validate.query(searchQuery),
  controller.searchUsers
);

export default router;