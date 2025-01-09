export type User = {
    id: number;
    name: string;
    email: string;
}
export type Post = {
    id?: number;
    title: string;
    content: string;
    likes?: Likes[];
    replies?: Reply[];
    createdAt: Date;
    author: {
      id: number;
      name: string;
    } | null;
}


export type Reply = {
    id: number;
    content: string;
    author: {
      id: number;
      name: string;
    } | null;
  };
  

export type Likes = {
    id?: number;
    userId: number;
    postId: number;
}