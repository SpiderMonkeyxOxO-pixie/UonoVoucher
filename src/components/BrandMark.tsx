export function BrandMark({ size = 36 }: { size?: number }) {
  return (
    <img
      src="/uonovoucher-logo.png"
      alt=""
      width={size}
      height={size}
      className="brand-mark"
      aria-hidden="true"
    />
  );
}
