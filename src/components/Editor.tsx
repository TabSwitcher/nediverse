"use client";

import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import TextareaAutoSize from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
import { zodResolver } from "@hookform/resolvers/zod";
import type EditorJS from "@editorjs/editorjs";
import { uploadFiles } from "@/lib/uploadthing";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
//only import type, dont import entire dependency

interface EditorProps {
  communityId: string;
}

const Editor: FC<EditorProps> = ({ communityId }) => {
  // all errors are handled client side by resolver in useForm hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      communityId,
      title: "",
      content: null,
    },
  });

  const ref = useRef<EditorJS>();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editorjs",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Start writing your post...",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          link: {
            class: LinkTool,
            config: {
              //hosts and returns metadata for that link
              endpoint: "/api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles([file], "imageUploader");

                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  };
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          embed: Embed,
          table: Table,
        },
      });
    }
  }, []);

  useEffect(() => {
    //that's we are on client side as server side will be undefined
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length){
      for(const [_key, value] of Object.entries(errors)){
          toast({
            title: 'Something went wrong',
            description: (value as {message: string}).message,
            variant: 'destructive',
          })
      } 
    }
  }, [errors]);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();

      setTimeout(() => {
        //set focus to title
        _titleRef.current?.focus();
      }, 0);
      //this will move this call to the end of the callstack actually going through with the focusing of the title
    };
    if (isMounted) {
      init();
      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  const {mutate: createPost} = useMutation({
    mutationFn: async ({ title, content, communityId }: PostCreationRequest) => {
      const payload: PostCreationRequest = {
        communityId,
        title,
        content,
      }
      const {data} = await axios.post('/api/community/post/create', payload)
      return data;
    },
    onError: () => {
      return toast({
        title: 'Something went wrong',
        description: 'Your post was not published, please try again later',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      // convert ned/mycommunity/submit into ned/mycommunity
      const newPathname = pathname.split('/').slice(0, -1).join('/')
      router.push(newPathname);

      //to show fresh version of current feed of current community to avoid nextjs caching
      router.refresh();

      return toast({
        description: 'Your post was published',
      })
    }
  })

  async function onSubmit(data: PostCreationRequest) {
    const blocks = await ref.current?.save();

    const payload: PostCreationRequest = {
          title: data.title,
          content: blocks,
          communityId,
    }

    createPost(payload);
  }

  const { ref: titleRef, ...rest } = register("title");

  //by default react hook forms take the refs. we can't use a custom ref, so we share the ref with the textarea and the register function from react hook forms
  //so we separate the ref and pass the ref to react hook form, and we also want our ref so we pass titleRef.current to e to focus on title
  return (
    <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
      <form
        id="community-post-form"
        className="w-fit"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="prose prose-stone dark:prose-invert">
          <TextareaAutoSize
            ref={(e) => {
              titleRef(e);

              // @ts-ignore
              _titleRef.current = e;
            }}
            {...rest}
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />
          <div id="editorjs" className="min-h-[500]px" />
        </div>
      </form>
    </div>
  );
};

export default Editor;
