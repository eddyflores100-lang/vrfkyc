import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'VRFKYC — Clear evidence. Connected workflows.',description:'Source-linked screening for people, businesses and agents. MCP tools and transparent scope.',robots:{index:true,follow:true}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
