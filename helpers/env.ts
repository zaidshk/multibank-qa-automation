/**
 * Reads a required environment variable. Throws at call-site if the variable is absent,
 * giving a clear error rather than a silent undefined propagating through the run.
 */
export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Required environment variable "${key}" is not set.`);
  }
  return value;
}

/**
 * Reads an optional environment variable, returning the fallback when absent.
 */
export function optionalEnv(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}
