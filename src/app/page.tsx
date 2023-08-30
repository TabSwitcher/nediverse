import { NextPage } from 'next';
import GeneralFeed from '@/components/GeneralFeed';
import CustomFeed from '@/components/CustomFeed';
import { buttonVariants } from '@/components/ui/Button';
import { getAuthSession } from '@/lib/auth';
import { HomeIcon } from 'lucide-react';
import Link from 'next/link';
import dynamic from "next/dynamic";

const Particle = dynamic(() => import('@/components/ParticleBackground'), {
  ssr: false, // Disable server-side rendering for the Particle component
});

interface HomeProps {
  session: any; // Adjust the type of the session object according to your project
}

const Home: NextPage<HomeProps> = ({ session }) => {
  
  return (
    <>
      
       {/* Add the ParticleBackground component */}
      <h1 className="font-bold mt-9 text-3xl md:text-4xl text-white typewriter thick"></h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {/* @ts-expect-error server component */}
        {session ? <CustomFeed /> : <GeneralFeed />}
        {/* community info */}
        <div className="overflow-hidden h-fit rounded-lg ml-7 order-first md:order-last">
          <div className="bg-gradient-to-r from-gray-700 via-gray-900 to-black px-6 py-4">
            <p className="flex font-semibold py-3 items-center gap-1.5">
              <HomeIcon className="w-4 h-4" /> Home
            </p>
          </div>
          <div className="-my-3 divide-y divide-gray-100 px-6 py-4 bg-white text-sm leading-6">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-500">
                Your personal NEDverse homepage. Come here to check in with your favorite communities.
              </p>
            </div>
            <Link
              href="/ned/create"
              className={buttonVariants({
                className: 'w-full mt-4 mb-6',
              })}
            >
              Create Community
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
