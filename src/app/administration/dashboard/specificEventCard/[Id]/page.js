'use client';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { EventApi, BroadFocusAreaApi } from '@/utilities/ApiManager';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import DashboardLoading from '@/app/administration/dashboard/loading';
import { formatDate } from '@/Component/UI/TableFormat';
import { FaInfoCircle, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaLink,
  FaHashtag,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaMapMarkedAlt,
  FaGlobe,
  FaUsers,
  FaTag,
  FaClock,
  FaEye,
  FaEdit,
  FaShare,
  FaBookmark,
  FaEllipsisV
} from 'react-icons/fa';

export default function SpecificEventCard() {
    const { Id } = useParams();
    const [event, setEvent] = useState(null);
    const [showFocusArea, setShowFocusArea] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();

    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.menu.loading);


    const fetchEvent = async () => {
        try {
            dispatch(setLoading(true));
            const [eventRes] = await Promise.all([
                EventApi(null, "GET", { Id }),
            ]);
            
            if (    eventRes.statusCode === 200) {
                setEvent(eventRes.data);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (Id) fetchEvent();
    }, [Id]);

    const exportToPDF = () => {
        router.push(`/administration/dashboard/exportSpeaker/${Id}`);
    };

    if (isLoading) {
        return <DashboardLoading />;
    }

    if (!event) {
        return (
            <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="text-center p-6 bg-white rounded-xl shadow-sm max-w-md mx-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaInfoCircle className="text-blue-500 text-2xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Event Not Found</h3>
                    <p className="text-slate-600">The requested event could not be loaded.</p>
                </div>
            </div>
        );
    }

    const hasSocialLinks = event.socialMediaLinks && (
        event.socialMediaLinks.facebook ||
        event.socialMediaLinks.instagram ||
        event.socialMediaLinks.twitter ||
        event.socialMediaLinks.linkedin ||
        event.socialMediaLinks.youtube
    );

    const tabs = [
        { id: 'overview', label: 'Overview', icon: FaEye },
        { id: 'details', label: 'Details', icon: FaInfoCircle },
        { id: 'location', label: 'Location', icon: FaMapMarkerAlt },
        { id: 'social', label: 'Social', icon: FaShare, disabled: !hasSocialLinks }
    ];

    return (
        <div className="bg-slate-50">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md bg-white/95 shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {/* <button 
                                onClick={toggleFocusArea}
                                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                <FaInfoCircle className="text-slate-600 text-lg" />
                            </button> */}
                            <div className="truncate">
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 truncate">
                                    {event.title}
                                </h1>
                                <p className="text-slate-500 text-xs sm:text-sm">
                                    Event #{Id} • {event.year}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <div className="hidden sm:flex items-center gap-2">
                                <button  className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm">
                                    <FaBookmark className="text-sm" />
                                    <span>Save</span>
                                </button>
                                <button onClick={exportToPDF} className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-sm">
                                    <FaEdit className="text-sm" />
                                    <span>Export Speakers</span>
                                </button>
                            </div>
                            <button 
                                className="sm:hidden p-2 rounded-lg hover:bg-slate-100"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                <FaEllipsisV className="text-slate-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
                    <div className="absolute right-4 top-16 bg-white rounded-lg shadow-xl p-2 w-48" onClick={e => e.stopPropagation()}>
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-slate-50 rounded-md">
                            <FaBookmark className="text-blue-600" />
                            <span>Save Event</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-slate-50 rounded-md">
                            <FaEdit className="text-slate-600" />
                            <span>Edit Event</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-slate-50 rounded-md">
                            <FaShare className="text-slate-600" />
                            <span>Share</span>
                        </button>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Event Hero Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6 hover:shadow-md transition-all duration-300">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                                            <FaCalendarAlt className="text-lg sm:text-xl" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl sm:text-2xl font-bold mb-1">{event.title}</h2>
                                            <p className="text-blue-100 text-xs sm:text-sm">Edition {event.edition} • {event.year}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                                        <div className="text-blue-100 text-xs">Duration</div>
                                        <div className="text-base sm:text-lg font-semibold">
                                            {Math.ceil((new Date(event.dates?.end) - new Date(event.dates?.start)) / (1000 * 60 * 60 * 24))} days
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                                        <div className="flex items-center gap-2 text-blue-100 text-xs mb-1">
                                            <FaCalendarAlt />
                                            <span>Start Date</span>
                                        </div>
                                        <p className="text-base sm:text-lg font-semibold">
                                            {formatDate(new Date(event.dates?.start), 'MMM dd, yyyy')}
                                        </p>
                                    </div>
                                    
                                    <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                                        <div className="flex items-center gap-2 text-blue-100 text-xs mb-1">
                                            <FaMapMarkerAlt />
                                            <span>Location</span>
                                        </div>
                                        <p className="text-base sm:text-lg font-semibold">
                                            {event.location?.city}, {event.location?.country}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 overflow-hidden">
                            <div className="flex overflow-x-auto scrollbar-hide">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => !tab.disabled && setActiveTab(tab.id)}
                                            disabled={tab.disabled}
                                            className={`flex items-center gap-2 px-4 py-3 font-medium transition-all duration-200 border-b-2 whitespace-nowrap text-sm ${activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600 bg-blue-50'
                                                : tab.disabled
                                                    ? 'border-transparent text-slate-400 cursor-not-allowed'
                                                    : 'border-transparent text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            <Icon className="text-base" />
                                            <span>{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="space-y-6">
                            {activeTab === 'overview' && <OverviewTab event={event} />}
                            {activeTab === 'details' && <DetailsTab event={event} />}
                            {activeTab === 'location' && <LocationTab event={event} />}
                            {activeTab === 'social' && <SocialTab event={event} />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Tab Components
function OverviewTab({ event }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-all duration-300">
            <h3 className="text-xl font-bold text-slate-800 mb-4">About the Event</h3>
            <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                    {event.description || 'No description available for this event.'}
                </p>
            </div>
        </div>
    );
}

function DetailsTab({ event }) {
    const details = [
        { label: 'Year', value: event.year, icon: FaCalendarAlt },
        { label: 'Edition', value: event.edition, icon: FaHashtag },
        { label: 'Start Date', value: formatDate(new Date(event.dates?.start), 'MMM dd, yyyy'), icon: FaCalendarAlt },
        { label: 'End Date', value: formatDate(new Date(event.dates?.end), 'MMM dd, yyyy'), icon: FaCalendarAlt },
    ];

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Event Information</h3>
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3">
                    {details.map((detail, index) => {
                        const Icon = detail.icon;
                        return (
                            <div
                                key={index}
                                className="bg-slate-50 p-3 rounded-lg hover:bg-slate-100 transition-all duration-200 flex items-center gap-3"
                            >
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Icon className="text-blue-600 text-sm" />
                                </div>
                                <div>
                                    <div className="text-slate-500 text-xs font-medium">{detail?.label}</div>
                                    <p className="text-slate-800 font-semibold text-sm sm:text-base">
                                        {detail?.value}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {event.websiteURL && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Website</h3>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-3 mb-2">
                            <FaGlobe className="text-blue-600 text-lg" />
                            <span className="text-slate-700 font-medium text-sm">Official Website</span>
                        </div>
                        <a
                            href={event.websiteURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base break-all hover:underline transition-colors duration-200"
                        >
                            {event.websiteURL}
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}

function LocationTab({ event }) {
    const locationDetails = [
        { label: 'Address', value: event.location?.address },
        { label: 'City', value: event.location?.city },
        { label: 'State', value: event.location?.state },
        { label: 'Country', value: event.location?.country },
        { label: 'Postal Code', value: event.location?.pincode },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Location Details</h3>

            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {locationDetails.map((detail, index) => (
                    detail.value && (
                        <div
                            key={index}
                            className="bg-slate-50 p-3 rounded-lg hover:bg-slate-100 transition-all duration-200"
                        >
                            <div className="text-slate-500 text-xs font-medium mb-1">
                                {detail.label}
                            </div>
                            <p className="text-slate-800 font-semibold text-sm line-clamp-2">
                                {detail.value}
                            </p>
                        </div>
                    )
                ))}
            </div>

            {event.location?.googleMapsLink && (
                <div className="text-center">
                    <a
                        href={event.location.googleMapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 active:scale-95 shadow-sm text-sm"
                    >
                        <FaMapMarkedAlt className="text-base" />
                        <span>View on Google Maps</span>
                    </a>
                </div>
            )}
        </div>
    );
}

function SocialTab({ event }) {
    const socialLinks = [
        { platform: 'facebook', url: event.socialMediaLinks?.facebook, icon: FaFacebook, color: 'bg-blue-600' },
        { platform: 'instagram', url: event.socialMediaLinks?.instagram, icon: FaInstagram, color: 'bg-pink-600' },
        { platform: 'twitter', url: event.socialMediaLinks?.twitter, icon: FaTwitter, color: 'bg-blue-500' },
        { platform: 'linkedin', url: event.socialMediaLinks?.linkedin, icon: FaLinkedin, color: 'bg-blue-700' },
        { platform: 'youtube', url: event.socialMediaLinks?.youtube, icon: FaYoutube, color: 'bg-red-600' },
    ];

    const activeLinks = socialLinks.filter(link => link.url);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Social Media</h3>
            
            {activeLinks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeLinks.map((link, index) => {
                        const Icon = link.icon;
                        return (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 sm:p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all duration-200 group"
                            >
                                <div className={`w-10 h-10 ${link.color} rounded-lg flex items-center justify-center text-white`}>
                                    <Icon className="text-lg" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-slate-800 font-semibold text-sm capitalize mb-1">{link.platform}</div>
                                    <div className="text-slate-500 text-xs truncate">{link.url}</div>
                                </div>
                                <FaChevronRight className="text-slate-400 group-hover:text-slate-600 transition-colors duration-200 text-sm" />
                            </a>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-8">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FaShare className="text-slate-400 text-xl" />
                    </div>
                    <p className="text-slate-500 text-sm">No social media links available</p>
                </div>
            )}
        </div>
    );
}