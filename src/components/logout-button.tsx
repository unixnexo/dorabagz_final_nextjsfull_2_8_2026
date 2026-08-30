// "use client";

// import { logoutAction } from "@/server/auth/logout-action";

// export function LogoutButton() {
//   return (
//     <form action={logoutAction}>
//       <button type="submit">خروج از حساب</button>
//     </form>
//   );
// }



"use client";

import { logoutAction } from "@/server/auth/logout-action";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type LogoutButtonProps = {
  variant?: "icon" | "default";
};

export function LogoutButton({
  variant = "default",
}: LogoutButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {variant === "icon" ? (
          <Button
            variant="ghost"
            size="icon"
            className="flex size-11 items-center justify-center rounded-2xl border border-white/60 bg-white/50 text-black/65 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-200 hover:bg-white/70 hover:text-black active:scale-90 active:bg-white/80"
          >
            <LogOut className="!size-[18px] text-black/70" />
          </Button>
        ) : (
          <Button
            variant="destructive"
            className="gap-2 text-white w-full shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-200 hover:bg-white/70 hover:text-black active:scale-95"
          >
            <LogOut className="size-4" />
            خروج از حساب
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>از حساب خارج شوید؟</AlertDialogTitle>
          <AlertDialogDescription>
            آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>انصراف</AlertDialogCancel>

          <form action={logoutAction}>
            <AlertDialogAction asChild>
              <Button type="submit" className="w-full">خروج از حساب</Button>
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
