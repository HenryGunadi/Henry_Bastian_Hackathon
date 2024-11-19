import { ChildProcess } from "child_process";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  color?: string;
  disabled: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, onClick, type = "button", color = "", disabled = false }) => {
  return (
    <button className={`text-white p-3 rounded-md hover:opacity-50 transition duration-300 hover:cursor-pointer ${color == "" ? "bg-zinc-800" : color}`} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
