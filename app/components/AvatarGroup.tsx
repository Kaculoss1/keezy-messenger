"use client";

import { User } from "@prisma/client";
import Image from "next/image";

type AvatarGroupProps = {
  users?: User[];
};

const AvatarGroup: React.FC<AvatarGroupProps> = ({ users = [] }) => {
  const sliceUsers = users.slice(0, 3);

  const positionMap = ["top-0 left-[12px]", "bottom-0", "bottom-0 right-0"];

  return (
    <div className="relative h-11 w-11">
      {sliceUsers.map((user, index) => (
        <div
          key={user.id}
          className={`absolute inline-block h-[21px] w-[21px] overflow-hidden rounded-full ${positionMap[index]}`}
        >
          <Image
            alt="avatar"
            src={user?.image || "/images/placeholder.jpg"}
            fill
          />
        </div>
      ))}
      {/* <span className="absolute right-0 top-0 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-white md:h-3 md:w-3" /> */}
    </div>
  );
};

export default AvatarGroup;
