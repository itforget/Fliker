import axios from 'axios';

export const CreateComment = async ({ content, authorId, postId }: { content: string, authorId: number | undefined, postId: number }) => {
    const response = await axios.post('/api/comments', { content, authorId, postId });
    return response.data;
};
