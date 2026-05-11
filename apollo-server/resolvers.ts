const SERVICE_1 = 'http://localhost:3001';
const SERVICE_2 = 'http://localhost:3002';

export async function fetchFromService1(path: string): Promise<unknown> {
  return fetchJson(SERVICE_1, path);
}

export async function fetchFromService2(path: string): Promise<unknown> {
  return fetchJson(SERVICE_2, path);
}

async function fetchJson(baseUrl: string, path: string): Promise<unknown> {
  const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  let res: Response;
  try {
    res = await fetch(url);
  } catch (err) {
    throw new Error(
      `Failed to reach ${url}. Is the upstream service running? (${(err as Error).message})`,
    );
  }
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Upstream ${url} returned ${res.status}: ${body}`);
  }
  return res.json();
}

export const resolvers = {
  Query: {
    _empty: () => null,
  },
};
