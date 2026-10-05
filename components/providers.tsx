'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import {AuthProvider} from './auth-provider';
import {ActivityTracking} from './activity-tracking';
export function Providers({children}:{children:React.ReactNode}) { const [client] = useState(() => new QueryClient()); return <QueryClientProvider client={client}><AuthProvider><ActivityTracking/>{children}</AuthProvider></QueryClientProvider>; }
