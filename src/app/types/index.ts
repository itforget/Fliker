export type User = {
    id: number;
    name: string;
    email: string;
}
export type Post = {
    id?: number;
    content: string;
    likes?: Likes[];
    comments?: Comment[];
    createdAt: Date;
    videoUrl?: string;
    author: {
      id: number;
      name: string;
    } | null;
}


export type Comment = {
    id: number;
    content: string;
    createdAt: Date;
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

export type Notification = {
    id: number;
    message: string;
    createdAt: Date;
    userId: number;
    type: string;
    read: boolean;
}