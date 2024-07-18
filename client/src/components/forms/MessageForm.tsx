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
import { useSendMessageMutation } from "@/app/api/chatApiSlice";
import { Loader } from "../shared";
import { useEffect, useRef, useState } from "react";
import { useSocketContext } from "@/context/SocketContext";

const MessageForm = () => {
  const { id: receiverId } = useParams();

  const [sendMessage, { isLoading }] = useSendMessageMutation();

  const form = useForm<z.infer<typeof MessageValidation>>({
    resolver: zodResolver(MessageValidation),
    defaultValues: {
      content: "",
    },
  });

  const [isTyping, setIsTyping] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { socket } = useSocketContext();

  useEffect(() => {
    if (inputRef.current) {
      const handleFocus = () => setIsTyping(true);
      const handleBlur = () => setIsTyping(false);

      inputRef.current.addEventListener("focus", handleFocus);
      inputRef.current.addEventListener("blur", handleBlur);

      // Cleanup event listeners on component unmount
      return () => {
        if (inputRef.current) {
          inputRef.current.removeEventListener("focus", handleFocus);
          inputRef.current.removeEventListener("blur", handleBlur);
        }
      };
    }
  }, []);

  useEffect(() => {
    if (isTyping) {
      socket?.emit("typing", receiverId);
    } else {
      socket?.emit("stopTyping", receiverId);
    }

    return () => {
      socket?.emit("stopTyping", receiverId);
    };
  }, [isTyping, receiverId, socket]);

  const handleSubmit = async (value: z.infer<typeof MessageValidation>) => {
    try {
      await sendMessage({ receiverId, content: value.content }).unwrap();
      form.reset();
    } catch (error) {
      console.log(error);
    }
  };

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
                    ref={(e) => {
                      field.ref(e);
                      inputRef.current = e;
                    }}
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
