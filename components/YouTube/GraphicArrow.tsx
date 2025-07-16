import Image from "next/image";
import Arrow from "@/public/youtube-arrow.png";
import { Caveat } from "next/font/google";
import { cn } from "@/lib/utils";

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400"],
});

const GraphicArrow = ({data, isLoading, hideArrow}: {data: {status: "valid" | "invalid" | "error"}, isLoading: boolean, hideArrow: boolean}) => {
  return (
    <>
      {data?.status === "invalid" && !isLoading && !hideArrow && (
        <div className="absolute w-[7rem] right-[-5.7rem] top-[-1.5rem] md:w-[10rem] md:right-[-8rem] md:top-[-2.5rem] opacity-[0.8] pointer-events-none">
          <Image
            src={Arrow}
            alt="Youtube Arrow"
            className="w-full rotate-[10deg] scale-y-[0.8] opacity-[0.8]"
          />
          <span
            className={cn(
              "text-black absolute md:top-[3.5rem] md:left-[7rem] top-[2.5rem] left-[4.5rem] whitespace-nowrap rotate-[351deg] text-[1rem] md:text-[1.4rem]",
              caveat.className
            )}
          >
            Get Youtube Insights
          </span>
        </div>
      )}
    </>
  );
};

export default GraphicArrow;
