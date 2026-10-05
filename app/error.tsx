'use client';
import {useEffect} from 'react';
import Link from 'next/link';
export default function ErrorPage({error,reset}:{error:Error&{digest?:string};reset:()=>void}){useEffect(()=>{console.error('EarnAhead page failed',{reference:error.digest??'client'});},[error]);return <main className="account-panel"><h1>This page could not load</h1><p>Please try again. If this keeps happening, contact support.</p><button className="primary" onClick={reset}>Try again</button><p><Link href="/support">Support</Link> · <Link href="/explore">Back to explore</Link></p></main>;}
