export function Divider({ my = 60 }: { my?: number }) {
  return (
    <div style={{ height: 1, background: "#E8E6E1", margin: `${my}px 0` }} />
  );
}
