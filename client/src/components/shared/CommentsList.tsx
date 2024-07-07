import { useGetPostCommentsQuery } from "@/app/api/commentApiSlice";
import { IPost } from "@/types";
import { PulseLoader } from "react-spinners";
import Comment from "./Comment";

const CommentsList = ({ post }: { post: IPost }) => {
  const { data, isLoading } = useGetPostCommentsQuery({ postId: post._id });

  if (!data) return;

  return (
    <div className="comments_list-container">
      {isLoading ? (
        <PulseLoader color="#fff" />
      ) : (
        <ul className="w-full flex flex-col gap-4">
          {data.comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))}
        </ul>
      )}
    </div>
  );
};
export default CommentsList;
