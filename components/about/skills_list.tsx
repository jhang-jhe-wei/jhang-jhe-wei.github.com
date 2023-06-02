import { useTranslation } from 'next-i18next'
import { SkillsListProps } from '../../interfaces/about_interface'
import SkillsListItem from './skills_list_item'
export default function SkillsList ({ data }: SkillsListProps): React.ReactElement {
  const { t } = useTranslation()
  return (
    <div id="skills" className="mt-32 print:mt-0 print:hidden">
      <h3 className="hidden text-4xl text-center text-white md:block font-notosans shadow-gray-700 xl:text-7xl print:md:hidden">
        Skills
      </h3>
      <h3 className="mt-2 text-2xl text-center md:text-4xl text-secondary print:text-xs print:max-w-[4ch] print:md:text-xs">{t('anchors.skills')}</h3>
      <ul className="mt-10 grid grid-cols-11 gap-8 print:gap-0">
        {
          data.map((skills, index) => (
            <SkillsListItem key={skills.title} skills={skills} index={index}/>
          ))
        }
      </ul>
    </div>
  )
}
