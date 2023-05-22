import Link from 'next/link'
import NavItem from './nav_item'
import NavBtnItem from './nav_btn_item'
import NavIconItem from './nav_icon_item'
import NavHamburger from './nav_hamburger_item'
import NavMobileMenu from './nav_mobile_menu'
import NavLanguage from './nav_language'
import { useState } from 'react'
import {useTranslation} from 'react-i18next'

export default function Nav():React.ReactElement{
  const [reveal, setReveal] = useState(false);
  const { t } = useTranslation();

  return (
    <nav className="sticky top-0 z-30 px-10 py-6 bg-light dark:bg-primary bg-opacity-60 dark:bg-opacity-60 backdrop-blur dark:backdrop-blur print:hidden">
      <div className="flex items-center justify-between mx-auto">
        <Link
          href="/"
          className="text-2xl text-primary dark:text-white hover:no-underline">Wells
        </Link>
        <div className="items-center hidden sm:flex">
          <NavItem href="/portfolio">{t('portfolio')}</NavItem>
          <NavItem href="/about">{t('about')}</NavItem>
          <NavItem href="https://blog.wells.tw" newTab={true} >{t('blog')}</NavItem>
          <NavBtnItem href="mailto:jhang0912407249@gmail.com">{t('contact')}</NavBtnItem>
          <NavLanguage/>
          <NavIconItem/>
        </div>
        <div className="flex items-center justify-between w-50 sm:hidden">
          <NavLanguage/>
          <NavIconItem/>
          <div className="z-50">
            <NavHamburger reveal={reveal} setReveal={setReveal}/>
          </div>
        </div>
      </div>
      <NavMobileMenu reveal={reveal}/>
    </nav>
  );
}
