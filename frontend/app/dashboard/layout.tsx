"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Link2,
  ChevronRight,
  User2,
  LogOut,
  Home,
  User,
  Link,
  Moon,
  Sun,
  Loader2,
  Link2Icon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import { logout } from "@/api/user";

const menuItems = [
  {
    id: "overview",
    label: "Overview",
    icon: <BarChart3 className="h-5 w-5" />,
    link: "/dashboard",
    linkReg:'/dashboard'
  },
  {
    id: "links",
    label: "Links",
    icon: <Link2 className="h-5 w-5" />,
    link: "/dashboard/links",
    linkReg:'/dashboard/links'    
  }
];

const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      repeat: Infinity,
      duration: 1,
      ease: "linear",
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("");
  const router = useRouter();
  const pathname = usePathname();

    const {refetch:userLogout,isLoading:userLoggingOut,isError:userLoggingOutFailed,isSuccess:userLoggedOut} = useQuery({
    queryKey:['user_logout'],
    queryFn:()=>{
      return logout()
    },
    enabled:false
  })

  useEffect(()=>{

    if(userLoggedOut){
      router.push("/login")
    }

  },[userLoggedOut])



  useEffect(() => {
    const matchedItem = menuItems.find((item) =>
      pathname === item.linkReg
    );
    if (matchedItem) {
      setActiveTab(matchedItem.id);
    }
  }, [pathname]);

    useEffect(() => setMounted(true), [])

  if (!mounted) return null // prevents hydration mismatch

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }


  const handleLogout = () => {
    userLogout()
  };

  return (
    <div className="flex w-full h-screen bg-muted/30">
      {/* Custom Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r b">
        <div className="flex items-center gap-2 px-6 py-4 border-b">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3"
        >
          <img
            src="https://ik.imagekit.io/2ncgakzvm/fontbolt%20(3).png?updatedAt=1757440478189"
            alt="shrl.me logo"
            className="h-6 object-contain"
          />
  </motion.div>
        </div>
<nav className="flex flex-col flex-1 justify-between p-6 space-y-4">
  <div className="flex flex-col space-y-3">
    {menuItems.map((item) => (
      <button
        key={item.id}
        onClick={() => router.push(item.link)}
        className={`flex items-center gap-4 w-full px-4 py-3 rounded-lg transition-colors duration-200 ${
          activeTab === item.id
            ? "bg-primary/20 text-primary font-semibold shadow-md"
            : "text-gray-700 hover:bg-muted dark:text-gray-300 dark:hover:bg-gray-800"
        }`}
        aria-current={activeTab === item.id ? "page" : undefined}
      >
        {item.icon}
        <span className="font-bold text-sm">{item.label}</span>
      </button>
    ))}
  </div>
  <div>
    <span
      onClick={toggleTheme}
      className="flex items-center gap-4 w-full px-5 py-3 rounded-lg text-sm transition-colors duration-200 cursor-pointer text-gray-700 hover:bg-muted dark:text-gray-300 dark:hover:bg-gray-800"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
      <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
    </span>
  </div>
</nav>

        <div className="border-t p-4 space-y-3">
        <motion.div
          className="flex items-center gap-3 rounded-lg px-3 py-2 mb-2 bg-muted/50"
          whileHover={{ scale: 1.02 }}
        >
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            {
              localStorage.getItem("profile")?<img className="rounded-full" src={localStorage.getItem("profile")!}/>:<User className="h-4 w-4 text-primary" />
            }
          </div>
          <div>
            <span className="text-sm font-medium">{localStorage.getItem("firstName")}</span>
            <p className="text-xs text-muted-foreground">
            Beta v1.0</p>
          </div>
        </motion.div>
        <Button variant="ghost" className="w-full justify-start mt-2 cursor-pointer" onClick={handleLogout} asChild>
         <div className="flex items-center gap-3">
            {
              userLoggingOut?
                      <motion.div
          variants={spinnerVariants}
          animate="animate"
          className="rounded-full"
        >
          <Loader2 className="h-10 w-10 text-primary" />
        </motion.div>:
<LogOut className="h-4 w-4" />
            }
                    <span className="text-sm font-medium">Logout</span>
                  </div>
        </Button> 
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-y-scroll">
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Custom Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center border-t bg-white py-2 shadow md:hidden dark:bg-gray-900 dark:border-gray-700">
        <button
          onClick={() => router.push("/")}
          className="flex flex-col items-center gap-1 text-xs text-gray-500 dark:text-gray-400"
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </button>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => router.push(item.link)}
            className={`flex flex-col items-center gap-1 text-xs ${
              activeTab === item.id ? "text-primary" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center gap-1 text-xs text-destructive"
        >
          <LogOut className="h-5 w-5" />
          <span>Log out</span>
        </button>
      </nav>
    </div>
  );
}
