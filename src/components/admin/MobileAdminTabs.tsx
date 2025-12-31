import StickyTabs from '@/components/ui/sticky-section-tabs';
import MembershipApplications from '@/components/admin/MembershipApplications';
import PaymentSettingsManager from '@/components/admin/PaymentSettingsManager';
import UnifiedEmailSystem from '@/components/admin/UnifiedEmailSystem';
import TeamManager from '@/components/admin/TeamManager';
import EventManager from '@/components/admin/EventManager';
import BlogManager from '@/components/admin/BlogManager';
import MessagesViewer from '@/components/admin/MessagesViewer';
import GalleryManager from '@/components/admin/GalleryManager';
import AlumniManager from '@/components/admin/AlumniManager';
import FacultyManager from '@/components/admin/FacultyManager';
import AnnouncementsManager from '@/components/admin/AnnouncementsManager';
import { Users, Calendar, FileText, Send, Shield } from 'lucide-react';

interface MobileAdminTabsProps {
    stats: {
        members: number;
        events: number;
        blogs: number;
        subscribers: number;
        alumni: number;
        faculty: number;
    };
}

export function MobileAdminTabs({ stats }: MobileAdminTabsProps) {
    return (
        <StickyTabs
            mainNavHeight="3.5rem"
            rootClassName="bg-gray-50 text-gray-900"
            navSpacerClassName="border-b border-gray-200 bg-white"
            sectionClassName="bg-white"
            stickyHeaderContainerClassName="shadow-sm"
            headerContentWrapperClassName="border-b border-gray-200 bg-white"
            headerContentLayoutClassName="px-4 py-3"
            titleClassName="text-lg font-semibold text-gray-900"
            contentLayoutClassName="px-4 py-6"
        >
            <StickyTabs.Item title="Dashboard" id="dashboard">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-blue-700 text-xs font-semibold uppercase tracking-wider">Members</h3>
                            <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{stats.members}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-purple-700 text-xs font-semibold uppercase tracking-wider">Events</h3>
                            <Calendar className="w-4 h-4 text-purple-600" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{stats.events}</p>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-emerald-700 text-xs font-semibold uppercase tracking-wider">Blogs</h3>
                            <FileText className="w-4 h-4 text-emerald-600" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{stats.blogs}</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-orange-700 text-xs font-semibold uppercase tracking-wider">Subscribers</h3>
                            <Send className="w-4 h-4 text-orange-600" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{stats.subscribers}</p>
                    </div>
                    <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-rose-700 text-xs font-semibold uppercase tracking-wider">Alumni</h3>
                            <Users className="w-4 h-4 text-rose-600" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{stats.alumni}</p>
                    </div>
                    <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-cyan-700 text-xs font-semibold uppercase tracking-wider">Faculty</h3>
                            <Shield className="w-4 h-4 text-cyan-600" />
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{stats.faculty}</p>
                    </div>
                </div>
            </StickyTabs.Item>

            <StickyTabs.Item title="Memberships" id="memberships">
                <MembershipApplications />
            </StickyTabs.Item>

            <StickyTabs.Item title="Payment Settings" id="payment">
                <PaymentSettingsManager />
            </StickyTabs.Item>

            <StickyTabs.Item title="Email System" id="email">
                <UnifiedEmailSystem />
            </StickyTabs.Item>

            <StickyTabs.Item title="Team" id="team">
                <TeamManager />
            </StickyTabs.Item>

            <StickyTabs.Item title="Events" id="events">
                <EventManager />
            </StickyTabs.Item>

            <StickyTabs.Item title="Blogs" id="blogs">
                <BlogManager />
            </StickyTabs.Item>

            <StickyTabs.Item title="Messages" id="messages">
                <MessagesViewer />
            </StickyTabs.Item>

            <StickyTabs.Item title="Gallery" id="gallery">
                <GalleryManager />
            </StickyTabs.Item>

            <StickyTabs.Item title="Alumni" id="alumni">
                <AlumniManager />
            </StickyTabs.Item>

            <StickyTabs.Item title="Faculty" id="faculty">
                <FacultyManager />
            </StickyTabs.Item>

            <StickyTabs.Item title="Announcements" id="announcements">
                <AnnouncementsManager />
            </StickyTabs.Item>
        </StickyTabs>
    );
}
