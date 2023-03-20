import { getDocs, collection } from "firebase/firestore"
import { db } from '../../config/firebase'
import { useEffect, useState } from 'react';
import { Post } from "./Post";


export interface Post {
    id: string;
    userid: string;
    title: string;
    username: string;
    description: string;
}

export const Home = () => {

    const postRef = collection(db, "posts");
    const [postsList, setPostsList] = useState<Post[] | null>(null)

    const getPost = async () => {
        const data = await getDocs(postRef);
        setPostsList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })) as Post[]);
    }
    useEffect(() => {
        getPost();

    }, [])
    return (
        <div>
            {postsList?.map((post) => (
                <Post post={post} />
            ))}
        </div>
    )
}
