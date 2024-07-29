"use client";

import { CardWrapper } from "@/components/cards/bfp/card-wrapper";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export const BfpCard = () => {
  return (
    <CardWrapper headerLabel="Bfp">
      <div className="flex items-center justify-center p-3">
        <div className="rounded-2xl">
          <Image
            width={160}
            height={160}
            alt="Website logo"
            src="https://utfs.io/f/aa64501d-df1f-4c62-8379-31900c727f33-2370.png"
          />
        </div>
      </div>
      <div className="flex flex-col justify-center text-center items-center gap-4">
        <p className="font-semibold">
          For fire and other emergencies please contact:
          442-7930/443-7089/442-2222 09124096114 or dial 911
        </p>
        <Button
          onClick={() =>
            window.open("https://www.facebook.com/profile.php?id=100063733010388", "_blank")
          }
        >
          CONTACT NOW
        </Button>
      </div>
    </CardWrapper>
  );
};
