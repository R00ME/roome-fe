import { useEffect, useRef, useState } from 'react';

export default function SlidingTitle({
  text,
  width,
}: {
  text: string;
  width: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [speed, setSpeed] = useState(10);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const textWidth = textRef.current.scrollWidth;

    if (textWidth > containerWidth) {
      setShouldAnimate(true);
      setSpeed(textWidth / 50);
    } else {
      setShouldAnimate(false);
    }
  }, [text, width]);

  return (
    <div
      ref={containerRef}
      style={{ width }}
      className="overflow-hidden whitespace-nowrap relative h-full"
    >
      <div
        className={`flex ${shouldAnimate ? 'animate-marquee' : ''}`}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        <span ref={textRef} className="pr-8 font-bold text-[#142b4b] text-sm xl:text-lg 2xl:text-xl">
          {text}
        </span>
        {shouldAnimate && (
          <span className="pr-8 font-bold text-[#142b4b] text-sm xl:text-lg 2xl:text-xl">
            {text}
          </span>
        )}
      </div>
    </div>
  );
}
