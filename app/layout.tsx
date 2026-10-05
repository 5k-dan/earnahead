import type { Metadata } from 'next';
import './globals.css';
import './design-refinements.css';
import './marketplace-polish.css';
import './mobile.css';
import { Providers } from '@/components/providers';
export const metadata: Metadata = { title: 'EarnAhead · Find your next opportunity', description: 'Find donation programs and recruiting research near you. Compare published terms and connect directly with providers.' };
export default function Layout({children}:{children:React.ReactNode}) { return <html lang="en"><body><Providers>{children}</Providers></body></html>; }
