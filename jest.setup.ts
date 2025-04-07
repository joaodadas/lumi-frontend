import '@testing-library/jest-dom';

// Mock import.meta.env para não quebrar durante testes
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_BASE_URL: 'http://localhost:3000',
  },
});
