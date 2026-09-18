import ApiError from '../utils/ApiError.js';

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Keep parser errors as client errors without echoing their body/details.
  if (err.type === 'entity.parse.failed' && err.status === 400) {
    return res.status(400).json({ error: 'JSON inválido.' });
  }
  if (err.type === 'entity.too.large' && err.status === 413) {
    return res.status(413).json({ error: 'Corpo da requisição muito grande.' });
  }
  if (err instanceof ApiError) {
    if (err.retryAfter) res.set('Retry-After', String(err.retryAfter));
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error(err);
  return res.status(500).json({ error: 'Erro interno do servidor.' });
}

export default errorHandler;
