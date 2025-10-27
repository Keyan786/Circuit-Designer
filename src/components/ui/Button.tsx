import React from 'react'
import clsx from 'classnames'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'subtle' | 'destructive' | 'toggle'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  active?: boolean
}

const base = 'inline-flex items-center justify-center rounded-lg text-sm px-3 py-2 transition duration-150 ease-out shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.98]'

const variants: Record<ButtonVariant, string> = {
  primary: 'text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg hover:shadow-xl',
  secondary: 'text-slate-200 bg-slate-700 border border-slate-600 hover:bg-slate-600 hover:border-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900',
  outline: 'bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-700 focus:ring-offset-2 focus:ring-offset-slate-900',
  ghost: 'bg-transparent text-slate-300 hover:bg-slate-700 focus:ring-offset-2 focus:ring-offset-slate-900',
  subtle: 'bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600 focus:ring-offset-2 focus:ring-offset-slate-900',
  destructive: 'text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:ring-offset-2 focus:ring-offset-slate-900 shadow-lg hover:shadow-xl',
  toggle: 'bg-slate-700 text-slate-200 border border-slate-600 hover:bg-slate-600 focus:ring-offset-2 focus:ring-offset-slate-900 data-[active=true]:bg-purple-600 data-[active=true]:text-white data-[active=true]:border-purple-500 data-[active=true]:shadow-lg',
}

export function Button({ variant = 'secondary', active, className, ...props }: ButtonProps) {
  return (
    <button data-active={active ? 'true' : undefined} className={clsx(base, variants[variant], className)} {...props} />
  )
}

export default Button


