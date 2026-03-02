export const environment = {
  production: false,
  apiUrl: 'https://localhost:7200/api',
  authUrl: 'https://localhost:7200/connect/token'  // assuming OpenID Connect server
};

export const environmentProd = {
  production: true,
  apiUrl: 'https://api.shop.miscore.com/api',
  authUrl: 'https://auth.miscore.com/connect/token'
};