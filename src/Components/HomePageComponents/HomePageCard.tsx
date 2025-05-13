import Link from "next/link";
import React from "react";

interface HomePageCardProps {
  item: {
    id: number;
    title: string;
    description: string;
    icon: React.ElementType; 
    route: string;
  };
}

const HomePageCard: React.FC<HomePageCardProps> = ({ item }) => {
  const Icon = item.icon;

  return (
    <div
      className="flex flex-col items-center 
      justify-center h-40 w-auto bg-gradient-to-r from-blue-500
       to-purple-600 text-white font-bold text-center rounded-lg 
       shadow-lg hover:scale-105 transition-transform duration-300
       cursor-pointer"
    >
      <Link href={item.route} className="flex flex-col items-center">
      <Icon className="text-4xl mb-2" /> 
      <h3 className="text-lg">{item.title}</h3>
      <p className="text-sm font-light">{item.description}</p>
      </Link>
    </div>
  );
};

export default HomePageCard;