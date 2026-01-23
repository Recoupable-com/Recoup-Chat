interface PulseArticleSectionProps {
  title: string;
  items: string[];
}

const PulseArticleSection = ({ title, items }: PulseArticleSectionProps) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold">{title}</h3>
      <ul className="flex flex-col gap-1 pl-4">
        {items.map((item, index) => (
          <li key={index} className="list-disc text-base">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PulseArticleSection;
