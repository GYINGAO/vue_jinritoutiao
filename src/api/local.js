import axios from 'axios';
export const readLocalData = path => {
  return axios.get(path);
};
