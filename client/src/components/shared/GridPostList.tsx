import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { IPost } from "@/types";
import Loader from "./Loader";

const PostStats = lazy(() => import("@/components/shared/PostStats"));

type GridPostListProps = {
  posts: IPost[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  return (
    <ul className="grid-container">
      {posts.map((post) => {
        return (
          <li key={post._id} className="relative min-w-80 h-80">
            <Link to={`/posts/${post._id}`} className="grid-post_link">
              <img
                src={post.content}
                alt="post"
                className="h-full w-full object-cover"
              />
            </Link>

            <div className="grid-post_user">
              {showUser && (
                <Link
                  to={`/profile/${post.creator._id}`}
                  className="flex items-center justify-start gap-2 flex-1"
                >
                  <img
                    src={
                      post.creator.profilePicture ||
                      "/assets/icons/profile-placeholder.svg"
                    }
                    alt="creator"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <p className="line-clamp-1">{post.creator.name}</p>
                </Link>
              )}
              {showStats && (
                <Suspense fallback={<Loader />}>
                  <PostStats post={post} />
                </Suspense>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default GridPostList;
