"use client";
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ChecklistIcon from "@mui/icons-material/Checklist";
import SettingsIcon from "@mui/icons-material/Settings";
import SupportIcon from "@mui/icons-material/Support";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import PeopleIcon from "@mui/icons-material/People";
import PlumbingIcon from "@mui/icons-material/Plumbing";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import BallotIcon from "@mui/icons-material/Ballot";
import { useAppDispatch } from "@/redux/hooks";
import { signOut } from "@/redux/features/authSlice";
import { notifySuccess } from "@/utils/notify";
import { clearCart } from "@/redux/features/cartSlice";
import { clearCheckout } from "@/redux/features/checkoutSlice";

const DRAWER_WIDTH = 240;

const LINKS = [
  { text: "Home Page", href: "/admin", icon: HomeIcon },
  { text: "Manage Users", href: "/admin/manage/users", icon: PeopleIcon },
  {
    text: "Manage Orders",
    href: "/admin/manage/orders",
    icon: ReceiptLongIcon,
  },
  {
    text: "Manage Products",
    href: "/admin/manage/products",
    icon: BallotIcon,
  },
  {
    text: "Manage Categories",
    href: "/admin/manage/categories",
    icon: LocalOfferIcon,
  },
  {
    text: "Services",
    href: "/admin/servicing",
    icon: PlumbingIcon,
  },
];

export default function AdminNavbar() {
  const PLACEHOLDER_LINKS = [
    { text: "Settings", icon: SettingsIcon },
    { text: "Support", icon: SupportIcon },
    {
      text: "Logout",
      icon: LogoutIcon,
      onClick: () => {
        dispatch(signOut());
        dispatch(clearCart());
        dispatch(clearCheckout());
        notifySuccess("Sign out success!");
      },
    },
  ];

  const dispatch = useAppDispatch();
  return (
    <>
      <Drawer
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            top: ["48px", "56px", "64px"],
            height: "auto",
            bottom: 0,
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Divider />
        <List>
          {LINKS.map(({ text, href, icon: Icon }) => (
            <ListItem key={href} disablePadding>
              <ListItemButton component={Link} href={href}>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ mt: "auto" }} />
        <List>
          {PLACEHOLDER_LINKS.map(({ text, icon: Icon, onClick }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton onClick={onClick ? onClick : () => {}}>
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
