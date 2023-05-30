import { GetStaticProps } from 'next'
import Layout from '../../../components/layout'
import Pagination from '../../../components/pagination';

import * as posts from '../../../lib/posts';
import type { Post } from '../../../lib/posts';
import PostCard from '../../../components/blog/PostCard';

interface PostsPageProps {
  totalPage: number;
  page: number;
  posts: Post[];
}

export default function PostsPage({ totalPage, page, posts }: PostsPageProps): React.ReactElement {
  return (
    <Layout>
      <div className="container pb-12 mx-auto">
        {
          posts.map(post => (
            <PostCard key={post.slug} post={post}/>
            ))
        }
      </div>
      <div className="fixed bottom-0 w-full">
        <Pagination currentPage={page} totalPage={totalPage}/>
      </div>
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
