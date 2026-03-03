import { Platform } from 'react-native';

// On Android emulator, localhost points to the emulator itself.
// Use 10.0.2.2 to reach the host machine. On iOS simulator / web, localhost works.
const BASE_URL = Platform.select({
    android: 'http://10.0.2.2:3000',
    default: 'http://localhost:3000',
});

let authToken = null;

export function setToken(token) {
    authToken = token;
}

export function clearToken() {
    authToken = null;
}

async function request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const res = await fetch(url, { ...options, headers });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || data.errors?.[0]?.msg || 'Request failed');
    }

    return data;
}

// ── Auth ──────────────────────────────────────────────────────

export async function apiLogin(email, password) {
    const data = await request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    return data;
}

export async function apiRegister(name, email, password) {
    const data = await request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
    });
    setToken(data.token);
    return data;
}

export async function apiGetMe() {
    return request('/api/auth/me');
}

// ── Results ──────────────────────────────────────────────────

export async function apiGetResults() {
    return request('/api/results');
}

export async function apiGetResult(id) {
    return request(`/api/results/${id}`);
}

export async function apiCreateResult(resultData) {
    return request('/api/results', {
        method: 'POST',
        body: JSON.stringify(resultData),
    });
}

export async function apiDeleteResult(id) {
    return request(`/api/results/${id}`, { method: 'DELETE' });
}

// ── Recommendations ──────────────────────────────────────────

export async function apiGetRecommendations(resultId) {
    return request(`/api/results/${resultId}/recommendations`);
}
