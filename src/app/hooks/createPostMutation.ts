import axios from 'axios';

export async function CreatePost(newPost: { content: string; authorId: number | undefined }) {
    const response = await axios.post('/api/posts', newPost);
    return response.data;
}