import axios from 'axios';

const BASE_URL = 'http://localhost:8082';

export const submitOnboarding = async (data: any) => {
  return await axios.post(`${BASE_URL}/onboarding/submit`, data);
};
