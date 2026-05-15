export type Environment = 'dev' | 'qa' | 'preprod' | 'prod';

export interface EnvironmentConfig {
  baseURL: string;
  apiBaseURL?: string;
}

// trade.mb.io is the trading app and requires authentication — it is not the public site.
// All public-facing pages (home, explore, company, etc.) are served from mb.io.
const configs: Record<Environment, EnvironmentConfig> = {
  dev:     { baseURL: 'https://mb.io' },
  qa:      { baseURL: 'https://mb.io' },
  preprod: { baseURL: 'https://mb.io' },
  prod:    { baseURL: 'https://mb.io' },
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
