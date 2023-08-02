import { NextSeo } from 'next-seo'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Layout from '../../components/layout'
import rehypeRaw from 'rehype-raw'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useAppDispatch } from 'reducers/store'
import { changeLanguage } from 'reducers/locale_slice'
import { useEffect } from 'react'
import { i18n } from 'next-i18next.config'
import DefaultSeo from '../../next-seo.config'
import { GetServerSideProps } from 'next'
import GithubAPI from '@/lib/githubAPI'
import 'gitalk/dist/gitalk.css'
import Gitalk from 'gitalk'

interface Issue {
  title: string
  createdAt: string
  updatedAt: string
  id: number
  body: string
  description: string
}

interface PostProps {
  locale: typeof i18n.locales[number]
  post: Issue
}

export default function Post (props: PostProps): React.ReactElement {
  const {
    post,
    locale
  } = props
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(changeLanguage(locale))

    const gitalk = new Gitalk({
      clientID: process.env.NEXT_PUBLIC_GITALK_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GITALK_CLIENT_SECRET as string,
      repo: 'comments',
      owner: 'jhang-jhe-wei',
      admin: ['jhang-jhe-wei']
    })

    gitalk.render('gitalk-container')
  }, [])

  return (
    <>
      <NextSeo
        title={post.title}
        description={post.description}
        canonical={`https://wells.tw/posts/${post.title}}`}
        openGraph={{
          ...DefaultSeo.openGraph,
          locale,
          url: 'https://wells.tw/blog',
          title: post.title,
          description: post.description
        }}
      />
      <Layout>
        <main className="pt-8 pb-16 lg:pt-16 lg:pb-24">
          <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
            <article className="w-full max-w-2xl mx-auto format format-sm sm:format-base lg:format-lg format-blue dark:format-invert prose dark:prose-invert">
              <h1 className="text-4xl font-bold text-center">{post.title}</h1>
              <ReactMarkdown
                className="py-1 react-markdown box-border"
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  img: ({ node, ...props }) => (
                    <img
                      {...props}
                      width={800}
                      height={800}
                    />
                  )
                }}
                children={post.body}
              />
            <div id="gitalk-container"></div>
            </article>
          </div>
        </main>
      </Layout>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<PostProps> = async (context) => {
  const {
    locale,
    params: { id }
  } = context

  const result = await GithubAPI.request('GET /repos/{owner}/{repo}/issues/{issue_number}', {
    owner: 'jhang-jhe-wei',
    repo: 'jhang-jhe-wei.github.com',
    issue_number: id,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })

  return {
    props: {
      locale,
      post: result.data,
      ...(await serverSideTranslations(locale, [
        'common'
      ]))
    }
  }
}
