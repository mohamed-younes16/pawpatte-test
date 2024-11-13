"use client";

import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { discountSchema } from "@/models/Schemas/Setup";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios from "axios";
import { discount } from "@prisma/client";
import Heading from "../Heading";
import { useEffect, useState } from "react";

const DiscountForm = ({
  discount,
  storeId,
}: {
  discount: discount;
  storeId: string;
}) => {
  const title = discount ? "Edit discount" : "Create discount";
  const description = discount ? "Edit discount" : "Create discount";
  const action = discount ? "update" : "create";
  const [discountData, setDiscountData] = useState<discount | null>(
    discount || null
  );
  const [isCodeGenerated, setIsCodeGenerated] = useState(false);

  const form = useForm<z.infer<typeof discountSchema>>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      userEmail: discount?.userEmail || "",
      amount: discount?.amount || 25,
    },
  });
  const {
    control,
    formState: { isSubmitting, isDirty, isSubmitSuccessful },
    handleSubmit,
    register,
  } = form;

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(isSubmitting);
  }, [form.formState]);

  async function onSubmit(values: z.infer<typeof discountSchema>) {
    try {
      const data = { ...values };

      const adding =
        action === "update"
          ? axios.patch(`/api/stores/${storeId}/discount/${discount?.id}`, data)
          : axios.post(`/api/stores/${storeId}/discount/new`, data);

      adding
        .then((e) => {
          toast.success(e.data.message, { invert: true });
          setDiscountData(e.data.discount);
          setIsCodeGenerated(true); // Enable Send Email button after code generation
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

  const sendEmail = async () => {
    if (!isCodeGenerated) return;

    const adding = axios.post(`/api/stores/${storeId}/send`, {
      discountAmount: discountData?.amount,
      promoCode: discount.id.slice(0, 10).toUpperCase(),
      email: form.watch("userEmail"),
    });

    adding
      .then((e) => {
        toast.dismiss();
        toast.success(e.data.message);
      })
      .catch((e) => {
        toast.dismiss();
        toast.error(e.response.data.message);
      });
  };

  return (
    <>
      <Heading title={title} description={description} />{" "}
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-8">
          <div className="flex flex-col gap-3 justify-start  w-full ">
            <FormField
              control={control}
              name="userEmail"
              render={({ field }) => (
                <FormItem className="flex flex-col w-fit">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className="account-form_input"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="amount"
              render={() => (
                <FormItem className="flex flex-col w-full max-w-xs">
                  <FormLabel>Choose discount amount</FormLabel>
                  <FormControl className="flex items-center">
                    <Input
                      max={100}
                      min={1}
                      className="account-form_input"
                      type="number"
                      {...register("amount", { valueAsNumber: true })}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center text-lg gap-4">
            {discountData?.id && (
              <>
                <div className="h-20 flex items-center text-lg">
                  <p>Discount code is:</p>
                  <p className="font-bold">
                    {discountData.id.slice(0, 10).toUpperCase()}
                  </p>
                </div>

                <Button
                  type="button"
                  disabled={!isCodeGenerated || isLoading || (isDirty && !isSubmitSuccessful)}
                  className={`${
                    isLoading ? "animate-bounce bg-zinc-500" : ""
                  } flex-center gap-6`}
                  onClick={sendEmail}
                >
                  Send Email
                  {isLoading && (
                    <div
                      className="w-8 h-8 border-4 border-white dark:border-black !border-t-transparent rounded-full animate-spin"
                    />
                  )}
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center gap-6 justify-start">
            <Button
              type="submit"
              disabled={isLoading || !isDirty}
              className={`${
                isSubmitting ? "animate-bounce bg-zinc-500" : ""
              } flex-center gap-6`}
            >
              {action}
              {isLoading && (
                <div
                  className="w-8 h-8 border-4 border-white dark:border-black !border-t-transparent rounded-full animate-spin"
                />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default DiscountForm;
