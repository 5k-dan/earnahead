import { Marketplace } from '@/components/marketplace';
import { notFound } from 'next/navigation';
const pages=['landing','how-it-works','signup','login','onboarding','dashboard','explore','earnings','profile','organization','admin','forgot-password','reset-password','privacy','health-privacy','terms','support'];
export default async function Page({params}:{params:Promise<{page:string}>}) { const {page}=await params; if(!pages.includes(page)) notFound(); return <Marketplace page={page}/>; }
