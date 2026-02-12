import NextImage, { type ImageProps as NextImageProps } from "next/image";

type ImageFit = "contain" | "cover" | "fill" | "none";
type ImageRounded = "none" | "sm" | "md" | "lg" | "full";

interface CustomImageProps extends Omit<NextImageProps, "objectFit"> {
  fit?: ImageFit;
  rounded?: ImageRounded;
  aspectRatio?: string;
  fallbackSrc?: string;
}

const fitStyles: Record<ImageFit, string> = {
  contain: "object-contain",
  cover: "object-cover",
  fill: "object-fill",
  none: "object-none",
};

const roundedStyles: Record<ImageRounded, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

export default function CustomImage({
  fit = "cover",
  rounded = "none",
  aspectRatio,
  className = "",
  ...rest
}: CustomImageProps) {
  const classes = [fitStyles[fit], roundedStyles[rounded], className]
    .filter(Boolean)
    .join(" ");

  if (aspectRatio) {
    return (
      <div className={`relative overflow-hidden ${roundedStyles[rounded]}`} style={{ aspectRatio }}>
        <NextImage className={`${fitStyles[fit]} ${className}`} fill {...rest} />
      </div>
    );
  }

  return <NextImage className={classes} {...rest} />;
}
