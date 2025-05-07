
export const LOGIN_CREDENTIALS = {
  email: 'gestaoelo@20',
  password: 'gestaoelo'
};

export function validateCredentials(email, password) {
  return email === LOGIN_CREDENTIALS.email && password === LOGIN_CREDENTIALS.password;
}
