import type { Metadata } from 'next';
import './globals.css';
import './design-refinements.css';
import { Providers } from '@/components/providers';
export const metadata: Metadata = { title: 'EarnAhead · Find your next opportunity', description: 'Find paid medical opportunities near you. Compare published terms and connect directly with providers.' };
export default function Layout({children}:{children:React.ReactNode}) { return <html lang="en"><body><Providers>{children}</Providers></body></html>; }
