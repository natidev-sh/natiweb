import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import PageMeta from '@/components/PageMeta';

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, slug, published, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const deletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const { error } = await supabase.from('posts').delete().eq('id', postId);
      if (error) {
        alert('Error deleting post: ' + error.message);
      } else {
        fetchPosts(); // Refresh list
      }
    }
  };

  return (
    <>
      <PageMeta title="Manage Posts | Admin" />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          <Link to="/admin/posts/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)]">
            <Plus className="h-5 w-5" />
            New Post
          </Link>
        </div>

        {loading ? (
          <p>Loading posts...</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
            <table className="w-full text-sm text-left">
              <thead className="bg-[var(--background-darkest)]">
                <tr>
                  <th className="p-3 font-medium">Title</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Created</th>
                  <th className="p-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id} className="border-t border-[var(--border)]">
                    <td className="p-3 font-medium">{post.title}</td>
                    <td className="p-3">
                      {post.published ? (
                        <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400">
                          <CheckCircle className="h-3 w-3" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-gray-500/10 text-gray-400">
                          <XCircle className="h-3 w-3" /> Draft
                        </span>
                      )}
                    </td>
                    <td className="p-3 opacity-70">{new Date(post.created_at).toLocaleDateString()}</td>
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        {post.published && (
                          <Link to={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-[var(--muted)] rounded-md" title="View Post">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        )}
                        <Link to={`/admin/posts/edit/${post.slug}`} className="p-2 hover:bg-[var(--muted)] rounded-md" title="Edit Post">
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button onClick={() => deletePost(post.id)} className="p-2 text-rose-500 hover:bg-[var(--muted)] rounded-md" title="Delete Post">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}