import MiniCreatePost from "@/components/MiniCreatePost";
import PostFeed from "@/components/PostFeed";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    slug: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { slug } = params;

  const session = await getAuthSession();

  const community = await db.community.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          community: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS
      },
    },
  });

  if (!community) return notFound();

  return <>
    <div className="flex items-center py-4 px-1 font-bold text-3xl md:text-4xl h-14" style={{padding:60, justifyContent: 'center'}}>
        <h1>ned/{community.name}</h1>
    </div>
    <MiniCreatePost session={session}/>

    {/* TODO: Show posts in user feed */}
    <PostFeed initialPosts={community.posts} communityName={community.name} />
  </>;
};

export default page;
