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
    <div className="w-full max-w-6xl mx-auto mb-12 rounded-3xl bg-white/80 shadow-2xl backdrop-blur-md p-4 sm:p-6 md:p-8 border border-gray-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 rounded-full h-14 w-14 sm:h-16 sm:w-16 flex items-center justify-center shadow-inner">
            <MainIcon className="text-2xl sm:text-3xl text-blue-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
            {item.title}
          </h2>
        </div>
        {item.route && (
          <Link
            href={item.route}
            className="ml-auto mt-2 sm:mt-0 px-4 py-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold shadow hover:brightness-110 transition"
          >
            Explore
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {item?.subCategory?.map((app) => {
          const AppIcon = app?.icon;
          return (
            <Link
              href={app?.route}
              key={app?.id}
              className="group flex flex-col justify-start bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl shadow-lg p-4 sm:p-6 h-44 sm:h-48 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
            >
              <div className="flex items-center mb-3 sm:mb-4">
                <AppIcon className="text-2xl sm:text-3xl mr-2 sm:mr-3 group-hover:rotate-6 transition-transform duration-300" />
                <h3 className="text-base sm:text-lg font-semibold">{app.title}</h3>
              </div>
              <p className="text-sm text-white/90 line-clamp-3">{app.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default HomePageCard;