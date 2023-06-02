import { NextSeo } from 'next-seo'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { GetStaticProps } from 'next'
import Layout from '../../components/layout'
import * as posts from '../../lib/posts'
import rehypeRaw from 'rehype-raw'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useAppDispatch } from 'reducers/store'
import { changeLanguage } from 'reducers/locale_slice'
import { useEffect } from 'react'
import { i18n } from 'next-i18next.config'
import Image from 'next/image'

interface imageLoaderProps {
  src: string
}
const imageLoader = (props: imageLoaderProps): string => {
  const {
    src
  } = props
  return `https://dokku-bucket.s3.us-east-2.amazonaws.com/wells-blog/${src}`
}

interface PostProps {
  locale: typeof i18n.locales[number]
  post: posts.Post
}

export default function Post (props: PostProps): React.ReactElement {
  const {
    post,
    locale
  } = props
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(changeLanguage(locale))
  }, [])

  return (
    <>
      <NextSeo
        title={post.slug}
        description={post.options.description}
      />
      <Layout>
        <main className="pt-8 pb-16 lg:pt-16 lg:pb-24">
          <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
            <article className="w-full max-w-2xl mx-auto format format-sm sm:format-base lg:format-lg format-blue dark:format-invert prose dark:prose-invert">
              <ReactMarkdown
                className="py-1 react-markdown box-border"
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  img: ({ node, ...props }) => (
                    <Image
                      loader={imageLoader}
                      {...props}
                      width={800}
                      height={800}
                    />
                    )
                }}
                children={post.content}
              />
            </article>
          </div>
        </main>
      </Layout>
    </>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const post = await posts.postDetail(context.params.slug as string)
  const {
    locale
  } = context

  return {
    props: {
      post,
      locale,
      ...(await serverSideTranslations(locale, [
        'common'
      ]))
    }
  }
}

export const getStaticPaths = async ({ locales }) => {
  const allPosts = await posts.all()
  return {
    paths: allPosts.flatMap(p => (locales.map((locale: string) => ({ params: { slug: p.slug }, locale })))),
    fallback: false
  }
}
