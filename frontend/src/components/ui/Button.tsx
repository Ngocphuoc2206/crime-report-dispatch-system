import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type BaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

type ButtonAsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonAsLink = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

const variantClassNames: Record<ButtonVariant, string> = {
  primary: "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)]",
  secondary:
    "border-2 border-slate-600 bg-transparent text-slate-700 hover:bg-white/50",
  ghost:
    "bg-transparent text-slate-700 hover:bg-red-50 hover:text-[var(--primary)]",
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  if (typeof props.href === "string") {
    const {
      children,
      variant = "primary",
      className = "",
      href,
      ...anchorProps
    } = props;
    const classes = [
      "inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-bold transition",
      variantClassNames[variant],
      className,
    ].join(" ");

    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const {
    children,
    variant = "primary",
    className = "",
    ...buttonProps
  } = props;
  const classes = [
    "inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-bold transition disabled:pointer-events-none disabled:opacity-60",
    variantClassNames[variant],
    className,
  ].join(" ");

  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
