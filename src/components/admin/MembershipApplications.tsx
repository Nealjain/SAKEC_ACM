
import { useState, useEffect } from 'react';
import { Search, ExternalLink, CheckCircle, XCircle, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';

interface MembershipApplication {
    id: string;
    created_at: string;
    full_name: string;
    email: string;
    prn: string;
    division: string;
    roll_number: string;
    contact_number: string;
    payment_screenshot_url: string;
    status: 'pending' | 'approved' | 'rejected';
    dob: string;
}

export default function MembershipApplications() {
    const [applications, setApplications] = useState<MembershipApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            console.log('Fetching membership applications...');

            // Try API endpoint first (for development)
            const isDevelopment = import.meta.env.DEV;
            const apiUrl = isDevelopment
                ? 'http://localhost:3001/api/membership-applications'
                : '/api/membership-applications.php';

            try {
                const response = await fetch(apiUrl);
                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        console.log('Applications loaded via API:', result.data?.length || 0);
                        setApplications(result.data || []);
                        setError(null);
                        return;
                    }
                }
            } catch (apiError) {
                console.log('API endpoint not available, trying direct Supabase...');
            }

            // Fallback to direct Supabase
            const { data, error } = await supabase
                .from('membership_applications')
                .select('*')
                .order('created_at', { ascending: false });

            console.log('Supabase response:', { data, error });

            if (error) {
                console.error('Supabase error:', error);
                setError(`Database error: ${error.message}`);
                throw error;
            }

            console.log('Applications loaded via Supabase:', data?.length || 0);
            setApplications(data || []);
            setError(null);
        } catch (error) {
            console.error('Error fetching applications:', error);
            setError(error instanceof Error ? error.message : 'Unknown error occurred');
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: 'approved' | 'rejected') => {
        try {
            // Try API endpoint first (for development)
            const isDevelopment = import.meta.env.DEV;
            const apiUrl = isDevelopment
                ? 'http://localhost:3001/api/membership-applications'
                : '/api/membership-applications.php';

            try {
                const response = await fetch(apiUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id, status: newStatus })
                });

                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        setApplications(prev => prev.map(app =>
                            app.id === id ? { ...app, status: newStatus } : app
                        ));
                        toast.success(`Application ${newStatus} successfully`);
                        return;
                    }
                }
            } catch (apiError) {
                console.log('API endpoint not available, trying direct Supabase...');
            }

            // Fallback to direct Supabase
            const { error } = await supabase
                .from('membership_applications')
                .update({ status: newStatus, updated_at: new Date().toISOString() })
                .eq('id', id);

            if (error) {
                console.error('Update error:', error);
                throw error;
            }

            setApplications(prev => prev.map(app =>
                app.id === id ? { ...app, status: newStatus } : app
            ));
            toast.success(`Application ${newStatus} successfully`);
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const deleteApplication = async (id: string) => {
        if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
            return;
        }

        try {
            // Fallback to direct Supabase
            const { error } = await supabase
                .from('membership_applications')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Delete error:', error);
                throw error;
            }

            setApplications(prev => prev.filter(app => app.id !== id));
            toast.success('Application deleted successfully');
        } catch (error) {
            console.error('Error deleting application:', error);
            toast.error('Failed to delete application');
        }
    };

    const filteredApplications = applications.filter(app =>
        app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.prn.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-2" />
                    <p className="text-gray-600">Loading membership applications...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                    <p className="text-red-600 font-medium">Error loading applications</p>
                    <p className="text-gray-600 text-sm mt-1">{error}</p>
                    <button
                        onClick={fetchApplications}
                        className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Membership Applications</h2>
                    <p className="text-gray-500">Manage student chapter membership requests</p>
                </div>
                <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full font-medium">
                    Total: {applications.length}
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search by name, email, or PRN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {applications.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
                        <p className="text-gray-500 mb-4">
                            No membership applications have been submitted yet. Applications will appear here when students submit them through the website.
                        </p>
                        <button
                            onClick={fetchApplications}
                            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                        >
                            Refresh
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Student Details</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Academic</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Payment</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredApplications.map((app) => (
                                    <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(app.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">{app.full_name}</span>
                                                <span className="text-sm text-gray-500">{app.email}</span>
                                                <span className="text-sm text-gray-500">{app.contact_number}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col text-sm text-gray-600">
                                                <span>PRN: {app.prn}</span>
                                                <span>Div: {app.division} | Roll: {app.roll_number}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <a
                                                href={app.payment_screenshot_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900 text-sm font-medium bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-md transition-colors"
                                            >
                                                View Screenshot
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${app.status === 'approved' ? 'bg-gray-100 text-gray-800 border border-gray-300' :
                                                    app.status === 'rejected' ? 'bg-gray-100 text-gray-800 border border-gray-300' :
                                                        'bg-gray-100 text-gray-800 border border-gray-300'}`}>
                                                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateStatus(app.id, 'approved')}
                                                    disabled={app.status === 'approved'}
                                                    className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    title="Approve"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(app.id, 'rejected')}
                                                    disabled={app.status === 'rejected'}
                                                    className="p-1 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    title="Reject"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => deleteApplication(app.id)}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredApplications.length === 0 && applications.length > 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            No applications match your search
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
