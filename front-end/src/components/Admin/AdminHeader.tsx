import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AppBar from "@mui/material/AppBar";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { deepOrange } from "@mui/material/colors";
import { EnvironmentVariables } from "@/configurations/EnvironmentVariable";

export default function AdminHeader() {
  return (
    <AppBar position="fixed" sx={{ zIndex: 2000 }}>
      <Toolbar sx={{ backgroundColor: "background.paper" }}>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <DashboardIcon
              sx={{ color: "#444", mr: 2, transform: "translateY(-2px)" }}
            />
            <Typography variant="h6" color="text.primary">
              Hoàng Dương
            </Typography>
          </Box>

          <Avatar sx={{ bgcolor: deepOrange[500] }}>BD</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
