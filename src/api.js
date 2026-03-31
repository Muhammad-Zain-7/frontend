const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  getGames: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/games${qs ? '?' + qs : ''}`);
  },
  placeOrder: (body) =>
    request('/api/orders', { method: 'POST', body: JSON.stringify(body) }),
  getHealth: () => request('/api/health'),
};
