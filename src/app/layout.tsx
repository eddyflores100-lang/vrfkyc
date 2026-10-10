import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'VRFKYC — Know more before your next business decision.',description:'Simple reviews and portable evidence for individuals and businesses, with API and MCP integrations for developers.',robots:{index:true,follow:true}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
