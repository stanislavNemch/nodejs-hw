import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  requestResetEmail,
  resetPassword,
} from '../controllers/authController.js';
import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validations/authValidation.js';

const router = Router();

// /auth/register
router.post('/register', celebrate(registerUserSchema), registerUser);

// /auth/login
router.post('/login', celebrate(loginUserSchema), loginUser);

// /auth/refresh
router.post('/refresh', refreshUserSession);

// /auth/logout
router.post('/logout', logoutUser);

// POST /auth/request-reset-email
router.post(
  '/request-reset-email',
  celebrate(requestResetEmailSchema),
  requestResetEmail,
);

// POST /auth/reset-password
router.post(
  '/auth/reset-password',
  celebrate(resetPasswordSchema),
  resetPassword,
);

export default router;
