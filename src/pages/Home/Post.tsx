import { addDoc, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../config/firebase';
import { Post as aPost } from './Home'

interface Props {
    post: aPost;
}

interface Like {
    likeid:string;
    userid: string;
}

export const Post = (props: Props) => {
    const { post } = props;
    const likesRef = collection(db, "likes");
    const [user] = useAuthState(auth);
    const LikesDoc = query(likesRef, where("postid", "==", post.id))
    const [likes, setLikes] = useState<Like[] | null>(null);
    const hasUserLiked = likes?.find((like) => like.userid === user?.uid)

    const getLikes = async () => {
        const data = await getDocs(LikesDoc)
        setLikes(data.docs.map((doc) => ({ userid: doc.data().userid, likeid:doc.id})))
    }

    const addLike = async () => {
        try {
            const newDoc = await addDoc(likesRef, { userid: user?.uid, postid: post.id });
            if (user) {
                setLikes((prev) => prev ? [...prev, { userid: user.uid, likeid:newDoc.id }] : [{ userid: user.uid, likeid:newDoc.id }])
            }
        } catch (err) {
            console.log(err);
        }
       
    };

    const removeLike = async () => {
        try {
            const unlikeQuery = query(likesRef, where("postid", "==", post.id), where("userid", "==", user?.uid));
            const unlikeData = await getDocs(unlikeQuery);
            const unlikeid =  unlikeData.docs[0].id;
            const unlike = doc(db, "likes", unlikeid);

            await deleteDoc(unlike);
            if (user) {
                setLikes((prev) => prev && prev.filter((like)=> like.likeid !== unlikeid));
            }
        } catch (err) {
            console.log(err);
        }
       
    };

    
    useEffect(() => {
        getLikes();
    }, [])
    return (<div>
        <div>
            <h1>{post.title}</h1>
        </div>
        <div>
            <p>{post.description}</p>
        </div>
        <div>
            <p>@{post.username}</p>
            <button onClick={hasUserLiked ? removeLike:addLike }>{hasUserLiked ? <>&#128078;</> : <>&#128077;</>}</button>
            {likes && <p>Likes: {likes.length}</p>}
        </div>
    </div>)
}