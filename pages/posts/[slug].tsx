import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GetStaticProps } from 'next'
import Layout from '../../components/layout'
import * as posts from '../../lib/posts';
import rehypeRaw from "rehype-raw";

export default function Post({ post }): React.ReactElement {
  return (
    <Layout>
      <main className="pt-8 pb-16 lg:pt-16 lg:pb-24">
        <div className="flex justify-between px-4 mx-auto max-w-screen-xl ">
          <article className="w-full max-w-2xl mx-auto format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
            <ReactMarkdown
              className="py-1 react-markdown box-border"
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              children={post.content}
            />
          </article>
        </div>
      </main>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const post = await posts.postDetail(context.params.slug as string);

  return {
    props: {
      post,
    }
  }
}

export const getStaticPaths = async () => {
  const allPosts = await posts.all();
  return {
    paths: allPosts.map(p => ({
      params: {
        slug: p.slug
      }
    })),
    fallback: false,
  }

};
