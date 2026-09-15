import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  aspect?: "16/9" | "3/2" | "1/1" | "4/3";
  priority?: boolean;
  className?: string;
  sizes?: string;
};

const aspectMap = {
  "16/9": "aspect-video",
  "3/2": "aspect-[3/2]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
};

export function ArticleImage({
  src,
  alt,
  aspect = "16/9",
  priority = false,
  className,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: Props) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-ink2",
        aspectMap[aspect],
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-0.5 bg-red" />
    </div>
  );
}
