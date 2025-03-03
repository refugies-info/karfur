const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
  },
};

export default config;
