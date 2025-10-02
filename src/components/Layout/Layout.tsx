
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import AssistantChat from '../AssistantChat';

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

export default function Layout({ children, hideFooter = false }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
      {!hideFooter && <Footer />}
      <AssistantChat />
    </div>
  );
}