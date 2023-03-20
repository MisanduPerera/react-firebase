<br><br>

- [About the app](#about-the-app)
  - [Setting up firebase api](#setting-up-firebase-api)
  - [Setting up firebase in app](#setting-up-firebase-in-app)
  - [Adding login functions](#adding-login-functions)
  - [Showing user details on navigation bar](#showing-user-details-on-navigation-bar)
  - [Final look](#final-look)
  - [Creating firestore database](#creating-firestore-database)
  - [Configuring db in api](#configuring-db-in-api)
  - [Setting up form to enter data](#setting-up-form-to-enter-data)
  - [setting up writting database from form inputs](#setting-up-writting-database-from-form-inputs)
  - [Displaying data from firebase](#displaying-data-from-firebase)

<br><br>

# About the app
In this app we are making a social media like web app and  focusing on authentication using firebase. [Firebase](https://firebase.google.com/) is a google tool that helps with signing/authentication for many applications. Also later we will configure the app to communicate with firebase database called Firestore, which we will go indepth later on.

## Setting up firebase api

First you have to install firebase library to you project,

```powershell
npm install firebase
```

Then create a file that connect to the firebase api. In our case we named it **firebase.ts**. Note that the file extension is *.ts* rather than its *.tsx* since its not a component (do not return any **JSX**).

After that head on to firebase website and create project and name the app. This will provide you with the api call code. Paste that into **firebase.ts** file. This will navigate to app's dashboard that will look like this,

![Firebase-Dashboard](images/firebase-dashboard.jpg)

Now head over to authentication panel and select google and confirm the changes. 

## Setting up firebase in app

After that we have to import two other libraries into the **firebase.ts** file,
```javascript
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
```
First import here is for initialising the app and the second one for authentication with the google provider. Then add the folloing code as well,

```javascript
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
```
In here we are creating auth const that get the authentication from the app. Then sending it though the *GoogleAuthProvider*.

So far **firebase.ts** file's code will look like this,
```javascript
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "dgdg",
  authDomain: "learn-react-234e6.firebaseapp.com",
  projectId: "learn-react-234e6",
  storageBucket: "learn-react-234e6.appspot.com",
  messagingSenderId: "1041559860762",
  appId: "dgdsgdsgdg"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
```

> Note that the api key some other information will be different for other users.

## Adding login functions

Then head over to **login.tsx** file to add the signing functionality to our *sign in button*.

Then we are going to import some libraries to this file,
```javascript
import { auth, provider } from '../config/firebase'
import { signInWithPopup } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
```
First we have imported the *auth* and *provider* configuration from our **firebase.ts** file. Second, the sign in functionality, which is in our case a sign in pop up from that display google accounts. Then `useNavigate` to navigate to specific file after the authentication. 

```javascript
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
```
Then we make a function called `googleSignin` that calls `signInWithPopup` fuction and pass in the *auth* and *provider* variables. Then we set the `navigate` to the *home page* after authentication. finally we set the button to run the `googleSignin` function onclick. When we run the app now we can see in console all the user details there.

## Showing user details on navigation bar

Now we show those user details in the navigation bar by adding some code into the **navbar.txs**. First we import the following libraries,

```javascript
import { Link } from 'react-router-dom'
import { auth } from '../config/firebase'
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth'
```

You may have to install the page called `react-firebase-hooks`.
```powershell
npm install react-firebase-hooks
```
Then we add the following code to the file,
```javascript
import { Link } from 'react-router-dom'
import { auth } from '../config/firebase'
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth'


export const Navbar = () => {
    const [user] = useAuthState(auth);
    const logOut = async () => {
        await signOut(auth);
    }

    return (
        <nav>
            <Link to={'/'}>Home</Link>
            <Link to={'/login'}> Login</Link>
            <div className="navbar-container">
                {user && (
                <>
                    <p>{user?.displayName}</p>
                <img src={user?.photoURL || ""} width='20' height={'20'} />
                <button onClick={logOut}>log out</button>
                </>
                )}
                
            </div>
        </nav>

    )
}
```
So what `useAuthState` hook does is, it allow the user to change the account and it updates the page instantly on the web page.

We also have added logout functionality so the user can log out of the account. for this we have used the `signOut` hook from *firebase/auth* library. Then we have updated the UI to display name of the user, the user image and a log out button.

## Final look

After adding some css into the app, your app might look like this,
![final-app](images/app.jpg)

> Ignore my desktop pet 凸 ( ͡❛ ω ͡❛)凸


## Creating firestore database
Now to create the firestore database we have to head back over to [Firebase](https://firebase.google.com/) website and navigate to our previously made project. In here click on build>firestore-database.

![firestore-db-1](images/firestore-db-1.jpg)

Then we will create production database and confirm settings. In here we will create a new collection with required columns. something like this (doesnt really need to be exactly same, you can add some random values for values field). 

![firestore-db-2](images/firestore-db-2.jpg)

Once we have done that we need to head over to **Rules** section to change persmission that who can and cannot read write to this data collection.

![firestore-db-3](images/firestore-db-3.jpg)

In here edit the code to for custom permissions and publish it,
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read : if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == request.resource.data.userid;
    }
  }
}
```
## Configuring db in api
Now we can head over to **firebase.tsx** file and add some more code so that it will be able to talk to the *Database*.

```javascript
import {getFirestore} from 'firebase/firestore'

...

export const db = getFirestore(app);
```
We need to import `getFirestore` hook from firestore library and pass in *app* to it.

## Setting up form to enter data
In the project /src we are creating another folder called **/create-post** and creating two other files inside it called **CreatePost.tsx** and **CreateForm.tsx**. CreatePost will be used show the creating post page and the form it self will be coded in CreateForm page. Before moving further lets create a another **Route** in app.tsx so we can navigate easily.

Now in the CreatePost page add these code to show the form and import the CreateForm.tsx as well.

```javascript
import { CreateForm } from "./CreateForm"

export const CreatePost=()=>{
    return (
        <div>
            <CreateForm />
            
        </div>
    )
}
```

Now head over to the CreateForm.tsx file and add this code.
```javascript
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {addDoc, collection} from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';


interface CreateFormData{
    title:string;
    description: string;
}

export const CreateForm = () => {
    const navigate = useNavigate();
    const [user] = useAuthState(auth);

    const schema = yup.object({
        title: yup.string().required("Title required"),
        description: yup.string().required("Desription required"),

    })
    const { register, handleSubmit, formState:{errors}} = useForm<CreateFormData>({
        resolver: yupResolver(schema)
    })

    const postRef = collection(db, "posts");

    const onCreatePost=async(data:CreateFormData)=>{
        await addDoc(postRef, {
            ...data,
            username:user?.displayName,
            userid: user?.uid,
        })
        navigate("/");
    }
    return (

        <div>
            <form onSubmit={handleSubmit(onCreatePost)}>
                <input placeholder='Title.. ' {...register("title")} />
                <p style={{color:"red"}}>{errors.title?.message}</p>
                <textarea placeholder='Description.. ' {...register("description")}/>
                <p style={{color:"red"}}>{errors.description?.message}</p>
                <input type={'submit'} />
            </form>
        </div>
    )
}
```

So first of all we are importing the three libraries that are needed for creating the form. 

```javascript
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
```
You can install these packages using the following commands if they are not installed, 
```powershell
npm install react-hook-form yup @hookform/resolvers
```

Then import two libraries that are required for setting up the database. 

```javascript
import {addDoc, collection} from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
```

The other two imports are for using the userState and navigation,
```javascript
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
```

Then we set up the form using yup, register and reslvers as have discussed in a previous episode.

## setting up writting database from form inputs

Then we move on to the database configuration. 
```javascript
 const postRef = collection(db, "posts");

    const onCreatePost = async (data: CreateFormData) => {
        await addDoc(postRef, {
            ...data,
            username: user?.displayName,
            userid: user?.uid,
        })
        navigate("/");
    }
```

Here in the `collection` method we are passing in the **db** object we created earlier on *firebase.tsx* file and the **"posts"** which is the collection id we created in the *firebase website* to reference to that data collection.

Then we create `createPost` method that will called in when submiting the form. in this method we passing in the inforation *data object*, *username* and *userid* which are the same columns we made in the collection earlier in the website.

![firestore-db-2](images/firestore-db-2.jpg)

> Note that in the image **id** column is not same as in the code for **userid** but it is supposed to be the same to make sure to have same names.

Once this is completed you should be able to add data into the collection and it will be updated in the firestore database via their website.

![firestore-db-4](images/firestore-db-4.jpg)

Here in website it shows results,

![firestore-db-5](images/firestore-db-5.jpg)

## Displaying data from firebase

So lets try display data into the **Home Page**. In the Home.tsx file we can add the following imports. 

```javascript
import { getDocs, collection } from "firebase/firestore"
import { db } from '../../config/firebase'
import { useEffect, useState } from 'react';
import { Post } from "./Post";
```

And since this is TypeScript we have to make interfaces to pass into certain methods and for components.

```javascript
export interface Post {
    id: string;
    userid: string;
    title: string;
    username: string;
    description: string;
}
```

The `Home` function should look like this,

```javascript
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
```
In here we are first creating const called `postRef` that reference the database under the collection named "posts". And a state that holds all the posts as an array. 

Then in the `getPost` method retrieving docs from the database and set it to `data` const. By mapping through all the docs (which means reacord on the posts tables), for each dataset we are adding another field id to identify each post for later purposes. And set them to the `postsList`.

Using `useEffect` hook then we runthe `getPost` method when the app renders. Then we map though each post and render `<Post>` component.

The final code in Home.tsx should look like this,

```javascript
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
```
Before we move onto the next part we need to create a another collection in [Firestore](https://firebase.google.com/) called likes so that we can implement the liking functionality in the app. For that [refence](#creating-firestore-database) to the part we created posts collecetion and repeat the process for likes collection. Note that we need two columns, postid and userid.

![firestore-db-6](images/firestore-db-6.jpg)

Then we can move on to creating `<Post>` component. Just as usual we create a file called **Post.tsx**, and add the following imports.

```javascript
import { addDoc, collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../config/firebase';
import { Post as aPost } from './Home'
```

Then we create the interfaces that is required by typescript,
```javascript
interface Props {
    post: aPost;
}

interface Like {
    likeid:string;
    userid: string;
}
```
Then add the following code which will be explained soon,

```javascript
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
```

The first we create a const, a object called `post` from the props of the method which are the `Post` interface we made earlier in the **Home.tsx**. `likeRef` is to refence to the collection called "likes", `user` is to identify who is the current user loged in, `LikesDoc` will use `query` function from firestore that query through each row of the `likeRef` collection where 'postid' of the collection is equal to the post id of the current `<Post>` component. The `likes` const is a state which contain a array of `Like` obkects. The `hasUserLiked` const is a boolean that pass true by going through all the likes where the 'userid' of that like equals to current loged in user's 'id'.  

`getLikes` - This function fetches all the likes for a particular post from the Firebase Firestore database. It creates a query using the `collection` and `where` functions, which filters the likes collection to only include likes that correspond to the current post. Then, it calls the `getDocs` function to fetch the documents that match the query. Once the data is retrieved, it is mapped to an array of objects that contain the `userid` of the user who liked the post and the `likeid` of the like document. Finally, the `setLikes` function is called with this array to update the state with the likes for the current post. `useEffect` hook then run the `getLikes` function when the page renders.

`addLike` - This function adds a new like to the likes collection in Firebase Firestore. It first calls the `addDoc` function to add a new document to the likes collection with the `userid` of the currently logged in user and the `postid` of the current post. If the operation is successful, the new like is added to the likes state by calling `setLikes` with the new `likeid` and `userid` data. If the user is not logged in, user will be null and the like will not be added.

`removeLike` - This function removes a like from the likes collection in Firebase Firestore. It first creates a query using the `collection` and `where` functions to filter the likes collection to only include likes that correspond to the current post and were made by the current user. It then calls the `getDocs` function to retrieve the document(s) that match the query. Once the like document is retrieved, it is deleted using the `deleteDoc` function. Finally, the like is removed from the likes state by calling `setLikes` with a new array that does not include the removed like.

At the end we **retuen** the JSX with the title, description and username of the post and a button to like or dislike (if already liked).

The final code should look similar to this, 

```javascript
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
```

And the final application will look like this. Feel free to add css and style as prefered. 

![final-app](images/firestore-db-7.jpg)

