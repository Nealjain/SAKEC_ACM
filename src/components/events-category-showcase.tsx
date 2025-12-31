import StickyTabs from '@/components/ui/sticky-section-tabs';
import { Code, Users, Award } from 'lucide-react';

export function EventsCategoryShowcase() {
    return (
        <div className="hidden">
            <StickyTabs
                mainNavHeight="4rem"
                rootClassName="bg-transparent text-gray-900"
                navSpacerClassName="border-b border-gray-200 bg-transparent"
                sectionClassName="bg-transparent"
                stickyHeaderContainerClassName="shadow-sm"
                headerContentWrapperClassName="border-b border-gray-200 bg-transparent backdrop-blur-sm"
                headerContentLayoutClassName="px-4 py-4"
                titleClassName="text-lg font-bold text-gray-900"
                contentLayoutClassName="px-4 py-6"
            >

                <StickyTabs.Item title="Technical Workshops" id="workshops">
                    <div className="space-y-4 bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl">
                        <div className="relative rounded-xl overflow-hidden">
                            <img
                                src="https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/blog-photos/Sakec.aictelab11.jpg"
                                alt="Workshop"
                                className="w-full h-48 object-cover"
                            />
                        </div>
                        <div className="flex items-start gap-3">
                            <Code className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Learn & Build</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Hands-on coding sessions, hackathons, and technical workshops on cutting-edge technologies.
                                    Build real projects and enhance your programming skills with industry experts.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <img
                                src="https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/event-photos/PYTHON%20PROGRAMMING%20LEARN%20IT%20WELL%20(PP)/python4.jpg"
                                alt="Python Workshop"
                                className="w-full h-32 object-cover rounded-lg"
                            />
                            <img
                                src="https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/blog-photos/Sakec.aictelab1.jpg"
                                alt="Lab Session"
                                className="w-full h-32 object-cover rounded-lg"
                            />
                        </div>
                    </div>
                </StickyTabs.Item>

                <StickyTabs.Item title="Competitions & Hackathons" id="competitions">
                    <div className="space-y-4">
                        <div className="relative rounded-xl overflow-hidden">
                            <img
                                src="https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/event-photos/Triumph/triumph4.jpg"
                                alt="Competition"
                                className="w-full h-48 object-cover"
                            />
                        </div>
                        <div className="flex items-start gap-3">
                            <Award className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Compete & Win</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Challenge yourself in coding contests, hackathons, and innovation challenges.
                                    Showcase your skills, win prizes, and get recognized by industry leaders.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <img
                                src="https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/event-photos/Innovative%20Project%20Hunt/iph2.jpg"
                                alt="Project Hunt"
                                className="w-full h-32 object-cover rounded-lg"
                            />
                            <img
                                src="https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/event-photos/A%20Talk%20on%20ETHICAL%20HACKING%20AND%20CYBER%20SECURITY/ethicalHacking2.jpg"
                                alt="Cyber Security"
                                className="w-full h-32 object-cover rounded-lg"
                            />
                        </div>
                    </div>
                </StickyTabs.Item>

                <StickyTabs.Item title="Community & Networking" id="community">
                    <div className="space-y-4">
                        <div className="relative rounded-xl overflow-hidden">
                            <img
                                src="https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/event-photos/CSRA%20-Gaushala/csrGaushala2.jpg"
                                alt="Community Event"
                                className="w-full h-48 object-cover"
                            />
                        </div>
                        <div className="flex items-start gap-3">
                            <Users className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Connect & Grow</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Network with industry professionals, alumni, and fellow tech enthusiasts.
                                    Participate in CSR activities, team celebrations, and community building events.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <img
                                src="https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/event-photos/Android/an3.jpg"
                                alt="Android Workshop"
                                className="w-full h-32 object-cover rounded-lg"
                            />
                            <img
                                src="https://dhxzkzdlsszwuqjkicnv.supabase.co/storage/v1/object/public/event-photos/IoT%20(1)/iot3.jpg"
                                alt="IoT Session"
                                className="w-full h-32 object-cover rounded-lg"
                            />
                        </div>
                    </div>
                </StickyTabs.Item>
            </StickyTabs>
        </div>
    );
}
