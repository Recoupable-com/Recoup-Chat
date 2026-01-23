interface PulseGreetingProps {
  message: string;
}

const PulseGreeting = ({ message }: PulseGreetingProps) => {
  return <p className="text-base text-muted-foreground leading-relaxed">{message}</p>;
};

export default PulseGreeting;
