export const PROXY_URL = import.meta.env.VITE_API_PROXY

export interface APIResponse<T> {
  status: number;
  message: string;
  body: T;
} 

let defaultHeaders = {
  'Content-Type': "application/json"
}

export function post<T,U>(path: string, body: T, handler: (resp: APIResponse<U>) => void) {
  fetch(`${PROXY_URL}/${path}`, {
    body: JSON.stringify(body),
    headers: defaultHeaders,
    method: 'POST'
  }).then(x => x.json()).then(x => {
    console.log(JSON.parse(x.body))
    handler({
      status: x.status,
      body: JSON.parse(x.body) as U,
      message: x.message,
    })
  })
}