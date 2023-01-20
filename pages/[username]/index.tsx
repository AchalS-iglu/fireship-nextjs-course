import PostFeed from '@/components/PostFeed'
import UserProfile from '@/components/UserProfile'
import {  firestore, getUserWithUsername, postToJSON } from '@/lib/firebase';
import { collection, getDocs, limit, orderBy, query as fsQuery, where } from 'firebase/firestore';
import React from 'react'

export const getServerSideProps = async ({ query }) => {
  console.log(query)
  const { username } = query;

  const userDoc = await getUserWithUsername(username);

  // JSON serializable data
  let user = null;
  let posts = null;

  // If there is no user, short-circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  if (userDoc) {
    user = userDoc.data();
    // const postsQuery = userDoc.ref
    //   .collection('posts')
    //   .where('published', '==', true)
    //   .orderBy('createdAt', 'desc')
    //   .limit(5);
    const postsRef = collection(firestore, userDoc.ref.path, 'posts')
    const postsQuery = fsQuery(
      postsRef,
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    posts = (await getDocs(postsQuery)).docs.map(postToJSON);
  }
  
  return {
    props: { user, posts }, // will be passed to the page component as props
  };
}

const UserProfilePage = ({ user, posts}) => {
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  )
}

export default UserProfilePage  