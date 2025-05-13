'use client';
import React from 'react';

interface ButtonProps {
    onClick?: () => void;
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    onClick,
    children,
    type = 'button',
    className = '',
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`transition duration-200 ease-in-out px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
