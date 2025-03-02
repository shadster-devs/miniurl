export interface URLEntry {
  original_url: string;
  short_code: string;
  created_at: string;
  visits: number;
}

export interface ShortenURLResponse {
  short_code: string;
  original_url: string;
}

const API_BASE_URL = 'http://localhost:8082/api/v1';

export async function shortenURL(url: string): Promise<ShortenURLResponse> {
  const response = await fetch(`${API_BASE_URL}/shorten`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to shorten URL');
  }

  return response.json();
}

export async function getURLStats(shortCode: string): Promise<URLEntry> {
  const response = await fetch(`${API_BASE_URL}/stats/${shortCode}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get URL stats');
  }

  return response.json();
}

export function getShortURL(shortCode: string): string {
  return `${API_BASE_URL}/${shortCode}`;
} 