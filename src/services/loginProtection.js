import ApiError from '../utils/ApiError.js';

// Single Node process, as deployed in this educational project. Synchronous map
// updates and per-account queues prevent races. Multiple workers need a shared store.
export function createLoginProtection({ now = Date.now } = {}) {
  const ips = new Map(), failures = new Map(), queues = new Map();
  const blocked = (until) => {
    const error = new ApiError(429, 'Muitas tentativas. Tente novamente mais tarde.');
    error.retryAfter = Math.max(1, Math.ceil((until - now()) / 1000));
    return error;
  };
  function prune(map) {
    for (const [key, value] of map) if (value.until <= now()) map.delete(key);
  }
  return {
    reset() { ips.clear(); failures.clear(); },
    checkIp(ip) {
      prune(ips);
      const state = ips.get(ip) || { count: 0, until: now() + 60_000 };
      if (state.count >= 30) throw blocked(state.until);
      state.count += 1;
      ips.set(ip, state);
    },
    async account(email, task) {
      const previous = queues.get(email) || Promise.resolve();
      let release;
      const ticket = new Promise((resolve) => { release = resolve; });
      queues.set(email, ticket);
      await previous;
      try {
        prune(failures);
        const state = failures.get(email);
        if (state?.count >= 5) throw blocked(state.until);
        try {
          const result = await task();
          failures.delete(email);
          return result;
        } catch (error) {
          if (error.statusCode === 401) {
            const updated = state || { count: 0, until: now() + 15 * 60_000 };
            updated.count += 1;
            failures.set(email, updated);
          }
          throw error;
        }
      } finally {
        release();
        if (queues.get(email) === ticket) queues.delete(email);
      }
    },
  };
}
