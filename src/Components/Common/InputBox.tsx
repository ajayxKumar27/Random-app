'use client';
import React from 'react';

interface InputProps {
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    autoFocus?: boolean;
}

const InputBox: React.FC<InputProps> = ({
    type = 'text',
    placeholder,
    value,
    onChange,
    autoFocus,
    onKeyDown
}) => {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoFocus={autoFocus}
            onKeyDown={onKeyDown}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    );
};

export default InputBox;
