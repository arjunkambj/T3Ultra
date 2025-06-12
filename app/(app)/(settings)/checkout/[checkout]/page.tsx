import { Button } from "@heroui/button";
import Link from "next/link";

import HelioPlus from "@/components/pricing/HelioPlus";
import HelioPro from "@/components/pricing/HelioPro";

type Props = {
  params: Promise<{
    checkout: string;
  }>;
};

export default async function CheckoutPage({ params }: Props) {
  const { checkout } = await params;

  if (checkout === "plus") {
    return <HelioPlus />;
  }

  if (checkout === "pro") {
    return <HelioPro />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl text-black font-bold">
        You did not select a plan
      </h1>
      <Button as={Link} className="mt-4" color="primary" href="/pricing">
        Go to pricing
      </Button>
    </div>
  );
}
