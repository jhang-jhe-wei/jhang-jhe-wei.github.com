import { DefaultSeoProps } from 'next-seo'

const config: DefaultSeoProps = {
  title: "Wells's Website",
  description: "In here, you can find my projects, blogs, and some other stuffs.",
  canonical: "https://wells.tw/",
  openGraph: {
    url: 'https://i.imgur.com/qtzOumT.png',
    title: "Wells's Website",
    description: "In here, you can find my projects, blogs, and some other stuffs.",
    images: [
      { url: 'https://i.imgur.com/qtzOumT.png' }
    ],
    type: 'website',
    siteName: "Wells's Website"
  }
}

export default config
