import { useState } from "react";

export default function Home() {
  const [data, setData] = useState([]);

  return (
    <div className="w-full h-full flex items-cent justify-center">
      <p className="text-base font-medium text-gray-600 ">
        Donation paid syccessfully
      </p>
    </div>
  );
}
