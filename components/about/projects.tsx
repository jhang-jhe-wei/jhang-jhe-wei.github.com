import {useTranslation} from 'next-i18next';
import { ProjectProps} from '../../interfaces/portfolio_interface'
import Project from './project'
interface ProjectsProps {
  projects: ProjectProps[];
}

export default function Projects({projects}: ProjectsProps) {
  const { t } = useTranslation()
  return (
    <div className="mt-40 print:hidden">
      <h2 className="hidden text-4xl text-center text-white md:block font-notosans shadow-gray-700 xl:text-7xl">Projects</h2>
      <h2 className="mt-5 text-3xl text-center text-secondary">{t('anchors.projects')}</h2>
      <ul className="mt-10">
        {
          projects.filter(project => project.highlight).map((project, index) => <Project key={project.title} project={project} index={index}/>)
        }
      </ul>
      <div className="text-center border-b border-gray-400 dark:border-white">
        <a href="/portfolio" className="inline-block pt-3 pb-2 pl-3 pr-2 text-gray-400 border border-gray-400 duration-500 hover:scale-125 dark:bg-primary dark:text-white bg-light translate-y-1/2">SHOW MORE &gt;</a>
      </div>
    </div>
  )
}
