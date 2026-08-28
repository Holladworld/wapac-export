import { useEffect, useState, useCallback, useRef } from 'react';
import { Loader2, Save, Check, Upload, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { type SiteSettings } from '../../lib/supabase';
import { adminApi } from '../../lib/adminApi';
import { supabase } from '../../lib/supabase';

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadTarget, setActiveUploadTarget] = useState<string>('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await adminApi.select('site_settings', { columns: 'key, value' });
    const map: SiteSettings = {};
    (data || []).forEach((row: { key: string; value: string }) => { map[row.key] = row.value; });
    setSettings(map);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    setSaving(true);
    const entries = Object.entries(settings);
    for (const [key, value] of entries) {
      await adminApi.upsert('site_settings', { key, value, updated_at: new Date().toISOString() });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleFileUpload = async (file: File, settingKey: string) => {
    if (!file) return;
    setUploadError(null);

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image must be under 2MB.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file (PNG, JPG, WebP).');
      return;
    }

    setUploadingField(settingKey);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
    const fileName = `${settingKey}-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('site-assets')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      setUploadError('Upload failed. Please try again.');
      setUploadingField(null);
      return;
    }

    const { data: urlData } = supabase.storage.from('site-assets').getPublicUrl(fileName);
    const publicUrl = urlData.publicUrl;

    setSettings((prev) => ({ ...prev, [settingKey]: publicUrl }));
    await adminApi.upsert('site_settings', { key: settingKey, value: publicUrl, updated_at: new Date().toISOString() });

    setUploadingField(null);
  };

  const triggerFileInput = (settingKey: string, ref: React.RefObject<HTMLInputElement>) => {
    setActiveUploadTarget(settingKey);
    ref.current?.click();
  };

  const inputClass = "w-full px-3 py-2 text-sm border outline-none";
  const inputStyle = { backgroundColor: 'var(--tcf-primary)', borderColor: 'var(--tcf-border)', color: 'var(--tcf-text)' };

  const textFields = [
    { key: 'site_name', label: 'Site Name' },
    { key: 'site_tagline', label: 'Site Tagline' },
    { key: 'hero_eyebrow', label: 'Hero Eyebrow' },
    { key: 'hero_title', label: 'Hero Title (comma separates lines)' },
    { key: 'hero_subtitle', label: 'Hero Subtitle' },
    { key: 'featured_eyebrow', label: 'Featured Section Eyebrow' },
    { key: 'featured_title', label: 'Featured Section Title' },
    { key: 'contact_email', label: 'Contact Email' },
    { key: 'contact_phone', label: 'Contact Phone' },
    { key: 'contact_address', label: 'Contact Address' },
    { key: 'footer_about', label: 'Footer About Text' },
    { key: 'footer_copyright', label: 'Footer Copyright' },
    { key: 'accent_color', label: 'Accent Color (hex)' },
    { key: 'button_color', label: 'Button Color (hex)' },
    { key: 'button_text_color', label: 'Button Text Color (hex)' },
  ];

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" size={28} style={{ color: 'var(--tcf-accent)' }} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--tcf-text)' }}>Site Settings</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--tcf-secondary-text)' }}>Manage your logo, branding, and website content — no code needed.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium disabled:opacity-50" style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}>
          {saved ? <Check size={14} /> : saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {uploadError && (
        <div className="p-3 text-sm" style={{ backgroundColor: 'rgba(220,38,38,0.1)', border: '1px solid #dc2626', color: '#dc2626' }}>
          {uploadError}
        </div>
      )}

      {/* Logo Upload Section */}
      <div className="p-6" style={{ backgroundColor: 'var(--tcf-card)', border: '1px solid var(--tcf-border)' }}>
        <h2 className="font-serif text-lg font-bold mb-1" style={{ color: 'var(--tcf-text)' }}>Logo</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--tcf-secondary-text)' }}>Upload your company logo. PNG with transparent background works best. Max 2MB.</p>
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-40 h-40 flex items-center justify-center shrink-0 border" style={{ backgroundColor: 'var(--tcf-bg)', borderColor: 'var(--tcf-border)' }}>
            {settings.logo_url ? (
              <img src={settings.logo_url} alt="Logo preview" className="max-w-full max-h-full object-contain p-2" />
            ) : (
              <ImageIcon size={32} style={{ color: 'var(--tcf-secondary-text)' }} />
            )}
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex gap-3">
              <button
                onClick={() => triggerFileInput('logo_url', fileInputRef)}
                disabled={uploadingField === 'logo_url'}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium disabled:opacity-50"
                style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}
              >
                {uploadingField === 'logo_url' ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {uploadingField === 'logo_url' ? 'Uploading...' : 'Upload Logo'}
              </button>
              {settings.logo_url && (
                <button
                  onClick={() => { setSettings({ ...settings, logo_url: '' }); }}
                  className="px-4 py-2.5 text-sm border"
                  style={{ borderColor: 'var(--tcf-border)', color: 'var(--tcf-secondary-text)' }}
                >
                  Remove
                </button>
              )}
            </div>
            <input
              type="text"
              value={settings.logo_url || ''}
              onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
              placeholder="Or paste logo URL here..."
              className={inputClass}
              style={inputStyle}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, 'logo_url'); e.target.value = ''; }}
            />
          </div>
        </div>
      </div>

      {/* Hero Background Upload Section */}
      <div className="p-6" style={{ backgroundColor: 'var(--tcf-card)', border: '1px solid var(--tcf-border)' }}>
        <h2 className="font-serif text-lg font-bold mb-1" style={{ color: 'var(--tcf-text)' }}>Hero Background Image</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--tcf-secondary-text)' }}>Upload a dark charcoal background image for the hero section. Landscape orientation recommended. Max 2MB.</p>
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="w-full md:w-64 aspect-video flex items-center justify-center shrink-0 border overflow-hidden" style={{ backgroundColor: 'var(--tcf-bg)', borderColor: 'var(--tcf-border)' }}>
            {settings.hero_bg_image ? (
              <img src={settings.hero_bg_image} alt="Hero background preview" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon size={32} style={{ color: 'var(--tcf-secondary-text)' }} />
            )}
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex gap-3">
              <button
                onClick={() => triggerFileInput('hero_bg_image', heroInputRef)}
                disabled={uploadingField === 'hero_bg_image'}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium disabled:opacity-50"
                style={{ backgroundColor: 'var(--tcf-button)', color: 'var(--tcf-button-text)' }}
              >
                {uploadingField === 'hero_bg_image' ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {uploadingField === 'hero_bg_image' ? 'Uploading...' : 'Upload Image'}
              </button>
              {settings.hero_bg_image && (
                <button
                  onClick={() => { setSettings({ ...settings, hero_bg_image: '' }); }}
                  className="px-4 py-2.5 text-sm border"
                  style={{ borderColor: 'var(--tcf-border)', color: 'var(--tcf-secondary-text)' }}
                >
                  Remove
                </button>
              )}
            </div>
            <input
              type="text"
              value={settings.hero_bg_image || ''}
              onChange={(e) => setSettings({ ...settings, hero_bg_image: e.target.value })}
              placeholder="Or paste image URL here..."
              className={inputClass}
              style={inputStyle}
            />
            <input
              ref={heroInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, 'hero_bg_image'); e.target.value = ''; }}
            />
          </div>
        </div>
      </div>

      {/* Text Settings */}
      <div className="p-6" style={{ backgroundColor: 'var(--tcf-card)', border: '1px solid var(--tcf-border)' }}>
        <h2 className="font-serif text-lg font-bold mb-4" style={{ color: 'var(--tcf-text)' }}>Content & Branding</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {textFields.map((field) => (
            <div key={field.key}>
              <label className="block text-xs tracking-wide uppercase mb-1.5" style={{ color: 'var(--tcf-secondary-text)' }}>{field.label}</label>
              {field.key === 'footer_about' ? (
                <textarea value={settings[field.key] || ''} onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })} rows={3} className={inputClass + ' resize-y'} style={inputStyle} />
              ) : (
                <input type="text" value={settings[field.key] || ''} onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })} className={inputClass} style={inputStyle} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
