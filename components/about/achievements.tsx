import { useTranslation } from 'next-i18next'
import { AchievementsProps } from '../../interfaces/about_interface'
import Achievement from './achievement'
export default function Achievements (achievementsProps: AchievementsProps): React.ReactElement {
  const { t } = useTranslation()
  return (
    <div id="achievements" className="w-full text-nobile dark:from-slate-900 gray-700 dark:to-primary bg-gradient-to-r from-white to-light -translate-y-10 print:hidden">
      <div className="container relative mx-auto">
        <h2 className="text-2xl text-center md:text-right md:text-4xl -translate-y-3 md:-translate-y-14 text-secondary" >{t('anchors.achievements')}</h2>
        <h2 className="absolute hidden text-4xl text-white md:block -right-14 top-40 xl:-right-20 xl:top-96 font-notosans shadow-gray-700 rotate-90 origin-top-right xl:text-7xl print:md:hidden">Achievement</h2>
        <ul className="pt-20 border-gray-400 xl:pb-20 xl:border-b-2 grid xl:grid-cols-2 gap-y-14 xl:gap-y-20 gap-x-10">
          {achievementsProps.data.filter(item => (!item.isFull)).map(item => (
            <Achievement key={item.title} item={item}/>
          ))}
        </ul>
        <ul className="pb-20 xl:pt-20 pt-14 gird grid-cols-1 gap-y-20">
          {achievementsProps.data.filter(item => (item.isFull)).map(item => (
            <Achievement key={item.title} item={item}/>
          ))}
        </ul>
      </div>
    </div>
  )
}
