import {
  LayoutDashboard,
  FileText,
  Layers,
  Users,
  MessageSquare,
  Image as ImageIcon,
  Briefcase,
  FolderDot,
  Star,
  UsersRound,
  Mail,
  ShieldAlert,
  UserCog,
  Bell,
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
    name: "Services",
    href: "/services",
    icon: <Briefcase size={20} />,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: <FolderDot size={20} />,
  },
  {
    name: "Testimonials",
    href: "/testimonials",
    icon: <Star size={20} />,
  },
  {
    name: "Team",
    href: "/team",
    icon: <UsersRound size={20} />,
  },
  {
    name: "Users",
    href: "/users",
    icon: <UserCog size={20} />,
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
    name: "Notifications",
    href: "/notifications",
    icon: <Bell size={20} />,
  },
  {
    name: "Media Library",
    href: "/media-library",
    icon: <ImageIcon size={20} />,
  },
  {
    name: "Campaigns",
    href: "/campaigns",
    icon: <Mail size={20} />,
  },
  {
    name: "Audit Logs",
    href: "/audit-logs",
    icon: <ShieldAlert size={20} />,
  },
];
