import PulseCardActions from "./PulseCardActions";

interface PulseCardProps {
  imageUrl: string;
  title: string;
  description: string;
}

const PulseCard = ({ imageUrl, title, description }: PulseCardProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative overflow-hidden rounded-2xl">
        <img
          src={imageUrl}
          alt={title}
          className="w-full aspect-[4/3] object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
          <h3 className="text-white text-lg font-semibold">{title}</h3>
          <p className="text-white/80 text-sm mt-1">{description}</p>
        </div>
      </div>
      <PulseCardActions />
    </div>
  );
};

export default PulseCard;
