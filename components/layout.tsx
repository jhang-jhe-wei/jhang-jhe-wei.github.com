import Nav from './nav/nav'
import Head from 'next/head'

export default function Layout ({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta property="og:title" content="Wells's website" />
        <meta property="og:image" content="https://imgur.com/qtzOumT.png" />
        <meta property="og:description" content="在這裡可以找到張哲瑋的作品集、個人經歷和部落格。" />
      </Head>
      <Nav/>
      {children}
    </>
  )
}
