import axios from 'axios';

export const giveLikeToPost = async ({ userId, postId }: { userId: number, postId: number }) => {
    const response = await axios.post('/api/likes', { userId, postId });
    return response.data;
};
