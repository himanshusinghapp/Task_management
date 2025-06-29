import { Router } from 'express';
import { UserController } from '@controllers/user.controller';
import { Auth } from '@middlewares/auth.middleware';
import { BasicAuth } from '@middlewares/basicAuth';
import { Validate } from '@middlewares/validate';
import Joi from 'joi';
import { USER_MESSAGES } from '@common/constants/userMessage';

const router = Router();
const controller = new UserController();

router.post(
  '/request-email-verification',
  BasicAuth.public(),
  Validate.middleware(
    Joi.object({
      email: Joi.string().trim().email().max(100).required(),
    })
  ),
  controller.requestEmailVerification
);

router.post(
  '/verify-email-otp',
  BasicAuth.public(),
  Validate.middleware(
    Joi.object({
      email: Joi.string().trim().email().max(100).required(),
      otp: Joi.string().trim().length(6).required(),
    })
  ),
  controller.verifyEmailOtp
);

router.post(
  '/complete-signup',
  BasicAuth.public(),
  Validate.middleware(
    Joi.object({
      name: Joi.string().trim().min(3).max(100).required(),
      email: Joi.string().trim().email().max(100).required(),
      password: Joi.string()
        .min(8)
        .max(100)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'))
        .message(USER_MESSAGES.PASSWORD_POLICY)
        .required(),
    })
  ),
  controller.completeSignup
);

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

router.post(
  '/forgot-password',
  BasicAuth.public(),
  Validate.middleware(
    Joi.object({
      email: Joi.string().trim().email().max(100).required(),
    })
  ),
  controller.forgotPassword
);

router.post(
  '/reset-password',
  BasicAuth.public(),
  Validate.middleware(
    Joi.object({
      userId: Joi.string().required(),
      otp: Joi.string().trim().length(6).required(),
      newPassword: Joi.string()
        .min(8)
        .max(100)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'))
        .message(USER_MESSAGES.PASSWORD_POLICY)
        .required(),
    })
  ),
  controller.resetPassword
);

router.get('/profile', Auth.authenticate('user'), controller.getProfile);

router.put(
  '/profile',
  Auth.authenticate('user'),
  Validate.middleware(
    Joi.object({
      name: Joi.string().trim().min(3).max(100).optional(),
      email: Joi.string().trim().email().max(100).optional(),
    })
  ),
  controller.editProfile
);

router.post(
  '/change-password',
  Auth.authenticate('user'),
  Validate.middleware(
    Joi.object({
      oldPassword: Joi.string().max(100).required(),
      newPassword: Joi.string()
        .min(8)
        .max(100)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'))
        .message(USER_MESSAGES.PASSWORD_POLICY)
        .required(),
    })
  ),
  controller.changePassword
);

router.delete('/logout', Auth.authenticate('user'), controller.logout);

export default router;
