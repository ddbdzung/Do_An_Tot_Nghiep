import * as React from 'react';
import { Providers } from '@/redux/provider';

export const metadata = {
  title: 'Công ty TNHH Hoàng Dương',
  description: 'Trang chủ',
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

export default RootLayout;
