import { IPost } from "@/types";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PostValidation } from "@/lib/validation";
import { PulseLoader } from "react-spinners";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Button,
  Input,
  Textarea,
} from "@/components/ui";
import FileUploader from "../shared/FileUploader";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreatePostMutation,
  useUpdatePostMutation,
} from "@/app/api/postApiSlice";
import { IError } from "@/lib/utils";

type PostFormProps = {
  post?: IPost;
  action: "Create" | "Update";
};

const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post?.caption || "",
      file: [],
      location: post?.location || "",
      tags: post ? post.tags.join(", ") : "",
    },
  });

  // QUERIES
  const [createPost, { isLoading: isLoadingCreate }] = useCreatePostMutation();

  const [updatePost, { isLoading: isLoadingUpdate }] = useUpdatePostMutation();

  // HANDLER
  const handleSubmit = async (value: z.infer<typeof PostValidation>) => {
    try {
      const tags = value.tags?.replace(/ /g, "") || "";

      const fd = new FormData();
      // if (post) fd.append("id", post._id);
      fd.append("caption", value.caption);
      fd.append("file", value.file[0] ? value.file[0] : "");
      fd.append("location", value.location);
      fd.append("tags", tags);

      if (action === "Create") {
        await createPost(fd).unwrap();
      } else {
        await updatePost({ post: fd, postId: post?._id || "" }).unwrap();
      }

      toast({
        title: `Post ${action}d successfully!`,
      });
      form.reset();
      navigate("/");
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-9 w-full  max-w-5xl"
        encType="multipart/form-data"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photo</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.content}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Art, Expression, Learn"
                  type="text"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate}
          >
            {isLoadingCreate || isLoadingUpdate ? (
              <PulseLoader color="#fff" size={8} />
            ) : (
              <p>{action} Post</p>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default PostForm;
