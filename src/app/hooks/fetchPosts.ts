import axios from 'axios';
import { Post } from '../types';
export const FetchPosts = async (): Promise<Post[]> => {
  const { data } = await axios.get('/api/posts');
  return data;
};

