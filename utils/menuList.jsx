import {
  LayoutDashboard,
  FileText,
  Layers,
  Users,
  MessageSquare,
  Image as ImageIcon,
} from "lucide-react";

export const menuList = [
  {
    name: "Dashboard",
    href: "/",
    icon: <LayoutDashboard size={20} />,
  },
  {
    name: "Posts",
    href: "/posts",
    icon: <FileText size={20} />,
  },
  {
    name: "Categories",
    href: "/categories",
    icon: <Layers size={20} />,
  },
  {
    name: "Subscribers",
    href: "/subscriber",
    icon: <Users size={20} />,
  },
  {
    name: "Messages",
    href: "/messages",
    icon: <MessageSquare size={20} />,
  },
  {
    name: "Media Library",
    href: "/media-library",
    icon: <ImageIcon size={20} />,
  },
];
