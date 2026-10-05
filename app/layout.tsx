import type { Metadata } from 'next';
import './globals.css';
import './design-refinements.css';
import './marketplace-polish.css';
import './mobile.css';
import './motion.css';
import './page-polish.css';
import { Providers } from '@/components/providers';
export const metadata: Metadata = {
 metadataBase:new URL('https://earnahead.vercel.app'),
 title:'EarnAhead · Find donor programs. Compare published pay.',
 description:'Explore plasma, sperm and egg donor programs. Compare published compensation and provider requirements. Local availability varies; some programs require travel.',
 openGraph:{type:'website',locale:'en_US',siteName:'EarnAhead',title:'Find donor programs. Compare published pay.',description:'Explore plasma, sperm and egg donor programs on EarnAhead. Local availability varies; some programs require travel.',url:'https://earnahead.vercel.app'},
 twitter:{card:'summary_large_image',title:'EarnAhead · Find donor programs',description:'Compare published compensation and provider terms. Local availability varies.'}
};
export default function Layout({children}:{children:React.ReactNode}) { return <html lang="en"><body><Providers>{children}</Providers></body></html>; }
