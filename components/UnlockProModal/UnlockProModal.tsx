"use client";

import { ArrowRight, X, Sparkles, Bot, Users, Coins, Search, FileText } from "lucide-react";
import Modal from "../Modal";
import { useUserProvider } from "@/providers/UserProvder";
import { usePaymentProvider } from "@/providers/PaymentProvider";
import React from "react";
import Image from "next/image";

const UnlockProModal = ({
  isModalOpen,
  toggleModal,
}: {
  isModalOpen: boolean;
  toggleModal: () => void;
}) => {
  const { isPrepared } = useUserProvider();
  const { createCheckoutSession } = usePaymentProvider();
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);

  const pay = async (productName: string, isSubscription: boolean) => {
    if (!isPrepared()) return;
    await createCheckoutSession(productName, isSubscription);
    return;
  };

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      text: "Recoupable turned hours of fan research into clear insights in minutes. Absolutely incredible.",
      author: "Alexis Nixon",
      role: "Director of Marketing",
      company: "Rostrum Records",
      avatar: "/TesimonalHeadshots/AlexisNixon.jpg"
    },
    {
      id: 2, 
      text: "The YouTube report is amazing. Fast, accessible, and artists were thrilled.",
      author: "Stephanie Guerrero",
      role: "Digital Strategy",
      company: "OneRPM",
      avatar: "/TesimonalHeadshots/StephanieGuerrero.jpg"
    },
    {
      id: 3,
      text: "Recoupable helped us uncover TikTok trends we couldn't get anywhere else.",
      author: "Nick Pirovano",
      role: "VP of Marketing",
      company: "Cantora Records",
      avatar: "/TesimonalHeadshots/NickPirovano.jpg"
    },
    {
      id: 4,
      text: "The release reports are unreal. Exactly what we're looking for. This is sick and really exciting.",
      author: "Sam Palm",
      role: "Head of Data & Insights",
      company: "Parlophone Records",
      avatar: "/TesimonalHeadshots/SamPalm.jpg"
    },
    {
      id: 5,
      text: "Recoupable is amazing. I've been blown away since day one. It's like having a manager in your pocket.",
      author: "Carolyn Ortiz",
      role: "Chief Operator",
      company: "Big Ass Kids",
      avatar: "/TesimonalHeadshots/CarolynOrtiz.jpg"
    }
  ];

  // Auto-advance testimonials every 5 seconds
  React.useEffect(() => {
    if (!isModalOpen) return;
    
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isModalOpen, testimonials.length]);

  return (
    <>
      {isModalOpen && (
        <div className="relative">
          <Modal
            onClose={() => {}} 
            containerClasses="!p-0 !w-auto !max-h-[70vh] !overflow-hidden !border-none !rounded-xl !shadow-[1px_1px_8px_1px_#80808061] [&>button]:!hidden"
            className="!p-0 !border-none"
          >
            <div className="md:w-[900px] md:min-h-[450px] grid grid-cols-1 md:grid-cols-2 relative">
              <button
                className="absolute right-4 top-4 z-50 bg-white hover:bg-gray-100 transition-colors rounded-full p-2 shadow-lg border border-gray-200"
                type="button"
                onClick={toggleModal}
                aria-label="Close modal"
              >
                <X className="w-4 h-4 text-gray-700" />
              </button>
              
              {/* Left side - Signup content */}
              <div className="bg-white flex justify-center flex-col px-10 md:px-12 py-8 md:py-10">
                <h1 className="text-3xl md:text-4xl leading-snug text-gray-900 mb-2" style={{fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: '900'}}>
                  Start Your Free<br/>30 Day Trial
                </h1>

                <ul className="space-y-3 mt-8">
                  <li className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="font-inter_regular text-gray-700 text-sm md:text-base">Top-Tier AI Models</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Bot className="w-4 h-4 text-purple-600 flex-shrink-0" />
                    <span className="font-inter_regular text-gray-700 text-sm md:text-base">Customizable Agents</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="font-inter_regular text-gray-700 text-sm md:text-base">Up to 100 artist roster</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Coins className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span className="font-inter_regular text-gray-700 text-sm md:text-base">1,000 credits monthly</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    <span className="font-inter_regular text-gray-700 text-sm md:text-base">Rollout research</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-rose-600 flex-shrink-0" />
                    <span className="font-inter_regular text-gray-700 text-sm md:text-base">Recurring reports</span>
                  </li>
                </ul>
                
                <button
                  type="button"
                  className="flex gap-2 justify-center items-center bg-gray-900 hover:bg-gray-800 transition-all duration-200 rounded-xl text-white w-full px-6 py-4 mt-10 mb-4 font-inter_medium text-base shadow-md hover:shadow-lg"
                  onClick={() => pay("Unlimited subscription", true)}
                >
                  Claim Your 30 Free Days
                  <ArrowRight className="size-5" />
                </button>
                
                <p className="font-inter_regular text-xs text-gray-500 text-center leading-relaxed">
                  <span className="text-gray-700 font-inter_medium">Just $3.30/day after trial (less than a coffee)</span><br/>
                  No hidden fees • Cancel anytime
                </p>
              </div>

                            {/* Right side - Testimonials */}
              <div className="bg-[url('/Blue%20Background.png')] bg-cover bg-center bg-no-repeat px-8 py-0 flex flex-col items-center justify-center relative" style={{backgroundSize: 'cover', imageRendering: 'auto'}}>
                <div className="w-full max-w-md">
                  {/* Testimonial Card Container - Fixed Height */}
                  <div className="relative h-[220px]">
                    <div className="absolute inset-0">
                      <div 
                        className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl h-full flex flex-col justify-between"
                        key={currentTestimonial}
                      >
                        <p 
                          className="text-white text-lg leading-relaxed font-inter_regular italic animate-fadeIn"
                          key={`quote-${currentTestimonial}`}
                        >
                          &ldquo;{testimonials[currentTestimonial].text}&rdquo;
                        </p>

                        <div 
                          className="flex items-center gap-3 mt-4 animate-fadeIn"
                          key={`author-${currentTestimonial}`}
                        >
                          <div className="w-12 h-12 rounded-full border border-white/30 overflow-hidden flex-shrink-0">
                            <Image
                              src={testimonials[currentTestimonial].avatar}
                              alt={testimonials[currentTestimonial].author}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-white font-inter_bold text-base truncate">
                              {testimonials[currentTestimonial].author}
                            </div>
                            <div className="text-white/90 font-inter_medium text-sm truncate">
                              {testimonials[currentTestimonial].role}
                            </div>
                            <div className="text-white/70 font-inter_regular text-sm truncate">
                              at {testimonials[currentTestimonial].company}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <style jsx>{`
                      @keyframes fadeIn {
                        0% {
                          opacity: 0;
                          transform: translateY(10px);
                        }
                        100% {
                          opacity: 1;
                          transform: translateY(0);
                        }
                      }
                      
                      :global(.animate-fadeIn) {
                        animation: fadeIn 0.6s ease-out;
                      }
                    `}</style>
                  </div>

                  {/* Dots Navigation */}
                  <div className="flex justify-center gap-2 mt-6">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentTestimonial 
                            ? 'bg-white w-8' 
                            : 'bg-white/40 hover:bg-white/60'
                        }`}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </>
  );
};

export default UnlockProModal;
