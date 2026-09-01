interface FolderShapeProps {
  color: string;
  tabColor: string;
  width?: number;
  height?: number;
  className?: string;
}

export function FolderShape({ color, tabColor, width = 110, height = 88, className = "" }: FolderShapeProps) {
  const tabW = Math.round(width * 0.48);
  const tabH = Math.round(height * 0.22);
  const bodyY = tabH - 2;
  const bodyH = height - bodyY;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Tab */}
      <path
        d={`M6 0 H${tabW - 10} Q${tabW} 0 ${tabW} ${tabH - 4} L${tabW + 8} ${tabH - 4} Q${tabW + 13} ${tabH - 4} ${tabW + 14} ${tabH} H6 Q0 ${tabH} 0 ${tabH - 6} V6 Q0 0 6 0 Z`}
        fill={tabColor}
      />
      {/* Body */}
      <rect x={0} y={bodyY} width={width} height={bodyH} rx={6} fill={color} />
      {/* Shine */}
      <rect
        x={0} y={bodyY} width={width} height={Math.min(bodyH * 0.3, 16)}
        rx={6} fill="rgba(255,255,255,0.2)"
      />
    </svg>
  );
}
