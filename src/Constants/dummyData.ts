import { FaAppStoreIos, FaUser, FaGamepad, FaComments } from "react-icons/fa";
import { IoChatbubblesOutline } from "react-icons/io5";

export const HomePageItems = [
  {
    id: 1,
    title: "Communication & Collaboration",
    icon: FaComments,
    subCategory: [
      {
        id: 2,
        title: "Instant Messaging Platform",
        description: "Experience seamless, real-time conversations with individuals and groups. Share files, emojis, and stay connected securely from anywhere.",
        icon: IoChatbubblesOutline,
        route: "/chat",
      }
    ],
  },
  {
    id: 2,
    title: "Games & Entertainment",
    icon: FaGamepad,
    subCategory: [
      {
        id: 1,
        title: "2048 Puzzle Challenge",
        description: "Test your logic and strategy skills in the classic 2048 puzzle. Merge tiles, plan your moves, and aim for the highest score!",
        icon: FaAppStoreIos,
        route: "/games/2048",
      }
    ]
  },
];