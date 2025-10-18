import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import PageMeta from '@/components/PageMeta';
import { Plus, Trash2, Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    duration: 'once',
    duration_in_months: '',
    max_redemptions: '',
    expires_at: '',
  });

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke('list-coupons');
    if (error) console.error('Error fetching coupons:', error);
    else setCoupons(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase.functions.invoke('create-coupon', {
      body: { ...formState, code: formState.code.toUpperCase() },
    });
    if (error) {
      alert('Error creating coupon: ' + error.message);
    } else {
      fetchCoupons();
      // Reset form
      setFormState({
        code: '', discount_type: 'percentage', discount_value: '',
        duration: 'once', duration_in_months: '', max_redemptions: '', expires_at: '',
      });
    }
    setIsSubmitting(false);
  };

  const handleDeleteCoupon = async (coupon) => {
    if (window.confirm(`Are you sure you want to deactivate the coupon "${coupon.code}"? This cannot be undone.`)) {
      const { error } = await supabase.functions.invoke('deactivate-coupon', {
        body: { promo_code_id: coupon.stripe_promotion_code_id, coupon_db_id: coupon.id },
      });
      if (error) alert('Error deactivating coupon: ' + error.message);
      else fetchCoupons();
    }
  };

  return (
    <>
      <PageMeta title="Manage Coupons | Admin" />
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Coupon Management</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <form onSubmit={handleCreateCoupon} className="p-4 rounded-lg border border-[var(--border)] bg-[var(--background-darkest)] space-y-4">
              <h3 className="font-semibold">Create New Coupon</h3>
              <input name="code" value={formState.code} onChange={handleFormChange} placeholder="CODE (e.g., SUMMER25)" className="input-style uppercase" required />
              <div className="grid grid-cols-2 gap-2">
                <select name="discount_type" value={formState.discount_type} onChange={handleFormChange} className="input-style">
                  <option value="percentage">Percentage</option>
                  <option value="fixed_amount">Fixed Amount</option>
                </select>
                <input name="discount_value" value={formState.discount_value} onChange={handleFormChange} type="number" placeholder="Value (e.g., 25)" className="input-style" required />
              </div>
              <select name="duration" value={formState.duration} onChange={handleFormChange} className="input-style">
                <option value="once">One Time</option>
                <option value="repeating">Repeating</option>
                <option value="forever">Forever</option>
              </select>
              {formState.duration === 'repeating' && <input name="duration_in_months" value={formState.duration_in_months} onChange={handleFormChange} type="number" placeholder="Duration in months" className="input-style" required />}
              <input name="max_redemptions" value={formState.max_redemptions} onChange={handleFormChange} type="number" placeholder="Max redemptions (optional)" className="input-style" />
              <input name="expires_at" value={formState.expires_at} onChange={handleFormChange} type="date" placeholder="Expiration date (optional)" className="input-style" />
              <button type="submit" disabled={isSubmitting} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] text-sm disabled:opacity-60">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Create Coupon
              </button>
            </form>
          </div>
          <div className="lg:col-span-2">
            {loading ? <p>Loading...</p> : (
              <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[var(--background-darkest)]">
                    <tr>
                      <th className="p-3 font-medium">Code</th>
                      <th className="p-3 font-medium">Discount</th>
                      <th className="p-3 font-medium">Status</th>
                      <th className="p-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map(c => (
                      <tr key={c.id} className="border-t border-[var(--border)]">
                        <td className="p-3 font-mono">{c.code}</td>
                        <td className="p-3">{c.discount_type === 'percentage' ? `${c.discount_value}% off` : `$${c.discount_value} off`} {c.duration}</td>
                        <td className="p-3">
                          {c.is_active ? <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400"><CheckCircle className="h-3 w-3" /> Active</span> : <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-gray-500/10 text-gray-400"><XCircle className="h-3 w-3" /> Inactive</span>}
                        </td>
                        <td className="p-3 text-right">
                          {c.is_active && <button onClick={() => handleDeleteCoupon(c)} className="p-2 text-rose-500 hover:bg-[var(--muted)] rounded-md"><Trash2 className="h-4 w-4" /></button>}
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
      <style>{`.input-style { background-color: var(--background); border: 1px solid var(--border); border-radius: 0.5rem; padding: 0.5rem 0.75rem; width: 100%; font-size: 0.875rem; }`}</style>
    </>
  );
}