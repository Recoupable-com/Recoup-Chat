"use client";

const PulseHeader = () => {
  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return (
    <h1 className="text-3xl font-semibold tracking-tight">{formattedDate}</h1>
  );
};

export default PulseHeader;
