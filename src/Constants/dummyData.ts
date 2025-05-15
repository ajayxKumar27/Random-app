import { FaAppStoreIos, FaUser } from "react-icons/fa";
import { IoChatbubblesOutline } from "react-icons/io5";

export const HomePageItems = [
  {
    id: 1,
    title: "User List",
    description: "A list of users with their details",
    icon: FaAppStoreIos, 
    route: "/users",
  },
  {
    id: 2,
    title: "Chat App",
    description: "let's chat with each other",
    icon: IoChatbubblesOutline , 
    route: "/chat",
  },
];