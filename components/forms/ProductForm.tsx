"use client";

import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { productSchema } from "@/models/Schemas/Setup";
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
import {
  $Enums,
  Image as ImageType,
  category,
  color,
  product,
  size,
} from "@prisma/client";
import { ChevronDown, ImagePlusIcon, Loader2, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useEffect, useState } from "react";
import Heading from "../Heading";
import Image from "next/image";
import { UploadButton } from "@/utils/uploadthing";
import { Checkbox } from "@/components/ui/checkbox";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { animalsTypes } from "@/lib/prismabd";
type ProductWithColors = product & {
  color: string[];
};
const ProducForm = ({
  product,
  storeId,
  categories,
  colors,
  sizes,
  productImages,
}: {
  product: ProductWithColors;
  storeId: string;
  categories: category[];
  colors: color[];
  sizes: size[];
  productImages: ImageType[];
}) => {
  const notEmpty = Object.keys(product).length !== 0;
  const title = notEmpty ? "Edit product" : "Create product";
  const description = notEmpty ? "Edit product" : "Create product";
  const action = notEmpty ? "updating" : "creating";


  const [begain, setBegain] = useState(false);
  const [start, setstart] = useState(0);
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      categoryId: product?.categoryId || "",
      sizeId: product?.sizeId || "",
      name: product?.name || "",
      description: product?.description || "",
      isArchived: product?.isArchived || false,
      isFeatured: product?.isFeatured || true,
      images: productImages?.map((e) => e.url) || [],
      price: product?.price || 0,
      animal: product?.animal || "",
      colors: product?.color || [],
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const {
    control,
    watch,
    formState: { isSubmitting, isDirty, isSubmitSuccessful },
    handleSubmit,
    register,
  } = form;

  useEffect(() => {
    console.log(isSubmitting)
    setIsLoading(isSubmitting);
  }, [form.formState]);

  async function onSubmit(values: z.infer<typeof productSchema>) {
    try {
      const data = {
        ...values,
        price: +values.price,
      };
      toast.loading(action, { invert: true, duration: 10000 });

      const adding =
        action === "updating"
          ? axios.patch(`/api/stores/${storeId}/products/${product?.id}`, data)
          : axios.post(`/api/stores/${storeId}/products/new`, data);

      adding
        .then((e) => {
          toast.dismiss();
          setIsLoading(false);

          toast.success(e.data.message, { invert: true });

          window.location.assign(`/dashboard/${storeId}/products`);
        })
        .catch((e) => {
          toast.dismiss();
          setIsLoading(false);

          toast.error(e.response.data.message || "Error Happend", {
            invert: true,
          });
          console.log(e);
        });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }
  return (
    <>
      <Heading title={title} description={description} />{" "}
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-8">
          <div className="grid grid-cols-3 gap-6 justify-start  w-full ">
            {" "}
            <FormField
              control={control}
              name="images"
              render={({ field }) => (
                <FormItem className=" flex gap-6 col-span-full items-start  flex-wrap ">
                  <FormLabel>image</FormLabel>

                  {field.value.length > 0 && (
                    <Carousel
                      opts={{ startIndex: start }}
                      className="w-full !m-0 max-h-[350px] max-w-lg"
                    >
                      <CarouselContent>
                        {field.value?.map((image) => (
                          <CarouselItem key={image}>
                            <div className="p-1">
                              <Card>
                                <CardContent className="flex max-[500px]:h-[250px] max-md:h-[300px] h-[350px]   items-center justify-center p-6">
                                  <>
                                    <FormLabel
                                      className="  relative 
                           w-full  m-0 h-full
                          bg-zinc-900 rounded-xl  flexcenter "
                                    >
                                      <Trash2
                                        onClick={() => {
                                          const filterd = field.value.filter(
                                            (e) => e !== image
                                          );
                                          field.onChange(filterd);
                                        }}
                                        className="absolute cursor-pointer transition-all  
                      hover:scale-105 bg-red-500 top-0 right-0
                      rounded-md  p-2 h-10 w-10 text-white z-50"
                                      />
                                      <Image
                                        src={image}
                                        className="object-contain rounded-lg"
                                        alt="image "
                                        fill
                                      />
                                    </FormLabel>
                                  </>
                                </CardContent>
                              </Card>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  )}

                  <div className="flex !m-0">
                    <UploadButton
                      content={{
                        button: (
                          <div className="flexcenter whitespace-nowrap text-foreground gap-6">
                            {!begain ? (
                              <>
                                <ImagePlusIcon className="" />
                                <p>Upload An Image</p>
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
                        field.onChange(field.value.concat(e?.[0].url!));
                        setstart(watch().images.length - 1);
                      }}
                    />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem className=" flex flex-col w-full   ">
                  <FormLabel>Name of Product</FormLabel>

                  <FormControl>
                    <Input
                      className="account-form_input "
                      type="text"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="price"
              render={() => (
                <FormItem className=" flex flex-col w-full   ">
                  <FormLabel>Price of Product</FormLabel>

                  <FormControl className="flex items-center">
                    <>
                      {" "}
                      <Input
                        className="account-form_input "
                        type="number"
                        {...register("price", { valueAsNumber: true })}
                      />
                    </>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem className=" flex flex-col w-full   ">
                  <FormLabel>description of Product</FormLabel>

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
            {/* <FormField
              control={control}
              name="colors"
              render={({ field }) => (
                <FormItem className=" flex flex-col w-full   ">
                  <FormLabel>choose a color</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={product?.colors}
                      onValueChange={(e) => field.onChange(e)}
                    >
                      <SelectTrigger className=" !w-full   ring-0 !shadow-none">
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                      <SelectContent className="!shadow-none">
                        <SelectGroup>
                          <SelectLabel>colors List</SelectLabel>
                          {colors.map((e) => (
                            <SelectItem
                              className="font-bold !w-full flex items-center"
                              key={e.id}
                              value={e.id}
                            >
                              <div className="gap-8 w-full flex items-center">
                                {" "}
                                {e.name}
                                <div
                                  className="rounded-full h-4 w-4"
                                  style={{ backgroundColor: e.value }}
                                />
                              </div>
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            /> */}
            <FormField
              control={control}
              name="colors"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Choose colors</FormLabel>
                  <FormControl>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex border justify-between border-input items-center p-2 rounded-md ">
                        <div>
                          {field.value && field.value.length > 0
                            ? `Selected colors (${field.value.length})`
                            : "Select colors"}
                        </div>
                        <ChevronDown className="w-4 h-4 opacity-50" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Colors List</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {colors.map((color) => {
                          const isChecked = watch("colors")?.includes(color.id);

                          return (
                            <DropdownMenuCheckboxItem
                              key={color.id}
                              disabled={field.value.length === 1 && isChecked}
                              checked={isChecked}
                              onCheckedChange={(checked) => {
                                const updatedColors = checked
                                  ? [...(field.value || []), color.id]
                                  : field.value?.filter(
                                      (id: string) => id !== color.id
                                    );

                                field.onChange(updatedColors); // Update form state with new color selection
                              }}
                            >
                              <div className="flex items-center gap-2">
                                {color.name}
                                <div
                                  className="rounded-full h-4 w-4"
                                  style={{ backgroundColor: color.value }}
                                />
                              </div>
                            </DropdownMenuCheckboxItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="sizeId"
              render={({ field }) => (
                <FormItem className=" flex flex-col w-full   ">
                  <FormLabel>choose a size</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={product?.sizeId}
                      onValueChange={(e) => field.onChange(e)}
                    >
                      <SelectTrigger className=" !w-full ring-0 !shadow-none">
                        <SelectValue placeholder="Select a size" />
                      </SelectTrigger>
                      <SelectContent className="!shadow-none">
                        <SelectGroup>
                          <SelectLabel>sizes List</SelectLabel>
                          {sizes.map((e) => (
                            <SelectItem
                              className="font-bold"
                              key={e.id}
                              value={e.id}
                            >
                              {e.value}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className=" flex flex-col w-full   ">
                  <FormLabel>choose a category</FormLabel>
                  <FormControl>
                    <Select
                      defaultValue={product?.categoryId}
                      onValueChange={(e) => field.onChange(e)}
                    >
                      <SelectTrigger className=" !w-full  ring-0 !shadow-none">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="!shadow-none">
                        <SelectGroup>
                          <SelectLabel>categories List</SelectLabel>
                          {categories.map((e) => (
                            <SelectItem key={e.id} value={e.id}>
                              {" "}
                              {e.name}{" "}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="animal"
              render={({ field }) => (
                <FormItem className=" flex flex-col w-fit   ">
                  <FormLabel>choose an animal</FormLabel>
                  <FormControl>
                    <Select onValueChange={(e) => field.onChange(e)}>
                      <SelectTrigger className="w-[180px] ring-0 !shadow-none">
                        <SelectValue placeholder="Select an animal" />
                      </SelectTrigger>
                      <SelectContent className="!shadow-none">
                        <SelectGroup>
                          <SelectLabel>animals List</SelectLabel>
                          {animalsTypes.map((e) => (
                            <SelectItem key={e} value={e.toLocaleUpperCase()}>
                              {e.toLocaleLowerCase()}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex max-lg:col-span-2  max-md:col-span-full flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      defaultChecked={product?.isArchived || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Archived Product</FormLabel>
                    <FormDescription>
                      You can manage your Product Appearence
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />{" "}
            <FormField
              control={control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row max-lg:col-span-2  max-md:col-span-full  items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      defaultChecked={product?.isFeatured || false}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>isFeatured</FormLabel>
                    <FormDescription>
                      You can manage your Product to get Featured at the first
                      page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
          {isDirty && (
            <div className="flex items-center gap-6 justify-start">
              <Button
                type="submit"
                disabled={isLoading || !form.formState.isValid}
                className={`${
                  isLoading ? " bg-foreground" : ""
                } flexcenter w-[100px] gap-6`}
              >
                {isLoading && <Loader2 className="h-6 w-6 animate-spin " />}
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin " />
                ) : notEmpty ? (
                  "update"
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </>
  );
};

export default ProducForm;
