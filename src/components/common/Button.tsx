import {ChildProcess} from 'child_process';

type ButtonProps = {
	children: React.ReactNode;
	onClick?: () => void;
	type?: 'button' | 'submit' | 'reset';
	color?: string;
	disabled?: boolean;
	className?: string;
};

const Button: React.FC<ButtonProps> = ({children, onClick, type = 'button', color = '', disabled = false, className = ''}) => {
	return (
		<button
			className={`text-white p-3 rounded-md hover:opacity-80 transition duration-150 hover:cursor-pointer ${
				color == '' ? 'bg-zinc-800' : color
			} ${className}`}
			onClick={onClick}
			type={type}
			disabled={disabled}
		>
			{children}
		</button>
	);
};

export default Button;
