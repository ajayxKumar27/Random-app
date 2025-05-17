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
    subCategory: SubCategoryItem[];
  };
}

const HomePageCard: React.FC<HomePageCardProps> = ({ item }) => {
  const MainIcon = item.icon;

  return (
    <div className="w-full max-w-8/12 mx-auto mb-12 rounded-3xl bg-white/80 shadow-2xl backdrop-blur-md p-8 border border-gray-200">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-blue-100 rounded-full h-16 w-16 flex items-center justify-center shadow-inner">
          <MainIcon className="text-3xl text-blue-600" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">
          {item.title}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {item?.subCategory?.map((app) => {
          const AppIcon = app?.icon;
          return (
            <Link
              href={app?.route}
              key={app?.id}
              className="group flex flex-col justify-start bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl shadow-lg p-6 h-48 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
            >
              <div className="flex items-center mb-4">
                <AppIcon className="text-3xl mr-3 group-hover:rotate-6 transition-transform duration-300" />
                <h3 className="text-lg font-semibold">{app.title}</h3>
              </div>
              <p className="text-sm text-white/90">{app.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default HomePageCard;
