import { readFileSync } from "fs";
import { join } from "path";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "SetFrame — websites and systems that quietly run your business";

// Source artwork lives in public/brand (not the app dir), so it is composed
// here rather than picked up directly by Next's static opengraph-image
// convention. Lets us add the caption line without touching the artwork file.
export default function OpengraphImage() {
  const source = readFileSync(
    join(process.cwd(), "public/brand/opengraph-source.png")
  );
  const sourceDataUrl = `data:image/png;base64,${source.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sourceDataUrl}
          alt=""
          width={size.width}
          height={size.height}
          style={{ position: "absolute", inset: 0 }}
        />
        {/* Small outcome-phrase caption directly under the baked-in
            [SetFrame] wordmark. Kept light and small on purpose — a
            legible accent at thumbnail size, not a second headline. */}
        <div
          style={{
            position: "absolute",
            left: 92,
            top: 494,
            display: "flex",
            fontSize: 22,
            letterSpacing: 2,
            color: "rgba(245,245,244,0.55)",
          }}
        >
          catch what slips away
        </div>
      </div>
    ),
    { ...size }
  );
}
