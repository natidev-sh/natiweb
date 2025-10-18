import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import PageMeta from '@/components/PageMeta';
import { Calendar, User, Search, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BlogIndex() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [postsRes, categoriesRes] = await Promise.all([
        supabase
          .from('posts')
          .select(`
            title,
            slug,
            meta_description,
            published_at,
            featured_image_url,
            profiles ( first_name, last_name ),
            categories ( name, slug )
          `)
          .eq('published', true)
          .order('published_at', { ascending: false }),
        supabase
          .from('categories')
          .select('name, slug')
          .order('name')
      ]);

      if (postsRes.error) console.error('Error fetching posts:', postsRes.error);
      else setPosts(postsRes.data);

      if (categoriesRes.error) console.error('Error fetching categories:', categoriesRes.error);
      else setCategories(categoriesRes.data);
      
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts
      .filter(post => {
        if (!selectedCategory) return true;
        return post.categories.some(cat => cat.slug === selectedCategory);
      })
      .filter(post => {
        if (!searchQuery) return true;
        const searchLower = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(searchLower) ||
          (post.meta_description && post.meta_description.toLowerCase().includes(searchLower))
        );
      });
  }, [posts, searchQuery, selectedCategory]);

  const handleCategorySelect = (slug) => {
    setSearchParams(slug ? { category: slug } : {});
  };

  return (
    <>
      <PageMeta
        title="Blog | Nati.dev"
        description="Insights, tutorials, and updates from the Nati.dev team. Learn how to build AI apps faster."
      />
      <div className="py-12">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-bold tracking-tight sm:text-5xl mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Nati.dev Blog
          </motion.h1>
          <motion.p 
            className="mt-4 text-lg opacity-80 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Insights, tutorials, and updates on building AI apps faster.
          </motion.p>
        </div>

        <motion.div 
          className="mb-10 flex flex-col sm:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--muted-foreground)]" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--background)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => handleCategorySelect(null)} className={`px-3 py-1.5 text-sm rounded-full transition ${!selectedCategory ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-[var(--muted)] hover:bg-[var(--muted)]/80'}`}>All</button>
            {categories.map(cat => (
              <button key={cat.slug} onClick={() => handleCategorySelect(cat.slug)} className={`px-3 py-1.5 text-sm rounded-full transition ${selectedCategory === cat.slug ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-[var(--muted)] hover:bg-[var(--muted)]/80'}`}>{cat.name}</button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center">Loading posts...</div>
        ) : (
          <motion.div 
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.05 } }
            }}
            initial="hidden"
            animate="show"
          >
            <AnimatePresence>
              {filteredPosts.length > 0 ? filteredPosts.map((post) => (
                <motion.div
                  key={post.slug}
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                  exit={{ opacity: 0, y: -20 }}
                  layout
                >
                  <Link to={`/blog/${post.slug}`} className="group block rounded-xl border border-[var(--border)] overflow-hidden transition-all hover:shadow-xl hover:shadow-[var(--primary)]/10 hover:-translate-y-1 bg-[var(--background-darkest)]">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={post.featured_image_url || 'https://i.postimg.cc/KjvHrBH0/bg.webp'} 
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.categories.map(cat => (
                          <span key={cat.slug} className="text-xs px-2 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">{cat.name}</span>
                        ))}
                      </div>
                      <h2 className="text-xl font-semibold mb-2 group-hover:text-[var(--primary)] transition-colors">{post.title}</h2>
                      <p className="text-sm opacity-70 mb-4 line-clamp-2">{post.meta_description}</p>
                      <div className="flex items-center justify-between text-xs opacity-60 border-t border-[var(--border)] pt-4">
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          <span>{post.profiles ? `${post.profiles.first_name} ${post.profiles.last_name}`.trim() : 'Nati Team'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(post.published_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )) : (
                <motion.div className="md:col-span-2 lg:col-span-3 text-center py-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3 className="text-xl font-semibold">No posts found</h3>
                  <p className="opacity-70 mt-2">Try adjusting your search or filters.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </>
  );
}