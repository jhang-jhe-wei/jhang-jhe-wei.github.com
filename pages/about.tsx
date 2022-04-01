import { GetStaticProps } from 'next'
import Head from 'next/head'
import Toc from '../components/about/toc'
import Profile from '../components/about/profile'
import List from '../components/about/List'
import Layout from '../components/layout'
import Achievements from '../components/about/achievements'
import Footer from '../components/about/footer'
import { getAboutData } from '../lib/about'
import { SkillsProps, AchievementProps, ListItemProps } from '../interfaces/about_interface'
import SkillsList from '../components/about/skills_list'
import Projects from '../components/about/projects'
import Resume from '../components/about/resume'
import { getPortfolioData } from '../lib/portfolio'
import { ProjectProps} from '../interfaces/portfolio_interface'

interface AboutProps {
    education: ListItemProps[];
    works: ListItemProps[];
    achievements: AchievementProps[];
    skillsList: SkillsProps[];
    projects: ProjectProps[];
}

export default function about({education, works, achievements, skillsList, projects}:AboutProps): React.ReactElement{
  return (
    <Layout>
      <div className="container mx-auto">
        <Head><title>Wells 的經歷</title></Head>
        <h1 className="mt-32 text-5xl text-center text-primary dark:text-light">About</h1>
        <Toc/>
        <Profile/>
        <div className="mt-56">
          <List id="education" category="教育背景" backgroundText="Education Background" data={education} />
          <List id="works" category="工作經驗" backgroundText="Work Experience" data={works} />
        </div>
      </div>
      <Achievements data={achievements}/>
      <div className="container mx-auto">
        <SkillsList data={skillsList}/>
        <Projects projects={projects}/>
      </div>
      <Resume/>
      <Footer/>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<AboutProps> = async () => {
  const aboutData = await getAboutData();
  const projects: ProjectProps[] = await getPortfolioData()
  return {
    props: {
      ...aboutData,
      projects
    }
  }
}
