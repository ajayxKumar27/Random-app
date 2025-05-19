'use client';
import React from 'react';
import { HomePageItems } from '@/Constants/dummyData';
import Link from 'next/link';
import { useSelector } from "react-redux";
import type { RootState } from "@/Store";

const SocialPage = () => {
  const socialApps = HomePageItems[0]?.subCategory || [];
  const dark = useSelector((state: RootState) => state.theme.dark);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      dark
        ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950"
        : "bg-gradient-to-br from-blue-100 via-purple-100 to-white"
    } p-6`}>
      <h1 className={`text-3xl sm:text-4xl font-bold mb-8 ${
        dark ? "text-purple-200" : "text-blue-700"
      }`}>{HomePageItems[0]?.title}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {socialApps.map((app) => {
          const AppIcon = app.icon;
          return (
            <Link
              href={app.route}
              key={app.id}
              className={`group flex flex-col justify-start rounded-2xl shadow-xl p-5 sm:p-7 h-48 transition-all duration-300 hover:scale-[1.04] hover:shadow-2xl border-2
                ${dark
                  ? "bg-gradient-to-br from-gray-800 via-gray-900 to-purple-950 border-gray-700 hover:bg-purple-950"
                  : "bg-gradient-to-br from-blue-500 to-purple-600 border-blue-200 hover:bg-blue-600"
                }`}
            >
              <div className="flex items-center mb-4">
                <AppIcon className={`text-3xl sm:text-4xl mr-3 group-hover:rotate-6 transition-transform duration-300 ${
                  dark ? "text-purple-300" : "text-white"
                }`} />
                <h3 className={`text-lg sm:text-xl font-semibold ${
                  dark ? "text-purple-100" : "text-white"
                }`}>{app.title}</h3>
              </div>
              <p className={`text-sm sm:text-base line-clamp-3 ${
                dark ? "text-gray-300" : "text-white/90"
              }`}>{app.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SocialPage;