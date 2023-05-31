import { SkillsProps } from '../../interfaces/about_interface'
import useReveal from '../../lib/use_reveal'
interface SkillsListItemProps {
  skills: SkillsProps
  index: number
}
export default function SkillsListItem ({ skills, index }: SkillsListItemProps) {
  const [element, reveal] = useReveal()

  return (
    <li ref={element} className={`py-9 px-10 bg-white dark:bg-primary-opacity transition-opacity-and-transform duration-500 col-span-full md:col-start-2 ${reveal ? 'opacity-100' : 'translate-y-20 opacity-0'} ${(index % 4 % 3 == 0) ? 'xl:col-span-5' : 'xl:col-span-6'} ${(index % 2 == 0) ? 'md:col-span-8' : 'md:col-span-9'} print:opacity-100 print:translate-y-0 ${(index % 2 === 0) ? 'print:col-span-6 print:md:col-span-6 print:xl:col-span-6' : 'print:col-span-5 print:md:col-span-5 print:xl:col-span-5'} print:bg-opacity-0 print:py-0 print:px-0 print:border-t-2 print:border-cyan-450 print:mb-4`}>
      <h3 className="text-2xl font-bold text-cyan-450 print:text-[10px] print:-translate-y-4 print:bg-light print:w-fit print:px-3">{skills.title}</h3>
      <table className="mt-5 print:mt-0">
        <tbody>
          {
            skills.skills.map(skill => (
              <tr key={skill.name}>
                <td className="pb-2 pr-5 overflow-x-scroll text-right whitespace-nowrap md:overflow-visible text-primary dark:text-light print:text-[10px]">
                  {skill.name}
                </td>
                <td className="w-full pb-2">
                  <div className="h-2.5 bg-gradient-to-r from-red-500 to-yellow-400 rounded-[10px]" style={{ width: `${skill.proficiency}%` }}></div>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </li>

  )
}
