import Image from "next/image";
import { projectPreview } from "../lib/project-preview";
import styles from "./project-detail.module.css";
import devices from "./project-devices.module.css";

/** Device frames are presentation only; the image link always opens the source. */
export function ProjectScreen({ image, width, height, alt, label, caption, presentation = "plain", className = "" }: {
  image: string;
  width: number;
  height: number;
  alt: string;
  label: string;
  caption?: string;
  presentation?: "plain" | "phone" | "laptop" | "monitor";
  className?: string;
}) {
  const artwork = <Image src={projectPreview(image)} width={width} height={height} alt={alt} unoptimized />;

  return (
    <figure className={`${styles.screen} ${className}`}>
      <a href={image} target="_blank" rel="noreferrer" aria-label={`Open ${label} at full size`} data-pointer-feedback="local">
        {presentation === "plain" ? (
          <span className={styles.screenArtwork}>{artwork}</span>
        ) : (
          <span className={`${devices.artwork} ${devices[presentation]}`}>
            <span className={devices.body}>
              <span className={devices.bezel}>
                <span className={devices.viewport}>{artwork}</span>
              </span>
            </span>
            {presentation !== "phone" && <span className={devices.base} aria-hidden="true" />}
          </span>
        )}
      </a>
      <figcaption>
        <span className={styles.screenLabel}>{label}</span>
        {caption && <p>{caption}</p>}
      </figcaption>
    </figure>
  );
}
