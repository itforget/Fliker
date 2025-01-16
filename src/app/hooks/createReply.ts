import axios from 'axios';

export const CreateReply = async ({ content, authorId, postId }: { content: string, authorId: number | undefined, postId: number }) => {
    const response = await axios.post('/api/replies', { content, authorId, postId });
    return response.data;
};
