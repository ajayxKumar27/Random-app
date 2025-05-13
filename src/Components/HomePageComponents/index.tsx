import React from "react";
import HomePageCard from "./HomePageCard";
import { HomePageItems } from "@/Constants/dummyData";

const Index = () => {
  return (
    <div className="HomePage grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 p-6">
      {HomePageItems?.map((item) => (
        <HomePageCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default Index;