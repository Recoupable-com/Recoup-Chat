interface PulseArticleHeroProps {
  imageUrl: string;
  alt: string;
}

const PulseArticleHero = ({ imageUrl, alt }: PulseArticleHeroProps) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl">
      <img
        src={imageUrl}
        alt={alt}
        className="w-full aspect-[4/3] object-cover"
      />
    </div>
  );
};

export default PulseArticleHero;
