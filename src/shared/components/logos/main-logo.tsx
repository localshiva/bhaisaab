import { FC, SVGProps } from "react";

export const MainLogo: FC<SVGProps<SVGSVGElement>> = props => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" {...props}>
      <g transform="translate(145, 150) scale(0.8)">
        <path
          d="M-20,-50 C10,-50 30,-35 30,-15 C30,0 20,10 10,15 C25,20 40,35 40,55 C40,80 15,100 -20,100 L-40,100 L-40,-50 L-20,-50 Z"
          fill="#2a9d8f"
          stroke="#e76f51"
          stroke-width="8"
        />

        <path
          d="M-20,-30 L-20,0 C0,0 10,-5 10,-15 C10,-25 0,-30 -20,-30 Z"
          fill="#f4a261"
          stroke="#f4a261"
          stroke-width="4"
        />

        <path
          d="M-20,20 L-20,80 C5,80 15,70 15,50 C15,30 5,20 -20,20 Z"
          fill="#f4a261"
          stroke="#f4a261"
          stroke-width="4"
        />
      </g>

      <g transform="translate(205, 169)">
        <text
          font-family="Arial, sans-serif"
          font-size="60"
          font-weight="bold"
          fill="#f4a261"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          <tspan x="0" y="0">
            H
          </tspan>
        </text>
      </g>

      <g transform="translate(251, 158) rotate(180)">
        <text
          font-family="Arial, sans-serif"
          font-size="60"
          font-weight="bold"
          fill="#2a9d8f"
          text-anchor="middle"
          dominant-baseline="middle"
          style={{
            filter: "drop-shadow(1px 1px 1px #e76f51)",
          }}
        >
          <tspan x="0" y="0">
            A
          </tspan>
        </text>
      </g>

      <g transform="translate(370, 169)">
        <text
          font-family="Arial, sans-serif"
          font-size="60"
          font-weight="bold"
          fill="#f4a261"
          text-anchor="middle"
          dominant-baseline="middle"
        >
          <tspan x="0" y="0">
            ISAAB
          </tspan>
        </text>
      </g>
    </svg>
  );
};
