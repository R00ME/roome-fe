import { twMerge } from 'tailwind-merge';

interface FloatingIconProps {
  src: string;
  alt: string;
  position: string;
  delay?: string;
  aspect?: string;
  size?: string;
  className?: string;
}

const FloatingIcon = ({
  src,
  alt,
  position,
  delay = '0s',
  aspect = 'aspect-square', // 기본값 1:1
  size,
  className,
}: FloatingIconProps) => {
  return (
    <img
      src={src}
      alt={alt}
      className={twMerge(
        'absolute',
        aspect,
        size,
        position,
        'floating-animation',
        className,
      )}
      style={{ animationDelay: delay }}
    />
  );
};

export default FloatingIcon;
