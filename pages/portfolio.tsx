import { GetStaticProps } from 'next'
import Head from 'next/head'
import Layout from '../components/layout'
import Card from '../components/portfolio/card'
import Tags from '../components/portfolio/tags'
import { ProjectProps as Project } from '../interfaces/portfolio_interface'
import { getPortfolioData } from '../lib/portfolio'
import { useRouter } from 'next/router'
import {useTranslation} from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { i18n } from '../next-i18next.config'
import { useAppDispatch } from '../reducers/store'
import { changeLanguage } from '../reducers/locale_slice'
import { useEffect } from 'react'

interface PortfolioProps {
  projects: Project[];
  tags: string[];
  locale: typeof i18n.locales[number];
}

export default function Portfolio({ projects, tags, locale }: PortfolioProps): React.ReactElement {
  const queryTag = getQueryTag() || tags[0];
  const { t } = useTranslation()
  const dispatch = useAppDispatch();
  useEffect(()=>{
    dispatch(changeLanguage(locale))
  }, [])

  return (
    <Layout>
      <Head><title>{t('portfolio')}</title></Head>
      <div className="container mx-auto">
        <h1 className="text-5xl text-center text-primary dark:text-white mt-28">{t('portfolio')}</h1>
        <Tags tags={tags} queryTag={queryTag} />
        <div className="pb-20 mt-12 gap-9 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {projects.filter(project => project.tag == queryTag).map(project => <Card key={project.title} project={project} />)}
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({locale}) => {
  const projects: Project[] = await getPortfolioData(locale)
  const tags = Array.from(new Set(projects.map(project => project.tag)));
  return {
    props: {
      projects,
      tags,
      locale,
      ...(await serverSideTranslations(locale, [
        'common',
      ])),
    }
  }
}

function getQueryTag() {
  const router = useRouter();
  const query = router.query.tag;
  if (query) {
    if (Array.isArray(query)) return query[0];
    return query
  }
  return null;
}
