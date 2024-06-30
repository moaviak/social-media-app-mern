import { Link } from "react-router-dom";

import { PostStats } from "@/components/shared";
import { IPost, IUser } from "@/types";
import useAuth from "@/hooks/useAuth";

type GridPostListProps = {
  posts: IPost[];
  creator?: IUser;
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({
  posts,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  const user = useAuth();

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
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="line-clamp-1">{post.creator.name}</p>
                </Link>
              )}
              {showStats && <PostStats post={post} userId={user.id} />}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default GridPostList;
