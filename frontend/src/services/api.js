export const BASE_URL = 'https://api.moonfinanceme.com.br';

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error('API Error:', error);
    return { status: 500, data: { success: false, message: 'Erro de conexão com o servidor.' } };
  }
};
