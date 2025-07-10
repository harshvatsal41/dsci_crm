'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { EventApi, BroadFocusAreaApi } from '@/utilities/ApiManager';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import DashboardLoading from '@/app/administration/dashboard/loading';
import { formatDate } from '@/Component/UI/TableFormat';
import { FaInfoCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
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
  FaBookmark
} from 'react-icons/fa';

export default function SpecificEventCard() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [broadFocusArea, setBroadFocusArea] = useState(null);
    const [showFocusArea, setShowFocusArea] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.menu.loading);

    const toggleFocusArea = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setShowFocusArea(!showFocusArea);
            setIsAnimating(false);
        }, 150);
    };

    const fetchEvent = async () => {
        try {
            dispatch(setLoading(true));
            const [eventRes, broadFocusAreaRes] = await Promise.all([
                EventApi(null, "GET", { id }),
                BroadFocusAreaApi(null, "GET", { id })
            ]);
            
            if (eventRes.statusCode === 200) {
                setEvent(eventRes.data);
            }
            
            if (broadFocusAreaRes.statusCode === 200) {
                setBroadFocusArea(broadFocusAreaRes.data);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (id) fetchEvent();
    }, [id]);

    if (isLoading) {
        return <DashboardLoading />;
    }

    if (!event) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                        <FaInfoCircle className="text-blue-500 text-2xl" />
                    </div>
                    <p className="text-slate-600 text-lg">Event not found</p>
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur-md bg-white/90">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={toggleFocusArea}
                                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-all duration-200 hover:scale-105"
                            >
                                <FaInfoCircle className="text-slate-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800 animate-fade-in">
                                    {event.title}
                                </h1>
                                <p className="text-slate-500 text-sm mt-1">
                                    Event #{event.id} • {event.year}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 hover:scale-105">
                                <FaBookmark className="text-sm" />
                                <span className="hidden sm:inline">Save</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all duration-200 hover:scale-105">
                                <FaEdit className="text-sm" />
                                <span className="hidden sm:inline">Edit</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="flex gap-8">
                    {/* Focus Area Sidebar */}
                    {broadFocusArea && (
                        <div className={`fixed lg:relative z-30 lg:z-0 h-full w-80 bg-white shadow-xl rounded-2xl transition-all duration-300 ease-out transform
                            ${showFocusArea ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:sticky lg:top-24 lg:h-fit ${isAnimating ? 'scale-95' : 'scale-100'}`}>
                            
                            <div className="p-6 border-b border-slate-100">
                                <button 
                                    onClick={toggleFocusArea}
                                    className="lg:hidden absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition-all duration-200"
                                >
                                    <FaChevronLeft className="text-slate-500" />
                                </button>
                                
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <FaInfoCircle className="text-blue-600" />
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-800">Focus Area</h2>
                                </div>
                                
                                {broadFocusArea.imageUrlPath && (
                                    <div className="mb-4 overflow-hidden rounded-xl">
                                        <img 
                                            src={broadFocusArea.imageUrlPath} 
                                            alt={broadFocusArea.name}
                                            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                )}
                                
                                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                                    {broadFocusArea.name}
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                    {broadFocusArea.description}
                                </p>
                            </div>
                            
                            <div className="p-6 space-y-4">
                                <div className="bg-slate-50 p-4 rounded-xl">
                                    <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">
                                        <FaClock />
                                        <span>Created</span>
                                    </div>
                                    <p className="text-slate-800 font-medium">
                                        {new Date(broadFocusArea.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                
                                {broadFocusArea.isDeleted && (
                                    <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                                        <div className="flex items-center gap-2 text-red-600 text-xs mb-2">
                                            <FaTag />
                                            <span>Status</span>
                                        </div>
                                        <p className="text-red-800 font-medium">
                                            Deleted {broadFocusArea.deletedAt ? 
                                                new Date(broadFocusArea.deletedAt).toLocaleDateString() : 
                                                ''}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Event Hero Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8 hover:shadow-md transition-all duration-300">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                            <FaCalendarAlt className="text-xl" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-bold mb-2">{event.title}</h2>
                                            <p className="text-blue-100">Edition {event.edition} • {event.year}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-blue-100 text-sm">Duration</div>
                                        <div className="text-xl font-semibold">
                                            {Math.ceil((new Date(event.dates.end) - new Date(event.dates.start)) / (1000 * 60 * 60 * 24))} days
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                        <div className="flex items-center gap-2 text-blue-100 mb-2">
                                            <FaCalendarAlt />
                                            <span className="text-sm">Start Date</span>
                                        </div>
                                        <p className="text-lg font-semibold">
                                            {formatDate(new Date(event.dates.start), 'MMM dd, yyyy')}
                                        </p>
                                    </div>
                                    
                                    <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                        <div className="flex items-center gap-2 text-blue-100 mb-2">
                                            <FaMapMarkerAlt />
                                            <span className="text-sm">Location</span>
                                        </div>
                                        <p className="text-lg font-semibold">
                                            {event.location?.city}, {event.location?.country}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-8">
                            <div className="flex overflow-x-auto scrollbar-hide">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => !tab.disabled && setActiveTab(tab.id)}
                                            disabled={tab.disabled}
                                            className={`flex items-center gap-3 px-6 py-4 font-medium transition-all duration-200 border-b-2 whitespace-nowrap ${
                                                activeTab === tab.id
                                                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                                                    : tab.disabled
                                                    ? 'border-transparent text-slate-400 cursor-not-allowed'
                                                    : 'border-transparent text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            <Icon className="text-lg" />
                                            <span>{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="space-y-8">
                            {activeTab === 'overview' && <OverviewTab event={event} />}
                            {activeTab === 'details' && <DetailsTab event={event} />}
                            {activeTab === 'location' && <LocationTab event={event} />}
                            {activeTab === 'social' && <SocialTab event={event} />}
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx global>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }
                
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                
                .glass-effect {
                    backdrop-filter: blur(10px);
                    background: rgba(255, 255, 255, 0.9);
                }
            `}</style>
        </div>
    );
}

// Tab Components
function OverviewTab({ event }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-all duration-300">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">About the Event</h3>
            <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed text-lg">
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
        { label: 'Start Date', value: formatDate(new Date(event.dates.start), 'MMM dd, yyyy'), icon: FaCalendarAlt },
        { label: 'End Date', value: formatDate(new Date(event.dates.end), 'MMM dd, yyyy'), icon: FaCalendarAlt },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Event Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {details.map((detail, index) => {
                        const Icon = detail.icon;
                        return (
                            <div key={index} className="bg-slate-50 p-6 rounded-xl hover:bg-slate-100 transition-all duration-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <Icon className="text-blue-600" />
                                    <span className="text-slate-500 text-sm font-medium">{detail.label}</span>
                                </div>
                                <p className="text-slate-800 font-semibold text-lg">{detail.value}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {event.websiteURL && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                    <h3 className="text-2xl font-bold text-slate-800 mb-6">Website</h3>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-3 mb-3">
                            <FaGlobe className="text-blue-600 text-xl" />
                            <span className="text-slate-700 font-medium">Official Website</span>
                        </div>
                        <a
                            href={event.websiteURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 font-medium break-all hover:underline transition-all duration-200"
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
        { label: 'Pincode', value: event.location?.pincode },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Location Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {locationDetails.map((detail, index) => (
                    detail.value && (
                        <div key={index} className="bg-slate-50 p-6 rounded-xl hover:bg-slate-100 transition-all duration-200">
                            <div className="text-slate-500 text-sm font-medium mb-2">{detail.label}</div>
                            <p className="text-slate-800 font-semibold">{detail.value}</p>
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
                        className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:scale-105 shadow-lg"
                    >
                        <FaMapMarkedAlt className="text-xl" />
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Social Media</h3>
            
            {activeLinks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeLinks.map((link, index) => {
                        const Icon = link.icon;
                        return (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all duration-200 hover:scale-105 group"
                            >
                                <div className={`w-12 h-12 ${link.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-200`}>
                                    <Icon className="text-xl" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-slate-800 font-semibold capitalize mb-1">{link.platform}</div>
                                    <div className="text-slate-500 text-sm truncate">{link.url}</div>
                                </div>
                                <FaChevronRight className="text-slate-400 group-hover:text-slate-600 transition-colors duration-200" />
                            </a>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaShare className="text-slate-400 text-2xl" />
                    </div>
                    <p className="text-slate-500">No social media links available</p>
                </div>
            )}
        </div>
    );
}