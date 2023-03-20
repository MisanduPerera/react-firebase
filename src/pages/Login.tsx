import { auth, provider } from '../config/firebase'
import { signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'


export const Login = () => {
    const navigate = useNavigate();

    const googleSignin = async () => {
        const result = await signInWithPopup(auth, provider);
        console.log(result);
        navigate('/')
    }

    return (
        <div>
            <h1>
                This is Login Page~
            </h1>
            <p>
                sign in with google
            </p>
            <button onClick={googleSignin}>
                sign in
            </button>
        </div>
    )
}