/**
 * Minimal lock abstraction used to serialize scheduling runs that touch the
 * SAME interviewer, reducing (not eliminating) race conditions before the
 * authoritative DB-level check in InterviewCreationService.
 *
 * This in-memory implementation is correct for a single Node process only.
 * For a multi-instance deployment, swap the internals for Redis:
 *   SET lock:interviewer:{id} <token> NX PX <ttlMs>
 * and release with a Lua script that checks the token before DEL, so a
 * process never releases a lock it doesn't own. The public interface
 * (acquire/release) is deliberately kept generic so that swap doesn't
 * require touching any calling code.
 */

const activeLocks = new Map(); // key -> { expiresAt }

function isExpired(entry) {
  return entry.expiresAt <= Date.now();
}

async function acquireLock(key, ttlMs = 15000) {
  const existing = activeLocks.get(key);
  if (existing && !isExpired(existing)) {
    return false; // someone else holds it
  }
  activeLocks.set(key, { expiresAt: Date.now() + ttlMs });
  return true;
}

function releaseLock(key) {
  activeLocks.delete(key);
}

/**
 * Convenience wrapper: acquire, run fn, always release.
 * Throws LockAcquisitionError if the lock can't be obtained within retries.
 */
class LockAcquisitionError extends Error {}

async function withLock(key, ttlMs, fn) {
  const acquired = await acquireLock(key, ttlMs);
  if (!acquired) {
    throw new LockAcquisitionError(`Could not acquire lock for ${key}`);
  }
  try {
    return await fn();
  } finally {
    releaseLock(key);
  }
}

export { acquireLock, releaseLock, withLock, LockAcquisitionError };
export default { acquireLock, releaseLock, withLock, LockAcquisitionError };
