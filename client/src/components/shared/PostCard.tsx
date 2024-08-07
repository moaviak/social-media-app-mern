import { lazy, Suspense } from "react";
import useAuth from "@/hooks/useAuth";
import { multiFormatDateString } from "@/lib/utils";
import { IPost } from "@/types";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const PostStats = lazy(() => import("./PostStats"));
const CommentForm = lazy(() => import("../forms/CommentForm"));
const CommentsView = lazy(() => import("./CommentsView"));

type PostCardProps = {
  post: IPost;
};

const PostCard = ({ post }: PostCardProps) => {
  const user = useAuth();

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator._id}`}>
            <img
              src={
                post.creator.profilePicture ||
                "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="w-12 h-12 rounded-full object-cover"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular ">
                {multiFormatDateString(post.createdAt)}
              </p>
              •
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>

        <Link
          to={`/update-post/${post._id}`}
          className={`${user.id !== post.creator._id && "hidden"}`}
        >
          <img
            src={"/assets/icons/edit.svg"}
            alt="edit"
            width={20}
            height={20}
          />
        </Link>
      </div>

      <Link to={`/posts/${post._id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string, index: number) => (
              <li key={`${tag}${index}`} className="text-light-3 small-regular">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <img
          src={post.content || "/assets/icons/profile-placeholder.svg"}
          alt="post image"
          className="post-card_img"
        />
      </Link>

      <div className="flex flex-col items-start gap-4">
        <Suspense fallback={<Loader />}>
          <PostStats post={post} />
          <CommentsView post={post} />
          <CommentForm post={post} />
        </Suspense>
      </div>
    </div>
  );
};
export default PostCard;
