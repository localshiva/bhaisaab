import { FC, SVGProps } from "react";

export const SmallLogo: FC<SVGProps<SVGSVGElement>> = props => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
      <path
        d="M8,6 C12,6 14,8 14,10.5 C14,12 13,13 12,13.5 C13.5,14 15,15.5 15,17.5 C15,20.5 12,24 8,24 L6,24 L6,6 L8,6 Z"
        fill="#2a9d8f"
        stroke="#e76f51"
        stroke-width="1"
      />

      <path
        d="M8,8 L8,11 C9.5,11 10.5,10.5 10.5,9.5 C10.5,8.5 9.5,8 8,8 Z"
        fill="#f4a261"
      />
      <path
        d="M8,16 L8,22 C10,22 11.5,20.5 11.5,19 C11.5,17 10,16 8,16 Z"
        fill="#f4a261"
      />
    </svg>
  );
};
