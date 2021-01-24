export const USER_TOKEN = {
  get: () => localStorage.getItem('user_token'),
  set: (value: string) => {
    localStorage.setItem('user_token', `${value}`);
  },
  delete: () => localStorage.removeItem('user_token'),
};

export const LANG = {
  get: () => localStorage.getItem('lang') || 'en',
  set: (value: string) => {
    localStorage.setItem('lang', value);
  },
  delete: () => localStorage.removeItem('lang'),
};