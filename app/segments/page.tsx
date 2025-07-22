"use client";

import { type NextPage } from "next";
import SegmentsWrapper from "@/components/Segments/SegmentsWrapper";

const SegmentsPage: NextPage = () => {
  return (
    <div className="max-w-full md:max-w-[calc(100vw-200px)] grow py-8 px-6 md:px-12">
      <p className="text-center md:text-left font-plus_jakarta_sans_bold text-3xl mb-4">
        Fan Groups
      </p>
      <p className="text-lg text-gray-500 text-center md:text-left mb-8 font-light font-inter max-w-2xl">
        <span className="sm:hidden">Categorize fans, automate insights.</span>
        <span className="hidden sm:inline">Categorize your fans into groups and <span className="font-plus_jakarta_sans_bold">automate insights</span> on their <span className="font-plus_jakarta_sans_bold">behavior</span> and <span className="font-plus_jakarta_sans_bold">marketing opportunities</span></span>
      </p>
      <SegmentsWrapper />
    </div>
  );
};

export default SegmentsPage;
