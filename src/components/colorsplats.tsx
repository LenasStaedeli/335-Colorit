import { useMemo } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

const COLORS = ["#E8734A", "#3D6FA8", "#7AA64A", "#F2C14E", "#8E6BBF", "#E85D9A"];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Unregelmässiger Klecks mit einzelnen Zacken, weich verbunden
function blobPath(cx: number, cy: number, r: number): string {
  const n = 16;
  const pts = Array.from({ length: n }, (_, i) => {
    const angle = (i / n) * Math.PI * 2;
    const factor = Math.random() < 0.3 ? rand(1.5, 2.1) : rand(0.7, 1.1);
    return {
      x: cx + Math.cos(angle) * r * factor,
      y: cy + Math.sin(angle) * r * factor,
    };
  });

  const mid = (a: { x: number; y: number }, b: { x: number; y: number }) => ({
    x: (a.x + b.x) / 2,
    y: (a.y + b.y) / 2,
  });

  const start = mid(pts[n - 1], pts[0]);
  let d = `M ${start.x} ${start.y}`;
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const m = mid(p, pts[(i + 1) % n]);
    d += ` Q ${p.x} ${p.y} ${m.x} ${m.y}`;
  }
  return d + " Z";
}

export default function ColorSplats({ count = 8 }: { count?: number }) {
  const { width, height } = useWindowDimensions();

  const splats = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const cx = rand(0, width);
        const cy = rand(0, height);
        const r = rand(22, 50);

        const droplets = Array.from({ length: Math.floor(rand(5, 11)) }, (_, j) => {
          const angle = rand(0, Math.PI * 2);
          const dist = r * rand(1.5, 3.2);
          return {
            key: j,
            x: cx + Math.cos(angle) * dist,
            y: cy + Math.sin(angle) * dist,
            r: Math.max(1.5, r * rand(0.04, 0.2) * (3.2 / (dist / r))),
          };
        });

        return {
          key: i,
          color: pick(COLORS),
          path: blobPath(cx, cy, r),
          droplets,
        };
      }),
    [count, width, height]
  );

  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      {splats.map((s) => (
        <Path key={s.key} d={s.path} fill={s.color} opacity={0.85} />
      ))}
      {splats.map((s) =>
        s.droplets.map((d) => (
          <Circle
            key={`${s.key}-${d.key}`}
            cx={d.x}
            cy={d.y}
            r={d.r}
            fill={s.color}
            opacity={0.85}
          />
        ))
      )}
    </Svg>
  );
}