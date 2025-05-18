'use client';
import React from 'react';
import { HomePageItems } from '@/Constants/dummyData';
import Link from 'next/link';

const SocialPage = () => {
  const socialApps = HomePageItems[0]?.subCategory || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-white p-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-8">{HomePageItems[0]?.title}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {socialApps.map((app) => {
          const AppIcon = app.icon;
          return (
            <Link
              href={app.route}
              key={app.id}
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

export default SocialPage;