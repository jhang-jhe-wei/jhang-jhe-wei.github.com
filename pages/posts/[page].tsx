import { GetStaticProps } from 'next'
import Layout from '../../components/layout'

import * as posts from '../../lib/posts';
import type { Post } from '../../lib/posts';

interface PostsPageProps {
  totalPage: number;
  page: number;
  posts: Post[];
}

export default function PostsPage({ totalPage, page, posts }: PostsPageProps): React.ReactElement {
  return (
    <Layout>
      hello {JSON.stringify({ totalPage, page, posts })}
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<PostsPageProps> = async (context) => {
  const totalPage = await posts.totalPages();
  const page = parseInt(context.params.page as string) - 1;
  return {
    props: {
      totalPage,
      page,
      posts: await posts.page(page),
    }
  }
}

export const getStaticPaths = async () => {
  const paths = await posts.genIndexPaths();
  console.log(paths)
  return {
    paths,
    fallback: false,
  }

};