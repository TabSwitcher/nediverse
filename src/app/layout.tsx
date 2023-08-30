import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
//import Particle from '@/components/ParticleBackground';
import dynamic from "next/dynamic";

const Particle = dynamic(() => import('@/components/ParticleBackground'), {
  ssr: false, // Disable server-side rendering for the Particle component
});


export const metadata = {
  title: "NEDverse",
  description: "A social network for NEDians",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
  authModal
}: {
  children: React.ReactNode,
  authModal: React.ReactNode
}) {
  return (

    //display Particle component as background from react-particle in nextjs layout
    //https://stackoverflow.com/questions/67991500/how-to-use-react-particles-js-in-next-js


    <html
      lang="en"
      className={cn(
        "bg-white text-slate-900 antialiased light",
        inter.className
      )}
    >
      <body className="min-h-screen text-white pt-1 antialiased" style={{
    background: 'radial-gradient(circle at 1.8% 4.8%, rgb(17, 23, 58) 0%, rgb(58, 85, 148) 90%)'
  }}>
        <Providers>
          {/* @ts-ignore */}
        <Particle />  
        <Navbar /> 
        
        {authModal}
        <div className="container max-w-7xl mx-auto h-full pt-12">
        {children}
        </div>
        
        <Toaster />

        
        </Providers>
      </body>
    </html>
  );
}
