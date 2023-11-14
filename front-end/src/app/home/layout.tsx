import * as React from 'react';
import { Providers } from '@/redux/provider';
import HomeHeader from '@/components/Home/HomeHeader';
import './style.css';

export const metadata = {
  title: 'Công ty TNHH Hoàng Dương',
  description: 'Trang chủ',
};

function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <HomeHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}

export default HomeLayout;
