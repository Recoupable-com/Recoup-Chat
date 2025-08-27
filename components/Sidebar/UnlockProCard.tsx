import { ArrowRight } from "lucide-react";
import Icon from "../Icon";
import { usePaymentProvider } from "@/providers/PaymentProvider";
import React from "react";

const UnlockProCard = () => {
  const { toggleModal } = usePaymentProvider();
  


  return (
          <div className="w-full md:w-[250px] shadow-lg flex flex-col rounded-xl overflow-hidden my-4 aspect-[212/220] md:aspect-[212/240] bg-[url('/Blue%20Background.png')] bg-cover bg-top border border-white p-6 pl-6 pr-6 relative">
            {/* Inner white border with spacing */}
            <div className="absolute inset-0 border-2 border-white/30 rounded-xl pointer-events-none z-5"></div>
        {/* Video overlay on top of blue background */}
        <video 
          className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-20 pointer-events-none z-10"
          autoPlay 
          loop 
          muted 
          playsInline
          preload="auto"
          ref={(el) => {
            if (el) {
              el.playbackRate = 1.0;
              el.style.transform = 'rotate(90deg) scale(1.2)';
              el.style.objectPosition = 'center 25%';
              // Start the video at 0.5 seconds to skip any problematic beginning
              el.currentTime = 0.5;
            }
          }}
        >
          <source src="/backgrounds/White_Dots_Diagonal_Waves_Animation_source_2463953.mov" type="video/quicktime" />
          <source src="/backgrounds/White_Dots_Diagonal_Waves_Animation_source_2463953.mov" type="video/mp4" />
        </video>



                      <div className="relative z-20">
          <div className="relative mb-3">
                      <div className="absolute right-1 top-2">
            <Icon name="star" />
          </div>
            <div className="font-inter_bold text-white text-3xl">
              Unlock
              <br />
              Artist
              <br />
              Intelligence
            </div>
          </div>
          
          <p className="text-sm font-inter text-white/90 leading-relaxed mb-5 mt-2">
            Get better results with <span className="font-inter_bold">premium AI models</span>
          </p>
          
                      <button
              type="button"
              className="font-inter_bold text-sm bg-white/15 backdrop-blur-md text-white rounded-lg px-4 py-2 flex items-center gap-2 border border-white/20 hover:bg-white/25 transition-all duration-200 shadow-xl mt-2"
              onClick={() => toggleModal(false)}
            >
              Learn More
              <ArrowRight className="size-3" />
            </button>
        </div>
    </div>
  );
};

export default UnlockProCard;
