import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';


interface CreateFormData {
    title: string;
    description: string;
}

export const CreateForm = () => {
    const navigate = useNavigate();
    const [user] = useAuthState(auth);

    const schema = yup.object({
        title: yup.string().required("Title required"),
        description: yup.string().required("Desription required"),

    })
    const { register, handleSubmit, formState: { errors } } = useForm<CreateFormData>({
        resolver: yupResolver(schema)
    })

    const postRef = collection(db, "posts");

    const onCreatePost = async (data: CreateFormData) => {
        await addDoc(postRef, {
            ...data,
            username: user?.displayName,
            userid: user?.uid,
        })
        navigate("/");
    }
    return (

        <div>
            <form onSubmit={handleSubmit(onCreatePost)}>
                <input placeholder='Title.. ' {...register("title")} />
                <p style={{ color: "red" }}>{errors.title?.message}</p>
                <textarea placeholder='Description.. ' {...register("description")} />
                <p style={{ color: "red" }}>{errors.description?.message}</p>
                <input type={'submit'} />
            </form>
        </div>
    )
}