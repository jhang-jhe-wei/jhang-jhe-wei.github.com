import tinytime from 'tinytime'
import Pagination from '../../../components/blog/pagination'
import { GetStaticProps } from 'next'
import Layout from '../../../components/layout'
import * as posts from '../../../lib/posts'
import type { Post } from '../../../lib/posts'
import SectionContainer from '../../../components/blog/SectionContainer'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useAppDispatch } from 'reducers/store'
import { changeLanguage } from 'reducers/locale_slice'
import { useEffect } from 'react'
import { i18n } from 'next-i18next.config'

interface PostsPageProps {
  totalPage: number
  page: number
  posts: Post[]
  locale: typeof i18n.locales[number]
}

const postDateTemplate = tinytime('{MMMM} {DD}, {YYYY}')
export default function PostsPage (props: PostsPageProps): React.ReactElement {
  const {
    totalPage,
    page,
    posts,
    locale
  } = props
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(changeLanguage(locale))
  }, [])

  return (
      <Layout>
        <SectionContainer>
          <main>
            <div className="divide-y divide-gray-200">
              <div className="pt-6 pb-8 space-y-2 md:space-y-5">
                <h1 className="text-3xl text-primary dark:text-light tracking-tight sm:text-4xl md:text-[4rem] md:leading-[3.5rem]">
                  { t('blog') }
                </h1>
                <p className="text-lg text-primary dark:text-light">
                  { t('blogDescription') }
                </p>
              </div>
              <ul className="divide-y divide-gray-200">
                {posts.map(post => {
                  return (
                      <li key={post.slug} className="py-4">
                        <article className="space-y-2 xl:grid xl:grid-cols-4 xl:space-y-0 xl:items-baseline">
                          <dl>
                            <dt className="sr-only">Published on</dt>
                            <dd className="text-base font-medium text-primary dark:text-light">
                              <time dateTime={post.options.createdAt}>
                                {postDateTemplate.render(new Date(post.options.createdAt))}
                              </time>
                            </dd>
                          </dl>
                          <div className="space-y-5 xl:col-span-3">
                            <div className="space-y-6">
                              <h2 className="text-2xl font-bold tracking-tight">
                                <Link href={`/posts/${post.slug}`} className="text-primary dark:text-light">
                                  {post.slug}
                                </Link>
                              </h2>
                              <div className="text-primary dark:text-light prose max-w-none">
                                {post.options.description}
                              </div>
                            </div>
                            <div className="text-base font-medium">
                              <Link
                                  href={`/posts/${post.slug}`}
                                  className="text-teal-600 hover:text-teal-700"
                                  aria-label={`Read "${post.slug}"`}>
                                  Read more &rarr;
                              </Link>
                            </div>
                          </div>
                        </article>
                      </li>
                  )
                })}
              </ul>
            </div>
          </main>
          <div className="flex justify-center mt-8 mb-4">
            <Pagination currentPage={page} totalPage={totalPage}/>
          </div>
        </SectionContainer>
      </Layout>
  )
}

export const getStaticProps: GetStaticProps<PostsPageProps> = async (context) => {
  const totalPage = await posts.totalPages()
  const page = parseInt(context.params.page as string)
  const {
    locale
  } = context
  return {
    props: {
      totalPage,
      page,
      posts: await posts.page(page),
      locale,
      ...(await serverSideTranslations(locale, [
        'common'
      ]))
    }
  }
}

export const getStaticPaths = async ({ locales }) => {
  const paths = await posts.genIndexPaths(locales)
  return {
    paths,
    fallback: false
  }
}
