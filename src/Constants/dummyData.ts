import { FaAppStoreIos, FaUser } from "react-icons/fa";

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
    title: "Admin Panel",
    description: "Manage admin settings and users",
    icon: FaUser, 
    route: "/admin-panel",
  },
];