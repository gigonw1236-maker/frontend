export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getToken = () => localStorage.getItem('token');

export const isAuthenticated = () => !!getToken();

export const isUserFarmer = () => {
  const user = getUser();
  return user?.Role === 'Farmer';
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const setUserData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};
