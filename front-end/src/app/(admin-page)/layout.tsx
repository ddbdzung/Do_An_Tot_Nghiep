import AdminHeader from "@/components/Admin/AdminHeader";
import AdminNavbar from "@/components/Admin/AdminNavbar";
import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import { Providers } from "@/redux/provider";
import { Box } from "@mui/material";

export const metadata = {
  title: "Next.js App Router + Material UI v5",
  description: "Next.js App Router + Material UI v5",
};

const DRAWER_WIDTH = 240;

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ThemeRegistry>
            <AdminHeader />
            <AdminNavbar />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                bgcolor: "background.default",
                ml: `${DRAWER_WIDTH}px`,
                mt: ["48px", "56px", "64px"],
                p: 3,
              }}
            >
              {children}
            </Box>
          </ThemeRegistry>
        </Providers>
      </body>
    </html>
  );
}

export default RootLayout;
