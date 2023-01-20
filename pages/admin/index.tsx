import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import AuthCheck from "../../components/AuthCheck";
import kebabCase from "lodash.kebabcase";
import { auth, firestore } from "@/lib/firebase";
import { collection, doc, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import styles from "../../styles/Admin.module.css";
import { toast } from "react-hot-toast";
import { UserContext } from "@/lib/context";
import PostFeed from "@/components/PostFeed";

export default function AdminPostsPage(props) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  // const ref = firestore
  //   .collection("users")
  //   .doc(auth.currentUser.uid)
  //   .collection("posts");
  // const query = ref.orderBy("createdAt");
  const ref = collection(
    firestore,
    "users",
    auth.currentUser?.uid ?? "no-user",
    "posts"
  );
  const postsQuery = query(ref, orderBy("createdAt"))
  const [querySnapshot] = useCollection(postsQuery);

  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <h1>Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  // Create a new post in firestore
  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser?.uid ?? "no-user";
    // const ref = firestore
    //   .collection("users")
    //   .doc(uid)
    //   .collection("posts")
    //   .doc(slug);
    const ref = doc(firestore, "users", uid, "posts", slug)

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# hello world!",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    // await ref.set(data);
    await setDoc(ref, data)

    toast.success("Post created!");

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
}