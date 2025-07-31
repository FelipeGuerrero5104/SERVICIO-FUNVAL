import instance from './axiosConfig';

export async function profile() {
  try {
    const { data, status } = await instance.get('/auth/profile');
    return { data, status };
  } catch (error) {
    throw error;
  }
}