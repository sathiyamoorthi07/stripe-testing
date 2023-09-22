import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { Stripe, loadStripe } from "@stripe/stripe-js";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("api/donation");
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  let stripePromise: any = null;
  const getStripe = () => {
    if (!stripePromise) {
      stripePromise = loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
      );
    }
    return stripePromise;
  };

  const handleClick = async () => {
    const stripe = await getStripe();

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plan_id: "650d5ff8b1aac8074620cf01",
        type: "subscription",
        //amount: 2000,
        // plan: {
        //   name: "education donation",
        //   currency: "inr",
        //   amount: 350,
        // },
      }),
    });
    if (response.ok) {
      const data = await response.json();
      const pmt = data.checkoutSession;
      const cs_id = data.cs_id;

      stripe.redirectToCheckout({ sessionId: cs_id });
    } else {
      console.error("POST request failed with status:", response);
    }
  };

  return (
    <div>
      <button
        className="text-sm font-normal text-white  h-10 w-auto px-2 flex items-center justify-center bg-blue-500 rounded-md"
        onClick={() => {
          handleClick();
        }}
      >
        Payment
      </button>
    </div>
  );
}
