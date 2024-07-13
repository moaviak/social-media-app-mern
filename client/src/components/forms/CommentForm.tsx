import { CommentValidation } from "@/lib/validation";
import { IPost } from "@/types";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  Input,
} from "@/components/ui";
import { useToast } from "@/components/ui/use-toast";
import useAuth from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePostCommentMutation } from "@/app/api/commentApiSlice";
import { Loader } from "../shared";
import { useNavigate } from "react-router-dom";

type CommentFormProps = {
  post: IPost;
};

const CommentForm = ({ post }: CommentFormProps) => {
  const user = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [postComment, { isLoading }] = usePostCommentMutation();

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      text: "",
    },
  });

  const handleSubmit = async (value: z.infer<typeof CommentValidation>) => {
    try {
      await postComment({ postId: post._id, text: value.text }).unwrap();
      form.reset();
      navigate(`/posts/${post._id}`);
    } catch (error) {
      toast({ title: "Some error occurred. Please try again!" });
    }
  };

  return (
    <div className="flex items-center w-full">
      <img
        src={user?.profilePicture || "/assets/icons/profile-placeholder.svg"}
        alt="profile"
        className="h-10 w-10 rounded-full mr-4 object-cover"
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative flex items-center">
                    <Input
                      type="text"
                      placeholder="Write your comment..."
                      className="h-10 bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3 rounded-lg pr-10"
                      {...field}
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      className="absolute right-0 hover:bg-transparent"
                    >
                      {isLoading ? (
                        <Loader />
                      ) : (
                        <img src="/assets/icons/send.svg" alt="comment" />
                      )}
                    </Button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};
export default CommentForm;
