import { NavItemProps } from '../../interfaces/nav_interface'
import Link from 'next/link'
export default function NavItem(props:NavItemProps):React.ReactElement{
  return(
    <div className="ml-12">
      <Link href={props.href}>
        <a className="text-primary dark:text-white dark:hover:text-secondary hover:text-secondary" target={props.newTab && "_blank"}>
        {props.children}
        </a>
      </Link>
    </div>
  )
}
