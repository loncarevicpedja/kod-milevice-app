import Image from "next/image";

export function PromoImage({
  src,
  alt,
  className,
  priority = false,
  sizes,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const unoptimized = src.startsWith("http://") || src.startsWith("https://");
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={className}
      priority={priority}
      sizes={sizes}
      unoptimized={unoptimized}
    />
  );
}
