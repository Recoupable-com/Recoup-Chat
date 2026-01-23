interface PulseHeaderProps {
  date: Date;
}

const PulseHeader = ({ date }: PulseHeaderProps) => {
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return (
    <h1 className="text-3xl font-semibold tracking-tight">{formattedDate}</h1>
  );
};

export default PulseHeader;
