import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, Users, Calendar, FileText, Shield, Mail, Image, Send, Megaphone,
  LayoutDashboard, Menu, X, CreditCard
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import TeamManager from '../components/admin/TeamManager';
import EventManager from '../components/admin/EventManager';
import BlogManager from '../components/admin/BlogManager';
import MessagesViewer from '../components/admin/MessagesViewer';
import UnifiedEmailSystem from '../components/admin/UnifiedEmailSystem';
import GalleryManager from '../components/admin/GalleryManager';
import AlumniManager from '../components/admin/AlumniManager';
import FacultyManager from '../components/admin/FacultyManager';
import AnnouncementsManager from '../components/admin/AnnouncementsManager';
import MembershipApplications from '../components/admin/MembershipApplications';
import PaymentSettingsManager from '../components/admin/PaymentSettingsManager';
import { MobileAdminTabs } from '../components/admin/MobileAdminTabs';

interface Stats {
  members: number;
  events: number;
  blogs: number;
  messages: number;
  gallery: number;
  alumni: number;
  faculty: number;
  subscribers: number;
}

type ActiveTab = 'dashboard' | 'team' | 'events' | 'blogs' | 'messages' | 'email' | 'gallery' | 'faculty' | 'announcements' | 'alumni' | 'memberships' | 'payment-settings';

const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'memberships', label: 'Memberships', icon: Shield },
  { id: 'payment-settings', label: 'Payment Settings', icon: CreditCard },
  { id: 'email', label: 'Email System', icon: Send },
  { id: 'team', label: 'Team Members', icon: Users },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'blogs', label: 'Blogs', icon: FileText },
  { id: 'messages', label: 'Contact Messages', icon: Mail },
  { id: 'gallery', label: 'Gallery', icon: Image },
  { id: 'alumni', label: 'Alumni', icon: Users },
  { id: 'faculty', label: 'Faculty', icon: Shield },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
];

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<{ username: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    members: 0,
    events: 0,
    blogs: 0,
    messages: 0,
    gallery: 0,
    alumni: 0,
    faculty: 0,
    subscribers: 0
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verify authentication
    const adminSession = localStorage.getItem('admin_session');
    if (!adminSession) {
      navigate('/admin');
      return;
    }

    const session = JSON.parse(adminSession);
    setAdmin(session);
    loadStats();
    setLoading(false);
  }, [navigate]);

  const loadStats = async () => {
    try {
      const [membersRes, eventsRes, blogsRes, messagesRes, galleryRes, alumniRes, facultyRes, subscribersRes] = await Promise.all([
        supabase.from('team_members').select('id', { count: 'exact', head: true }),
        supabase.from('events').select('id', { count: 'exact', head: true }),
        supabase.from('blogs').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
        supabase.from('event_galleries').select('id', { count: 'exact', head: true }),
        supabase.from('alumni_members').select('id', { count: 'exact', head: true }),
        supabase.from('faculty_members').select('id', { count: 'exact', head: true }),
        supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true })
      ]);

      setStats({
        members: membersRes.count || 0,
        events: eventsRes.count || 0,
        blogs: blogsRes.count || 0,
        messages: messagesRes.count || 0,
        gallery: galleryRes.count || 0,
        alumni: alumniRes.count || 0,
        faculty: facultyRes.count || 0,
        subscribers: subscribersRes.count || 0
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-900">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
      `}>
        <div className="h-full flex flex-col">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
              <span className="font-bold text-lg sm:text-xl text-gray-900">Admin Panel</span>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-1">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as ActiveTab);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all text-sm sm:text-base ${activeTab === item.id
                  ? 'bg-black text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <item.icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="font-medium truncate">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-3 sm:p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm sm:text-base"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-gray-200 p-3 sm:p-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2 sm:gap-3">
            <img src="/logo.png" alt="Logo" className="h-7 sm:h-8 w-auto" />
            <span className="font-bold text-base sm:text-lg text-gray-900">Admin Panel</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>


        {/* Mobile: Sticky Tabs */}
        <div className="md:hidden">
          <MobileAdminTabs stats={stats} />
        </div>

        {/* Desktop: Regular Layout */}
        <div className="hidden md:block p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {SIDEBAR_ITEMS.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-gray-500 text-sm sm:text-base">Welcome back, {admin?.username}</p>
            </div>

            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-gray-500 text-xs sm:text-sm font-medium">Total Members</h3>
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.members}</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-gray-500 text-xs sm:text-sm font-medium">Active Events</h3>
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.events}</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-gray-500 text-xs sm:text-sm font-medium">Published Blogs</h3>
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.blogs}</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-gray-500 text-xs sm:text-sm font-medium">Newsletter Subscribers</h3>
                    <Send className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.subscribers}</p>
                </div>
              </div>
            )}

            {activeTab === 'memberships' && <MembershipApplications />}
            {activeTab === 'payment-settings' && <PaymentSettingsManager />}
            {activeTab === 'email' && <UnifiedEmailSystem />}
            {activeTab === 'team' && <TeamManager />}
            {activeTab === 'events' && <EventManager />}
            {activeTab === 'blogs' && <BlogManager />}
            {activeTab === 'messages' && <MessagesViewer />}
            {activeTab === 'gallery' && <GalleryManager />}
            {activeTab === 'alumni' && <AlumniManager />}
            {activeTab === 'faculty' && <FacultyManager />}
            {activeTab === 'announcements' && <AnnouncementsManager />}
          </div>
        </div>
      </main>
    </div>
  );
}
