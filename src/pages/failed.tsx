import { useState } from "react";

export default function PaymentFailedPage() {
  const [data, setData] = useState([]);

  return (
    <div className="w-full h-full flex items-cent justify-center">
      <p className="text-base font-medium text-red-500 ">Donation is Failed</p>
    </div>
  );
}
