import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/Store";

interface SubCategoryItem {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  route: string;
}

interface HomePageCardProps {
  item: {
    id: number;
    title: string;
    icon: React.ElementType;
    route?: string;
    subCategory: SubCategoryItem[];
  };
}

const HomePageCard: React.FC<HomePageCardProps> = ({ item }) => {
  const MainIcon = item.icon;
  const dark = useSelector((state: RootState) => state.theme.dark);

  return (
    <div
      className={`sm:mb-12 rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 border transition-colors duration-300
        ${dark
          ? "bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 border-gray-700"
          : "bg-gradient-to-br from-white via-blue-50 to-purple-100 border-blue-100"
        }
        w-full max-w-md
      `}
    >
      <div className="flex items-center gap-4 mb-6">
        <div className={`rounded-full h-14 w-14 flex items-center justify-center shadow-inner
          ${dark ? "bg-purple-900" : "bg-blue-100"}
        `}>
          <MainIcon className={`text-2xl md:text-3xl ${dark ? "text-purple-300" : "text-blue-600"}`} />
        </div>
        <h2 className={`text-2xl md:text-3xl font-bold tracking-tight
          ${dark ? "text-purple-100" : "text-blue-900"}
        `}>
          {item.title}
        </h2>
        {item.route && (
          <Link
            href={item.route}
            className="ml-auto px-4 py-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold shadow hover:brightness-110 transition text-sm"
          >
            Explore
          </Link>
        )}
      </div>
    </div>
  );
};

export default HomePageCard;