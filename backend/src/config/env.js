import 'dotenv/config';

const requiredVariables = [
  'MONGO_URI',
  'PORT',
  'CLIENT_URL'
];

export const validateEnvironment = () => {
  const missingVariables = requiredVariables.filter(
    (variable) => {
      return !process.env[variable]?.trim();
    }
  );

  if (missingVariables.length > 0) {
    throw new Error(
      `Missing environment variables: ${missingVariables.join(', ')}`
    );
  }

  const port = Number(process.env.PORT);

  if (
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  ) {
    throw new Error(
      'PORT must be a valid port number between 1 and 65535.'
    );
  }

  try {
    new URL(process.env.CLIENT_URL);
  } catch {
    throw new Error('CLIENT_URL must be a valid URL.');
  }

  if (!process.env.MONGO_URI.trim()) {
    throw new Error('MONGO_URI cannot be empty.');
  }

  return true;
};