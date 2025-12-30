import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';
import { Save, Loader2, Upload, QrCode } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentSettings {
    id: string;
    bank_name: string;
    account_holder_name: string;
    account_number: string;
    ifsc_code: string;
    account_type: string;
    upi_id: string;
    fee_amount: number;
    qr_code_url: string;
}

export default function PaymentSettingsManager() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<PaymentSettings | null>(null);
    const [qrFile, setQrFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const { data, error } = await supabase
                .from('payment_settings')
                .select('*')
                .single();

            if (error && error.code !== 'PGRST116') { // Ignore "Row not found" if table is empty (though migration inserts one)
                throw error;
            }

            if (data) {
                setSettings(data);
                if (data.qr_code_url) {
                    setPreviewUrl(data.qr_code_url);
                }
            } else {
                // Initialize with defaults if empty
                setSettings({
                    id: '',
                    bank_name: '',
                    account_holder_name: '',
                    account_number: '',
                    ifsc_code: '',
                    account_type: '',
                    upi_id: '',
                    fee_amount: 400,
                    qr_code_url: ''
                });
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            toast.error('Failed to load payment settings');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setQrFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSave = async () => {
        if (!settings) return;
        setSaving(true);

        try {
            let uploadedQrUrl = settings.qr_code_url;

            // 1. Upload QR Code if new file selected
            if (qrFile) {
                const fileName = `upi-qr-${Date.now()}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('site_assets') // Ensure this bucket exists!
                    .upload(fileName, qrFile, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) throw uploadError;

                // Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('site_assets')
                    .getPublicUrl(fileName);

                uploadedQrUrl = publicUrl;
            }

            // 2. Update/Insert Settings
            const updates = {
                bank_name: settings.bank_name,
                account_holder_name: settings.account_holder_name,
                account_number: settings.account_number,
                ifsc_code: settings.ifsc_code,
                account_type: settings.account_type,
                upi_id: settings.upi_id,
                fee_amount: settings.fee_amount,
                qr_code_url: uploadedQrUrl,
                updated_at: new Date().toISOString()
            };

            let error;
            if (settings.id) {
                const { error: updateError } = await supabase
                    .from('payment_settings')
                    .update(updates)
                    .eq('id', settings.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('payment_settings')
                    .insert([updates]);
                error = insertError;
            }

            if (error) throw error;

            toast.success('Payment settings updated successfully');
            loadSettings(); // Reload to get stable state (and real ID if inserted)

        } catch (error: any) {
            console.error('Error saving settings:', error);
            toast.error(error.message || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Payment Settings</h2>
                    <p className="text-gray-500">Configure bank details and UPI for memberships.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm font-medium disabled:opacity-50"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bank Details Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <span className="text-xl">🏦</span> Bank Details
                        </h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Bank Name</label>
                            <input
                                type="text"
                                value={settings?.bank_name || ''}
                                onChange={(e) => setSettings(prev => prev ? ({ ...prev, bank_name: e.target.value }) : null)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="e.g. Canara Bank"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Account Holder Name</label>
                            <input
                                type="text"
                                value={settings?.account_holder_name || ''}
                                onChange={(e) => setSettings(prev => prev ? ({ ...prev, account_holder_name: e.target.value }) : null)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="e.g. SAKEC ACM"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Account Number</label>
                                <input
                                    type="text"
                                    value={settings?.account_number || ''}
                                    onChange={(e) => setSettings(prev => prev ? ({ ...prev, account_number: e.target.value }) : null)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">IFSC Code</label>
                                <input
                                    type="text"
                                    value={settings?.ifsc_code || ''}
                                    onChange={(e) => setSettings(prev => prev ? ({ ...prev, ifsc_code: e.target.value }) : null)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Account Type</label>
                            <select
                                value={settings?.account_type || ''}
                                onChange={(e) => setSettings(prev => prev ? ({ ...prev, account_type: e.target.value }) : null)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            >
                                <option value="Savings">Savings</option>
                                <option value="Current">Current</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* UPI & QR Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <QrCode className="w-5 h-5" /> UPI & QR Code
                        </h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">UPI ID (VPA)</label>
                            <input
                                type="text"
                                value={settings?.upi_id || ''}
                                onChange={(e) => setSettings(prev => prev ? ({ ...prev, upi_id: e.target.value }) : null)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="e.g. sakec.acm@okaxis"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Membership Fee (₹)</label>
                            <input
                                type="number"
                                value={settings?.fee_amount || 0}
                                onChange={(e) => setSettings(prev => prev ? ({ ...prev, fee_amount: parseFloat(e.target.value) }) : null)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">QR Code Image</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                                {previewUrl ? (
                                    <div className="relative group">
                                        <img
                                            src={previewUrl}
                                            alt="QR Preview"
                                            className="w-48 h-48 object-contain rounded-lg shadow-sm bg-white p-2"
                                        />
                                        <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg cursor-pointer text-white font-medium">
                                            Change QR
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                ) : (
                                    <label className="flex flex-col items-center cursor-pointer text-gray-500 hover:text-blue-600 transition-colors">
                                        <Upload className="w-10 h-10 mb-2" />
                                        <span className="font-medium">Upload QR Code</span>
                                        <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
