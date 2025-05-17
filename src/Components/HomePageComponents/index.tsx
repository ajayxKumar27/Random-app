import React from "react";
import HomePageCard from "./HomePageCard";
import { HomePageItems } from "@/Constants/dummyData";

const Index = () => {
  return (
    <div className="HomePage w-full p-[5px] sm:p-4">
      {HomePageItems?.map((item) => (
        <HomePageCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default Index;