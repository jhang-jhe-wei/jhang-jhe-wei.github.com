import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GetStaticProps } from 'next'
import Layout from '../../components/layout'

import * as posts from '../../lib/posts';
import type { Post } from '../../lib/posts';

interface PostPageProps {
  post: Post
}

export default function PostsPage({ post }: PostPageProps): React.ReactElement {
  return (
    <Layout>
      hello {JSON.stringify({ title: post.options.title })}

      <ReactMarkdown
        components={{
          p: ({ children }) => <div className='qwer'>{ children }</div>,
          iframe: (props) => <div className='iframe'>{ JSON.stringify(props) }</div>
        }}
        remarkPlugins={[remarkGfm]}
      >
        { post.content }
      </ReactMarkdown>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<PostPageProps> = async (context) => {
  const post = await posts.postDetail(context.params.slug as string);

  console.log(post)
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