"use client";

import clsx from "clsx";
import Link from "next/link";

type MobileItemProps = {
  label: string;
  icon: any;
  href: string;
  onClick?: () => void;
  active?: boolean;
};

const MobileItem: React.FC<MobileItemProps> = ({
  label,
  icon: Icon,
  href,
  onClick,
  active,
}) => {
  const handleClick = () => onClick && onClick();

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={clsx(
        "group flex w-full justify-center gap-x-3 p-4 text-sm font-semibold leading-6  hover:bg-gray-100 hover:text-black",
        active ? "bg-gray-100 text-black" : "text-gray-500"
      )}
    >
      <Icon className="h-6 w-6" />
      <span className="sr-only">{label}</span>
    </Link>
  );
};

export default MobileItem;
