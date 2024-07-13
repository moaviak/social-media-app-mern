import { MessageValidation } from "@/lib/validation";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "react-router-dom";
import {
  useGetAllChatsQuery,
  useSendMessageMutation,
} from "@/app/api/chatApiSlice";
import { Loader } from "../shared";

const MessageForm = () => {
  const { id: chatId } = useParams();

  const { chats } = useGetAllChatsQuery(null, {
    selectFromResult: ({ data }) => ({
      chats: data?.filter((chat) => chat._id === chatId),
    }),
  });

  const receiverId = chats ? chats[0].sender._id : "";

  const [sendMessage, { isLoading }] = useSendMessageMutation();

  const form = useForm<z.infer<typeof MessageValidation>>({
    resolver: zodResolver(MessageValidation),
    defaultValues: {
      content: "",
    },
  });

  const handleSubmit = async (value: z.infer<typeof MessageValidation>) => {
    try {
      await sendMessage({ receiverId, content: value.content }).unwrap();
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

  if (!chats) return;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative flex items-center">
                  <Input
                    type="text"
                    placeholder="Write your message here..."
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
                      <img src="/assets/icons/send.svg" alt="message" />
                    )}
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
export default MessageForm;
