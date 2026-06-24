import React from 'react';
import ClientPostDetail from './ClientPostDetail';
import { SAMPLE_NEWS_POSTS } from '../samplePosts';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

async function getPost(slug: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/posts/${slug}`, { 
      next: { revalidate: 10 } 
    });
    if (!res.ok) {
      return SAMPLE_NEWS_POSTS.find((post) => post.slug === slug) || null;
    }
    const data = await res.json();
    return data || SAMPLE_NEWS_POSTS.find((post) => post.slug === slug) || null;
  } catch (err) {
    console.error(`Error fetching post details for slug: ${slug}`, err);
    return SAMPLE_NEWS_POSTS.find((post) => post.slug === slug) || null;
  }
}

async function getRelatedPosts(category: string, currentPostId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/posts`, { 
      next: { revalidate: 10 } 
    });
    if (!res.ok) {
      return SAMPLE_NEWS_POSTS
        .filter((p) => p.id !== currentPostId && p.category === category)
        .slice(0, 3);
    }
    const allPosts = await res.json();
    const source = Array.isArray(allPosts) && allPosts.length > 0 ? allPosts : SAMPLE_NEWS_POSTS;
    return source
      .filter((p: any) => p.id !== currentPostId && p.category === category)
      .slice(0, 3);
  } catch (err) {
    console.error('Error fetching related posts:', err);
    return SAMPLE_NEWS_POSTS
      .filter((p) => p.id !== currentPostId && p.category === category)
      .slice(0, 3);
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) {
    return {
      title: 'Không tìm thấy bài viết - HUIT Startup 2026',
    };
  }
  return {
    title: `${post.title} - HUIT Startup 2026`,
    description: post.summary || `Đọc chi tiết bài viết ${post.title} trên cổng thông tin HUIT Startup 2026.`,
  };
}

export default async function PostDetailPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  let relatedPosts = [];
  
  if (post) {
    relatedPosts = await getRelatedPosts(post.category, post.id);
  }

  return <ClientPostDetail post={post} relatedPosts={relatedPosts} />;
}
