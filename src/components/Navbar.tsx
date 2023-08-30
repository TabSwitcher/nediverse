import Link from "next/link";
import { Icons } from "./Icons";
import { buttonVariants } from "./ui/Button";
import { getAuthSession } from "@/lib/auth";
import UserAccountNav from "./UserAccountNav";
import SearchBar from "./SearchBar";
import Image from "next/image";
import neduet from '../../public/neduet.png'

const Navbar = async () => {
  const session = await getAuthSession();

  return (
    <div className="fixed opacity-95 bg-gradient-to-r from-gray-700 via-gray-900 to-black top-0 inset-x-0 h-fit border-zinc-100 z-[10] py-2">

      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2 relative">
        {/* logo */}
        <Link href="/" className="flex gap-2 items-center">
          <Image alt='logo' src={neduet} className="w-8 h-8  sm:h-12 sm:w-12" />
          {/* <Icons.logo className="w-8 h-8  sm:h-6 sm:w-6" /> */}
          <p className="hidden tracking-[5px] text-white text-lg font-semibold md:block typewriter2" style={{position: 'absolute',
            top: '50%',
            left: '90px',
            transform: 'translateY(-50%)'}}>
            {/* NEDverse */}
          </p>
        </Link>

        {/* search bar */}
        <SearchBar />
        {session?.user ? (
          <UserAccountNav user={session.user}/>
        ) : (
          <Link href="/sign-in" className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
