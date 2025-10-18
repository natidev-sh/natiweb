import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import PageMeta from '@/components/PageMeta';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const slugify = (text) => {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) console.error('Error fetching categories:', error);
    else setCategories(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    setIsSubmitting(true);
    const { error } = await supabase.from('categories').insert({
      name: newCategoryName,
      slug: slugify(newCategoryName),
    });
    if (error) alert('Error: ' + error.message);
    else {
      setNewCategoryName('');
      fetchCategories();
    }
    setIsSubmitting(false);
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) alert('Error: ' + error.message);
      else fetchCategories();
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name.trim()) return;
    setIsSubmitting(true);
    const { error } = await supabase
      .from('categories')
      .update({ name: editingCategory.name, slug: slugify(editingCategory.name) })
      .eq('id', editingCategory.id);
    if (error) alert('Error: ' + error.message);
    else {
      setEditingCategory(null);
      fetchCategories();
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <PageMeta title="Manage Categories | Admin" />
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory} className="p-4 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)] space-y-4">
              <h3 className="font-semibold">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
              <div>
                <label htmlFor="category-name" className="block text-sm font-medium mb-1">Name</label>
                <input
                  id="category-name"
                  type="text"
                  value={editingCategory ? editingCategory.name : newCategoryName}
                  onChange={(e) => editingCategory ? setEditingCategory({...editingCategory, name: e.target.value}) : setNewCategoryName(e.target.value)}
                  className="w-full rounded-md bg-[var(--background)] border border-[var(--border)] px-3 py-2 text-sm"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] text-sm disabled:opacity-60">
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {editingCategory ? 'Update' : 'Add'}
                </button>
                {editingCategory && (
                  <button type="button" onClick={() => setEditingCategory(null)} className="px-4 py-2 rounded-md border border-[var(--border)] text-sm hover:bg-[var(--muted)]">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
          <div className="md:col-span-2">
            {loading ? <p>Loading...</p> : (
              <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[var(--background-darkest)]">
                    <tr>
                      <th className="p-3 font-medium">Name</th>
                      <th className="p-3 font-medium">Slug</th>
                      <th className="p-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map(cat => (
                      <tr key={cat.id} className="border-t border-[var(--border)]">
                        <td className="p-3 font-medium">{cat.name}</td>
                        <td className="p-3 font-mono text-xs opacity-70">{cat.slug}</td>
                        <td className="p-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button onClick={() => setEditingCategory(cat)} className="p-2 hover:bg-[var(--muted)] rounded-md">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-rose-500 hover:bg-[var(--muted)] rounded-md">
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
        </div>
      </div>
    </>
  );
}