import { useParams, Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui";
import { useToast } from "@/components/ui/use-toast";
import {
  CommentsView,
  GridPostList,
  Loader,
  PostStats,
} from "@/components/shared";

import { IError, multiFormatDateString } from "@/lib/utils";
import useAuth from "@/hooks/useAuth";
import {
  useDeletePostMutation,
  useGetPostByIdQuery,
} from "@/app/api/postApiSlice";
import { PulseLoader } from "react-spinners";
import { useGetUserPostsQuery } from "@/app/api/userApiSlice";
import CommentForm from "@/components/forms/CommentForm";

const PostDetails = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useAuth();

  const { data: post, isLoading } = useGetPostByIdQuery(id || "");

  const userId = post?.creator._id || "";
  const { data: userPosts, isLoading: isUserPostLoading } =
    useGetUserPostsQuery(userId, {
      skip: !userId,
    });

  const [deletePost, { isLoading: isDeletingPost }] = useDeletePostMutation();

  if (!userPosts || !post) return;

  const relatedPosts = userPosts?.filter((userPost) => userPost._id !== id);

  const handleDeletePost = async () => {
    try {
      await deletePost({ postId: post?._id }).unwrap();
      toast({ title: "Post successfully deleted!" });
      navigate(-1);
    } catch (error) {
      const err = error as IError;
      const message = err.data
        ? err.data.message
        : err.status >= 500
        ? "Internal Server Error"
        : "Unexpected error occurred!";
      toast({ title: message });
    }
  };

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost"
        >
          <img
            src={"/assets/icons/back.svg"}
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isLoading || !post ? (
        <PulseLoader color="#fff" />
      ) : (
        <div className="post_details-card">
          <img src={post?.content} alt="creator" className="post_details-img" />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${post?.creator._id}`}
                className="flex items-center gap-3"
              >
                <img
                  src={
                    post.creator.profilePicture ||
                    "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <p className="base-medium lg:body-semibold text-light-1">
                    {post.creator.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="small-regular lg:small-medium ">
                      {multiFormatDateString(post.createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {post.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div className="flex-center gap-4">
                <Link
                  to={`/update-post/${post?._id}`}
                  className={`${user.id !== post.creator._id && "hidden"}`}
                >
                  <img
                    src={"/assets/icons/edit.svg"}
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>

                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ost_details-delete_btn ${
                    user.id !== post.creator._id && "hidden"
                  }`}
                >
                  {isDeletingPost ? (
                    <Loader />
                  ) : (
                    <img
                      src={"/assets/icons/delete.svg"}
                      alt="delete"
                      width={24}
                      height={24}
                    />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <div className="mb-4">
                <p className="base-regular lg:base-medium">{post?.caption}</p>
                <ul className="flex gap-1 mt-2">
                  {post?.tags.map((tag: string, index: number) => (
                    <li
                      key={`${tag}${index}`}
                      className="text-light-3 small-regular lg:small-medium"
                    >
                      #{tag}
                    </li>
                  ))}
                </ul>
              </div>

              <hr className="border w-full border-dark-4/80 mb-4" />
            </div>
            <div className="flex flex-col items-start gap-4 w-full">
              <PostStats post={post} />
              <CommentsView post={post} />
              <CommentForm post={post} />
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />

        <h3 className="body-bold md:h3-bold w-full my-10">
          More Posts From {post.creator.name}
        </h3>
        {isUserPostLoading || !relatedPosts ? (
          <PulseLoader color="#fff" />
        ) : (
          <GridPostList posts={relatedPosts} showUser={false} />
        )}
      </div>
    </div>
  );
};

export default PostDetails;
