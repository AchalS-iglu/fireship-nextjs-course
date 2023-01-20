import Link from 'next/link';
import React from 'react'

const PostFeed = ({posts}) => {
  return posts ? posts.map((post) => <PostItem key={post.slug} post={post} />) : null
}

export default PostFeed

const PostItem = ({ post, admin = false }) => {
      const wordCount = post?.content.trim().split(/\s+/g).length;
    const minutesToRead = (wordCount / 100 + 1).toFixed(0);
    
    return (
      <div className="card">
        <Link href={`/${post.username}`} legacyBehavior>
          <a>
            <strong>By @{post.username}</strong>
          </a>
        </Link>

        <Link href={`/${post.username}/${post.slug}`} legacyBehavior>
          <h2>
            <a>{post.title}</a>
          </h2>
        </Link>

        <footer>
          <span>
            {wordCount} words. {minutesToRead} min read
          </span>
          <span className="push-left">💗 {post.heartCount || 0} Hearts</span>
        </footer>

        {/* If admin view, show extra controls for user */}
        {admin && (
          <>
            <Link href={`/admin/${post.slug}`} legacyBehavior>
              <h3>
                <button className="btn-blue">Edit</button>
              </h3>
            </Link>

            {post.published ? (
              <p className="text-success">Live</p>
            ) : (
              <p className="text-danger">Unpublished</p>
            )}
          </>
        )}
      </div>
    );
}