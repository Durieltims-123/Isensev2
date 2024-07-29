"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "next-auth/react";
import { logout } from "@/actions/logout";
import { useRouter } from 'next/navigation';
interface UserNavProps {
  onOpenModal: () => void;
}

export const UserNav: React.FC<UserNavProps> = ({ onOpenModal }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const onOpen = ()=>{
    console.log("open")
  }
  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={session.user?.image ?? ""}
                alt={session.user?.name ?? ""}
              />
              <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuItem className="font-normal" onClick={()=>onOpenModal()}>
                {session.user?.name}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            logout();
          }
          }>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu >
    );
  }
}
