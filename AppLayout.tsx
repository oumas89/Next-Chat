import { ReactNode } from 'react';
import BottomNav from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export default function AppLayout({ children, hideNav = false }: AppLayoutProps) {
  return (
    <div className="flex flex-col h-full bg-background max-w-md mx-auto relative overflow-hidden shadow-2xl">
      <main className={`flex-1 overflow-hidden ${hideNav ? '' : 'pb-[72px]'}`}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
}
