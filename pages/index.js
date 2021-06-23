import Head from 'next/head'
import Image from 'next/image'
import Sidebar from '../Components/Sidebar';

export default function Home() {
  return (
    <div>
      <Head>
        <title>WhatsApp 2.0</title>
        <meta name="description" content="Generated by create next app" />
        <link
          rel="icon"
          href="https://pngimg.com/uploads/whatsapp/whatsapp_PNG95158.png"/>
      </Head>

    <Sidebar/>
    </div>
  );
}