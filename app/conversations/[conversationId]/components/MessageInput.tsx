"use client";

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

type MessageInputProps = {
  placeholder?: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
};

const MessageInput: React.FC<MessageInputProps> = ({
  errors,
  register,
  id,
  placeholder,
  required,
  type,
}) => {
  return (
    <div className="relative w-full">
      <input
        type={type}
        id={id}
        autoComplete={id}
        {...register(id, { required })}
        placeholder={placeholder}
        className="w-full rounded-full bg-neutral-100 px-4 py-2 font-light text-black focus:outline-none"
      />
    </div>
  );
};

export default MessageInput;
