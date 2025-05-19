'use client';
import React from "react";
import HomePageCard from "./HomePageCard";
import { HomePageItems } from "@/Constants/dummyData";
import { useSelector } from "react-redux";
import type { RootState } from "@/Store";

const Index = () => {
  const dark = useSelector((state: RootState) => state.theme.dark);

  return (
    <div
      className={`HomePage w-full min-h-screen transition-colors duration-300 ${
        dark
          ? "bg-gray-900"
          : "bg-gradient-to-br from-blue-100 via-purple-100 to-white"
      }`}
    >
      <div className="flex flex-wrap gap-6 w-full py-8 px-8">
        {HomePageItems?.map((item) => (
          <HomePageCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Index;