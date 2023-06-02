import { DefaultSeoProps } from 'next-seo'

const config: DefaultSeoProps = {
  title: "Wells 的個人網站",
  description: "在這裡，你可以找到我的專案、部落格、以及其他一些東西。",
  canonical: "https://wells.tw/",
  openGraph: {
    url: 'https://wells.tw/',
    title: "Wells 的個人網站",
    description: "在這裡，你可以找到我的專案、部落格、以及其他一些東西。",
    images: [
      { url: 'https://i.imgur.com/qtzOumT.png' }
    ],
    type: 'website',
    siteName: "Wells's Website",
    locale: 'zh_TW'
  }
}

export default config
