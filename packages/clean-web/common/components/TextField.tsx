import clsx from 'clsx';
import { forwardRef } from 'react';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

// eslint-disable-next-line react/display-name
export const TextField: React.FC<TextFieldProps> = forwardRef<HTMLInputElement, TextFieldProps>(({ label, ...props }, ref) => (
  <>
    {label && (
      <label
        className={clsx([
        'mb-1 block',
      ])}
        htmlFor={props.id}
      >
        {label}
      </label>
  )}
    <input
      className={clsx([
      'h-10 rounded-sm bg-zinc-200 p-1 dark:bg-zinc-800',
      'focus:outline-none focus-visible:outline-zinc-300 dark:focus-visible:outline-zinc-700',
    ])}
      {...props}
      ref={ref}
    />
  </>
));
