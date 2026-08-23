import asyncHandler from '../utils/asyncHandler.js';
import authService from '../services/auth.service.js';

export const login = asyncHandler(async (req, res) => {
  res.json(await authService.login(req.body));
});
