// @ts-nocheck
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
import BallotIcon from "@mui/icons-material/Ballot";

const DRAWER_WIDTH = 240;

const LINKS = [
  { text: "Trang chủ", href: "/admin", icon: HomeIcon },
  { text: "Quản lý người dùng", href: "/admin/manage/users", icon: PeopleIcon },
  {
    text: "Quản lý đơn hàng",
    href: "/admin/manage/orders",
    icon: ReceiptLongIcon,
  },
  {
    text: "Quản lý sản phẩm",
    href: "/admin/manage/products",
    icon: BallotIcon,
  },
  {
    text: "Lắp đặt - bảo trì",
    href: "/admin/servicing",
    icon: PlumbingIcon,
  },
];

const PLACEHOLDER_LINKS = [
  { text: "Settings", icon: SettingsIcon },
  { text: "Support", icon: SupportIcon },
  { text: "Logout", icon: LogoutIcon },
];

export default function AdminNavbar() {
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
          {PLACEHOLDER_LINKS.map(({ text, icon: Icon }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
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
