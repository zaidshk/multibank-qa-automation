export type Environment = 'dev' | 'qa' | 'preprod' | 'prod';

export interface EnvironmentConfig {
  baseURL: string;
  apiBaseURL?: string;
}

// Update dev/preprod URLs when environment-specific hostnames are provisioned.
const configs: Record<Environment, EnvironmentConfig> = {
  dev: { baseURL: 'https://trade.mb.io' },
  qa: { baseURL: 'https://trade.mb.io' },
  preprod: { baseURL: 'https://trade.mb.io' },
  prod: { baseURL: 'https://trade.mb.io' },
};

const VALID_ENVS: readonly Environment[] = ['dev', 'qa', 'preprod', 'prod'];

export function resolveEnvConfig(): EnvironmentConfig {
  const env = (process.env['ENV'] ?? 'qa') as Environment;

  if (!VALID_ENVS.includes(env)) {
    throw new Error(`Invalid ENV "${env}". Accepted values: ${VALID_ENVS.join(', ')}.`);
  }

  return configs[env];
}

export function currentEnvironment(): Environment {
  return (process.env['ENV'] ?? 'qa') as Environment;
}
