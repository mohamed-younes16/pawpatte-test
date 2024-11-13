"use client";

import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { BillBoardSchema } from "@/models/Schemas/Setup";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import "@uploadthing/react/styles.css";
import axios from "axios";
import { billBoard } from "@prisma/client";
import { ImagePlusIcon, Loader2, Trash2 } from "lucide-react";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import { useState } from "react";
import Heading from "../Heading";

import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
const BillboardForm = ({
  billboard,
  storeId,
}: {
  billboard: billBoard;
  storeId: string;
}) => {
  const title = billboard ? "Edit BillBoard" : "Create BillBoard";
  const description = billboard ? "Edit BillBoard" : "Create BillBoard";
  const action = billboard ? "update" : "create ";

  const [begain, setBegain] = useState(false);
  const form = useForm<z.infer<typeof BillBoardSchema>>({
    resolver: zodResolver(BillBoardSchema),
    defaultValues: {
      label: billboard?.label || "",
      imageUrl: billboard?.imageUrl || "",
      labelColor: billboard?.labelColor || "",
      text: billboard?.text || "",
      shown: billboard?.shown || true,
    },
  });

  const keysToIgnore = ["createdAt", "updatedAt", "storeId", "id"];

  const [isVideo, setIsVideo] = useState(
    form.watch("imageUrl").endsWith("mp4")
  );

  async function onSubmit(values: z.infer<typeof BillBoardSchema>) {
    toast.loading(action, { duration: 10000 });
    try {
      const data = {
        ...values,
      };

      const adding =
        action === "update"
          ? axios.patch(
              `/api/stores/${storeId}/billboards/${billboard?.id}`,
              data
            )
          : axios.post(`/api/stores/${storeId}/billboards/new`, data);

      adding
        .then((e) => {
          toast.success(e.data.message, { invert: true });
          setTimeout(() => {
            window.location.assign(`/dashboard/${storeId}/billboards`);
          }, 500);
        })
        .catch((e) => {
          console.log(e);
          toast.error(e.response.data.message || "Error Happend", {
            invert: true,
          });
        });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <Heading title={title} description={description} />{" "}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-8">
          <div className="flex flex-col gap-3 justify-start  w-full ">
            <FormLabel>choose a type</FormLabel>
            <Select
              defaultValue={"image"}
              onValueChange={(e) => setIsVideo(e == "video")}
            >
              <SelectTrigger className="w-[180px] ring-0 p-0 !shadow-none">
                <SelectValue placeholder="Select a billboard" />
              </SelectTrigger>
              <SelectContent className="!shadow-none">
                <SelectGroup>
                  <SelectLabel>BillBoards List</SelectLabel>
                  <SelectItem key={"video"} value={"video"}>
                    video
                  </SelectItem>
                  <SelectItem key={"image"} value={"image"}>
                    image
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>{" "}
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem className=" flex flex-col w-fit   ">
                  <FormLabel>Label</FormLabel>

                  <FormControl className="">
                    <Input
                      className="account-form_input "
                      type="text"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {!isVideo ? (
              <>
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem className=" flex flex-col w-full max-w-md   ">
                      <FormLabel>Text</FormLabel>

                      <FormControl className="">
                        <Textarea className="account-form_input " {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="labelColor"
                  render={({ field }) => (
                    <FormItem className=" flex flex-col w-fit   ">
                      <FormLabel>Label color</FormLabel>

                      <FormControl className="">
                        <Input
                          className="account-form_input "
                          type="text"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            ) : null}
            <FormField
              control={form.control}
              name="shown"
              render={({ field }) => (
                <FormItem className="flex flex-row max-lg:col-span-2  max-md:col-span-full  items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      defaultChecked={billboard.shown || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>is Shown</FormLabel>
                    <FormDescription>
                      You can manage your billboard to be shown at the first
                      page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem className=" flex flex-col justify-start flex-wrap ">
                  <FormLabel>image</FormLabel>
                  {field.value ? (
                    <FormLabel
                      className=" mr-8 relative 
             w-full max-w-[500px]  m-0 h-[300px] max-md:max-w-[400px]  max-sm:h-[200px]
            bg-zinc-900 rounded-xl  flexcenter "
                    >
                      {field?.value && (
                        <>
                          <Trash2
                            onClick={() => field.onChange("")}
                            className="absolute cursor-pointer transition-all  
                      hover:scale-105 bg-red-500 top-0 right-0
                      rounded-md  p-2 h-10 w-10 text-white z-50"
                          />
                          {form.watch("imageUrl").endsWith("mp4") ? (
                            <video
                              loop
                              muted
                              className="h-full rounded-lg object-cover w-full"
                              autoPlay
                              preload="none"
                            >
                              <source src={field.value} type="video/mp4" />
                            </video>
                          ) : (
                            <Image
                              src={field.value}
                              className="object-contain rounded-lg"
                              alt="image of you"
                              fill
                            />
                          )}
                        </>
                      )}
                    </FormLabel>
                  ) : (
                    <div className="flex items-s gap-6">
                      <UploadButton
                        content={{
                          button: (
                            <div className="flexcenter whitespace-nowrap text-foreground gap-6">
                              {!begain ? (
                                <>
                                  {" "}
                                  <ImagePlusIcon className="" />
                                  <p> Image or Video</p>
                                </>
                              ) : (
                                <Loader2 className="relative z-50 animate-spin" />
                              )}
                            </div>
                          ),
                        }}
                        endpoint="imageUploader"
                        className="items-start"
                        appearance={{
                          button: `bg-border w-52 p-2  text-primary-foreground `,
                        }}
                        onUploadBegin={() => setBegain(true)}
                        onClientUploadComplete={(e) => {
                          setBegain(false);
                          field.onChange(e?.[0].url);
                        }}
                      />
                    </div>
                  )}
                </FormItem>
              )}
            />
          </div>
          {form.formState.isDirty && (
            <div className="flex items-center gap-6 justify-start">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className={`${
                  form.formState.isSubmitting
                    ? " animate-bounce bg-zinc-500"
                    : ""
                } flexcenter gap-6`}
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="h-6 w-6 animate-spin " />
                ) : (
                  action
                )}
                {form.formState.isSubmitting && (
                  <div
                    className="w-8 h-8 border-4 border-white
                      dark:border-black !border-t-transparent rounded-full animate-spin"
                  />
                )}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </>
  );
};

export default BillboardForm;
