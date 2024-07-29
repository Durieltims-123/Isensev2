
import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";
import { cn } from "@/lib/utils";
import { MobileSidebar } from "./mobile-sidebar";
import { UserNav } from "./user-nav";
import Image from "next/image";
import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
interface HeaderProps {
  onOpenModal: () => void;
}
 const Header: React.FC<HeaderProps> = ({ onOpenModal }) => {


  return (
    <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
      <nav className="h-15 flex items-center justify-between px-4">
        <div className="hidden lg:block py-3">
          <Image
            width={50}
            priority
            height={50}
            alt="Website logo"
            src="https://utfs.io/f/612cf32a-4729-4649-b638-074983d0f3f7-1zbfv.png"
          />
        </div>
        <div className={cn("block lg:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          <UserNav onOpenModal={onOpenModal}/>
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
export default Header;