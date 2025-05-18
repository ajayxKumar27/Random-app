import Link from "next/link";
import React from "react";

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

  return (
    <div className="w-full max-w-6xl mx-auto mb-8 sm:mb-12 rounded-3xl bg-white/80 shadow-2xl backdrop-blur-md p-3 sm:p-4 md:p-8 border border-gray-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="bg-blue-100 rounded-full h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 flex items-center justify-center shadow-inner">
            <MainIcon className="text-xl sm:text-2xl md:text-3xl text-blue-600" />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 tracking-tight">
            {item.title}
          </h2>
        </div>
        {item.route && (
          <Link
            href={item.route}
            className="ml-0 sm:ml-auto mt-2 sm:mt-0 px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold shadow hover:brightness-110 transition text-sm sm:text-base"
          >
            Explore
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {item?.subCategory?.map((app) => {
          const AppIcon = app?.icon;
          return (
            <Link
              href={app?.route}
              key={app?.id}
              className="group flex flex-col justify-start bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 h-40 sm:h-44 md:h-48 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
            >
              <div className="flex items-center mb-2 sm:mb-3 md:mb-4">
                <AppIcon className="text-xl sm:text-2xl md:text-3xl mr-2 sm:mr-3 group-hover:rotate-6 transition-transform duration-300" />
                <h3 className="text-sm sm:text-base md:text-lg font-semibold">{app.title}</h3>
              </div>
              <p className="text-xs sm:text-sm text-white/90 line-clamp-3">{app.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default HomePageCard;