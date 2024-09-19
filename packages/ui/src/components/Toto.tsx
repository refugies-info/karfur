import React from "react";

export interface TotoProps extends React.HTMLProps<HTMLDivElement> {
  onClick?: () => void;
}

export const Toto = ({ children, onClick, ...props }: TotoProps): React.ReactElement => {
  return (
    <div className=" bg-funkyfreshblue " onClick={onClick} {...props}>
      {children}
    </div>
  );
};
