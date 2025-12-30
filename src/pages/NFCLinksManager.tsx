import { useState, useEffect } from 'react';
import { Link2, Copy, CheckCircle, ExternalLink, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAdminAuth } from '../hooks/useAdminAuth';

interface TeamMember {
  id: string;
  name: string;
  position: string;
  email: string;
  year: string;
  status: string;
}

export default function NFCLinksManager() {
  const { isAuthenticated, loading: authLoading } = useAdminAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const baseUrl = window.location.origin;

  useEffect(() => {
    if (isAuthenticated) {
      loadMembers();
    }
  }, [isAuthenticated]);

  const loadMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('team_members')
      .select('id, name, position, email, year, status')
      .order('name');

    if (!error && data) {
      setMembers(data);
    }
    setLoading(false);
  };

  const copyToClipboard = async (memberId: string) => {
    const url = `${baseUrl}/nfc/${memberId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(memberId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      alert('Failed to copy link');
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-xl text-gray-900">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Link2 className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">NFC Links Manager</h1>
              <p className="text-gray-600 mt-1">View and copy NFC profile links for all team members</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, position, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Link2 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">{members.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Members</p>
                <p className="text-2xl font-bold text-gray-900">
                  {members.filter(m => !m.status || m.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Filtered Results</p>
                <p className="text-2xl font-bold text-gray-900">{filteredMembers.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Team Members NFC Links</h2>
            <p className="text-sm text-gray-600 mt-1">
              Click copy button to copy the NFC profile link for each member
            </p>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading members...</div>
          ) : filteredMembers.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              {searchQuery ? 'No members found matching your search' : 'No members found'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Name</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Position</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Year</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Status</th>
                    <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">NFC Link</th>
                    <th className="text-center py-4 px-6 text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => {
                    const nfcUrl = `${baseUrl}/nfc/${member.id}`;
                    return (
                      <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
                          {member.name}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {member.position}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {member.year || '-'}
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            !member.status || member.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {member.status || 'active'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                            /nfc/{member.id.substring(0, 8)}...
                          </code>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => copyToClipboard(member.id)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                copiedId === member.id
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                              }`}
                              title="Copy NFC link"
                            >
                              {copiedId === member.id ? (
                                <>
                                  <CheckCircle className="w-4 h-4" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-4 h-4" />
                                  Copy Link
                                </>
                              )}
                            </button>
                            
                            <a
                              href={nfcUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                              title="Open in new tab"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-3">How to Use NFC Links:</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              <span>Click "Copy Link" to copy the NFC profile URL for any member</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              <span>Use the link to program NFC cards or share member profiles</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              <span>Click the external link icon to preview the member's NFC profile page</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">4.</span>
              <span>Use the search bar to quickly find specific members</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
