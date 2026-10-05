import { NextRequest, NextResponse } from 'next/server';
import { serverDb } from '@/lib/server';
export async function GET(req:NextRequest) { const code=req.nextUrl.searchParams.get('code'); const next=req.nextUrl.searchParams.get('next')==='/reset-password'?'/reset-password':'/onboarding';if(code) { const {error}=await (await serverDb()).auth.exchangeCodeForSession(code); if(!error) return NextResponse.redirect(new URL(next,req.url)); } return NextResponse.redirect(new URL('/login?auth_error=1',req.url)); }
