import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/auth/AuthContext';
import { ArrowLeft, Save, Trash2, Loader2, UploadCloud } from 'lucide-react';
import PageMeta from '@/components/PageMeta';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css';
import { useTheme } from '@/theme/ThemeProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function PostEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useTheme();
  const editorRef = useRef(null);
  
  const [post, setPost] = useState({
    title: '',
    slug: '',
    content: '',
    meta_description: '',
    featured_image_url: '',
    published: false,
  });
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [error, setError] = useState('');
  const isNewPost = !slug;

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setPost(prev => ({
      ...prev,
      title: newTitle,
      slug: isNewPost ? slugify(newTitle) : prev.slug
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPost(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      const markdown = editorRef.current.getInstance().getMarkdown();
      setPost(prev => ({ ...prev, content: markdown }));
    }
  };

  const handleFeaturedImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingFeatured(true);
    setError('');

    const fileName = `public/${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
        .from('blog_images')
        .upload(fileName, file);

    if (uploadError) {
        setError(`Failed to upload image: ${uploadError.message}`);
        setUploadingFeatured(false);
        return;
    }

    const { data: { publicUrl } } = supabase.storage
        .from('blog_images')
        .getPublicUrl(fileName);

    setPost(prev => ({ ...prev, featured_image_url: publicUrl }));
    setUploadingFeatured(false);
  };

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase.from('categories').select('id, name').order('name');
      if (!error) setAllCategories(data);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isNewPost) {
      setLoading(false);
      return;
    }
    async function fetchPost() {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*, post_categories(category_id)')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post data.');
        setPost(null);
      } else {
        setPost(data);
        setSelectedCategories(new Set(data.post_categories.map(pc => pc.category_id)));
      }
      setLoading(false);
    }
    fetchPost();
  }, [slug, isNewPost]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!post.title || !post.slug) {
      setError('Title and slug are required.');
      return;
    }
    setSaving(true);
    setError('');

    const postData = {
      title: post.title,
      slug: post.slug,
      content: post.content,
      meta_description: post.meta_description,
      featured_image_url: post.featured_image_url,
      published: post.published,
      author_id: user.id,
      updated_at: new Date().toISOString(),
      ...(post.published && !post.published_at && { published_at: new Date().toISOString() }),
    };

    const { data: savedPost, error: saveError } = isNewPost
      ? await supabase.from('posts').insert(postData).select().single()
      : await supabase.from('posts').update(postData).eq('id', post.id).select().single();

    if (saveError) {
      console.error('Error saving post:', saveError);
      setError(saveError.message);
      setSaving(false);
      return;
    }
    
    const postId = savedPost.id;
    const { error: deleteCatError } = await supabase.from('post_categories').delete().eq('post_id', postId);
    if (deleteCatError) {
      setError('Error updating categories: ' + deleteCatError.message);
      setSaving(false);
      return;
    }

    const newAssociations = Array.from(selectedCategories).map(catId => ({
      post_id: postId,
      category_id: catId,
    }));

    if (newAssociations.length > 0) {
      const { error: insertCatError } = await supabase.from('post_categories').insert(newAssociations);
      if (insertCatError) {
        setError('Error saving categories: ' + insertCatError.message);
        setSaving(false);
        return;
      }
    }

    if (isNewPost || slug !== savedPost.slug) {
      navigate(`/admin/posts/edit/${savedPost.slug}`);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (isNewPost || !window.confirm('Are you sure you want to delete this post?')) return;
    
    setSaving(true);
    const { error: deleteError } = await supabase.from('posts').delete().eq('id', post.id);
    if (deleteError) {
      setError(deleteError.message);
      setSaving(false);
    } else {
      navigate('/admin/posts');
    }
  };

  if (loading) return <div className="text-center">Loading editor...</div>;
  if (!post) return <div className="text-center text-rose-500">{error || 'Post not found.'}</div>;

  return (
    <>
      <PageMeta title={isNewPost ? 'New Post | Admin' : `Edit: ${post.title} | Admin`} />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Link to="/admin/posts" className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
              <ArrowLeft className="h-4 w-4" /> Back to Posts
            </Link>
            <h1 className="text-2xl font-bold mt-1">{isNewPost ? 'Create New Post' : 'Edit Post'}</h1>
          </div>
          <div className="flex items-center gap-3">
            {!isNewPost && (
              <button type="button" onClick={handleDelete} disabled={saving} className="p-2 text-rose-500 hover:bg-[var(--muted)] rounded-md disabled:opacity-50" title="Delete Post">
                <Trash2 className="h-5 w-5" />
              </button>
            )}
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] disabled:opacity-60">
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              <span>{saving ? 'Saving...' : 'Save Post'}</span>
            </button>
          </div>
        </div>

        {error && <div className="p-3 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Input 
              id="title" 
              name="title" 
              value={post.title} 
              onChange={handleTitleChange} 
              className="h-auto text-2xl font-bold bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 placeholder:text-[var(--muted-foreground)]" 
              placeholder="Post Title"
              required 
            />
            <div className="prose-editor-wrapper">
              {!loading && (
                <Editor
                  key={post.id || 'new-post'}
                  ref={editorRef}
                  initialValue={post.content || ''}
                  previewStyle="vertical"
                  height="600px"
                  initialEditType="wysiwyg"
                  useCommandShortcut={true}
                  onChange={handleEditorChange}
                  theme={theme}
                  hooks={{
                    addImageBlobHook: async (blob, callback) => {
                      if (!blob) return;
                      const fileName = `public/${user.id}/${Date.now()}-${blob.name}`;
                      const { error: uploadError } = await supabase.storage.from('blog_images').upload(fileName, blob);
                      if (uploadError) {
                        console.error('Error uploading image:', uploadError);
                        alert(`Failed to upload image: ${uploadError.message}`);
                        return;
                      }
                      const { data: { publicUrl } } = supabase.storage.from('blog_images').getPublicUrl(fileName);
                      callback(publicUrl, blob.name);
                    }
                  }}
                />
              )}
            </div>
          </div>
          <aside className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publish Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label htmlFor="published-switch" className="flex flex-col space-y-1">
                    <span>Status</span>
                    <span className={`text-sm ${post.published ? 'text-green-400' : 'text-[var(--muted-foreground)]'}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </Label>
                  <Switch
                    id="published-switch"
                    checked={post.published}
                    onCheckedChange={(checked) => setPost(p => ({...p, published: checked}))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-40 overflow-y-auto space-y-3">
                  {allCategories.map(cat => (
                    <div key={cat.id} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id={`cat-${cat.id}`}
                        checked={selectedCategories.has(cat.id)}
                        onChange={() => handleCategoryChange(cat.id)}
                        className="h-4 w-4 rounded text-[var(--primary)] focus:ring-[var(--primary)] border-[var(--border)]"
                      />
                      <Label htmlFor={`cat-${cat.id}`} className="text-sm font-normal">{cat.name}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input id="slug" name="slug" value={post.slug} onChange={handleChange} required />
                </div>
                <div>
                  <Label>Featured Image</Label>
                  <label htmlFor="featured_image_upload" className="mt-2 cursor-pointer aspect-video w-full rounded-md border-2 border-dashed border-[var(--border)] flex items-center justify-center bg-cover bg-center hover:border-[var(--primary)] transition-colors" style={{backgroundImage: post.featured_image_url ? `url(${post.featured_image_url})` : 'none'}}>
                    {uploadingFeatured ? (
                      <Loader2 className="h-8 w-8 text-[var(--muted-foreground)] animate-spin" />
                    ) : !post.featured_image_url && (
                      <div className="text-center">
                        <UploadCloud className="mx-auto h-8 w-8 text-[var(--muted-foreground)]" />
                        <p className="mt-2 text-sm font-medium text-[var(--primary)]">Click to upload</p>
                        <p className="text-xs text-[var(--muted-foreground)]">PNG, JPG, GIF</p>
                      </div>
                    )}
                  </label>
                  <input type="file" id="featured_image_upload" accept="image/*" onChange={handleFeaturedImageUpload} disabled={uploadingFeatured} className="sr-only" />
                  {post.featured_image_url && (
                    <button type="button" onClick={() => setPost(p => ({...p, featured_image_url: ''}))} className="mt-2 text-xs text-rose-500 hover:underline">Remove image</button>
                  )}
                  <Input id="featured_image_url" name="featured_image_url" value={post.featured_image_url} onChange={handleChange} className="mt-2" placeholder="Or paste image URL" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
                <CardDescription>Search engine optimization settings.</CardDescription>
              </CardHeader>
              <CardContent>
                <Label htmlFor="meta_description">Meta Description</Label>
                <textarea id="meta_description" name="meta_description" value={post.meta_description} onChange={handleChange} rows={4} className="mt-2 flex min-h-[80px] w-full rounded-md border border-[var(--border)] bg-transparent px-3 py-2 text-sm placeholder:text-[var(--muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
              </CardContent>
            </Card>
          </aside>
        </div>
      </form>
      <style>{`
        .prose-editor-wrapper .toastui-editor-defaultUI {
          border-color: var(--border);
          background-color: var(--background-darkest);
        }
        .prose-editor-wrapper .toastui-editor-toolbar {
          background-color: var(--background-darkest);
          border-bottom-color: var(--border);
        }
        .prose-editor-wrapper .toastui-editor-md-container,
        .prose-editor-wrapper .toastui-editor-ww-container {
          background-color: var(--background-darkest);
        }
        .prose-editor-wrapper .toastui-editor-md-preview {
          background-color: var(--background);
        }
        .prose-editor-wrapper .toastui-editor-contents {
          font-family: var(--default-font-family);
          color: var(--foreground);
        }
        .prose-editor-wrapper .toastui-editor-contents h1,
        .prose-editor-wrapper .toastui-editor-contents h2,
        .prose-editor-wrapper .toastui-editor-contents h3,
        .prose-editor-wrapper .toastui-editor-contents h4,
        .prose-editor-wrapper .toastui-editor-contents h5,
        .prose-editor-wrapper .toastui-editor-contents h6 {
          color: var(--foreground);
          border-bottom-color: var(--border);
        }
        .prose-editor-wrapper .toastui-editor-contents p {
          color: var(--muted-foreground);
        }
        .prose-editor-wrapper .toastui-editor-toolbar-icons {
          color: var(--muted-foreground);
        }
        .prose-editor-wrapper .toastui-editor-toolbar-icons:hover {
          color: var(--foreground);
        }
        .prose-editor-wrapper .toastui-editor-popup-body {
          background-color: var(--background-darkest);
          border-color: var(--border);
        }
        .prose-editor-wrapper .toastui-editor-popup-body label,
        .prose-editor-wrapper .toastui-editor-popup-body input {
          color: var(--foreground);
        }
        .prose-editor-wrapper .toastui-editor-popup-body input {
          background-color: var(--background);
          border-color: var(--border);
        }
      `}</style>
    </>
  );
}