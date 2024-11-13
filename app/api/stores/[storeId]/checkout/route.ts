import prismadb from "@/lib/prismabd";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
export interface productType {
  productId: string;
  quantity: number;
}
interface UserDetails {
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  discountCode?: string | undefined;
}
interface CheckoutPayload {
  productsData: productType[];
  ownerId: string | null;
  userDetails: UserDetails;
}
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productsData, ownerId, userDetails }: CheckoutPayload =
    await req.json();

  const discount = await prismadb.discount.findFirst({
    where: {
      id: {
        startsWith: userDetails.discountCode?.toLocaleLowerCase(),
      },
      isUsed: false,
      userEmail: userDetails.email,
    },
  });

  const productIds = productsData.map((e) => e.productId);
  const products = await prismadb.product.findMany({
    where: { id: { in: productIds } },
  });
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  products.forEach((el) => {
    const elPrice = +el.price * 100;
    line_items.push({

      quantity: productsData.find((e) => e.productId === el.id)?.quantity,
      adjustable_quantity: { enabled: false },
      price_data: {
        currency: "USD",
        product_data: { name: el.name },
        unit_amount:
          elPrice - (discount?.id ? elPrice * (discount?.amount / 100) : 0),
      },
    });
  });


  const orderData: any = {
    orderOwnerEmail: userDetails.email,
    phoneNumber: userDetails.phoneNumber,
    address: userDetails.address,
    orderOwnerName: userDetails.name,
    isPaid: false,
    storeId: params.storeId,
    items: {
      create: productIds.map((e: string) => ({
        product: {
          connect: {
            id: e,
          },
        },
        count: productsData.find((el) => el.productId === e)?.quantity,
      })),
    },
    ...(discount?.id ? { discountCode: discount.id } : undefined),
  };

  const order = await prismadb.order.create({
    data: {   
      orderOwnerEmail: userDetails.email,
      phoneNumber: userDetails.phoneNumber,
      address: userDetails.address,
      orderOwnerName: userDetails.name,
      isPaid: false,
      storeId: params.storeId,
      items: {
        create: productIds.map((e: string) => ({
          product: {
            connect: {
              id: e,
            },
          },
          count: productsData.find((el) => el.productId === e)?.quantity,
        })),
      },
      ...(discount?.id ? { discountCode: discount.id } : undefined),},
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    submit_type: "pay",
    // billing_address_collection: "required",
    // phone_number_collection: { enabled: true },
    success_url: `${process.env.FRONT_END_URL}?success=true`,
    cancel_url: `${process.env.FRONT_END_URL}?canceled=true`,
    metadata: { orderId: order.id ,},
  });
  console.log(session)
  return NextResponse.json({ url: session.url }, { headers: corsHeaders });
}
