import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { NextPage } from 'next';

interface IProps {
  children: React.ReactNode;
}

const Layout: NextPage<IProps> = ({ children }) => (
  <div>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </div>
);

export default Layout;
