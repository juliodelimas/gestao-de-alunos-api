import ApiError from '../utils/ApiError.js';

export default function loginRequest(req, res, next) {
  try {
    req.app.locals.loginProtection?.checkIp(req.ip);
    if (!/^application\/json\s*(?:;|$)/i.test(req.headers['content-type'] || '')) {
      throw new ApiError(415, 'Use Content-Type application/json.');
    }
    next();
  } catch (error) { next(error); }
}
