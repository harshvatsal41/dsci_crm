'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { EventApi, BroadFocusAreaApi } from '@/utilities/ApiManager';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import DashboardLoading from '@/app/administration/dashboard/loading';
import { formatDate } from '@/Component/UI/TableFormat';
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
  FaMapMarkedAlt
} from 'react-icons/fa';

export default function SpecificEventCard() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [broadFocusArea, setBroadFocusArea] = useState(null);
    const dispatch = useDispatch();
    const isLoading = useSelector((state) => state.menu.loading);

    const fetchEvent = async () => {
        try {
            dispatch(setLoading(true));
            const [eventRes, broadFocusAreaRes] = await Promise.all([
                EventApi(null, "Get", { id }),
                BroadFocusAreaApi(null, "Get", { id })
            ]);
            if (eventRes.statusCode===200){
                alert("hi")
                const event = await eventRes.json();
                setEvent(event.data);
            }
            if (broadFocusAreaRes.statusCode===200){
                const broadFocusArea = await broadFocusAreaRes.json();
                setBroadFocusArea(broadFocusArea.data);
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
            <div className="flex items-center justify-center h-screen">
                <p className="text-blue-500">Event not found</p>
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

    return (
        <div className="h-screen overflow-hidden bg-gradient-to-br  text-blue-900 font-sans">
            {/* Main Content */}
            <div className="container mx-auto px-4 h-full flex flex-col">
                <div className="flex flex-col lg:flex-row gap-6 h-full overflow-y-auto custom-scrollbar py-1">
                    {/* Left Column - Basic Info */}
                    <div className="lg:w-2/3 flex flex-col h-full">
                        {/* Title and Dates */}
                        <div className="mb-6 bg-white rounded-xl p-6 shadow-sm">
                            <h1 className="text-3xl font-bold mb-2 text-blue-800">{event.title}</h1>
                            <div className="flex items-center gap-4 text-blue-600">
                                <div className="flex items-center gap-2">
                                    <FaCalendarAlt className="text-blue-500" />
                                    <span className="text-sm">
                                        {formatDate(new Date(event.dates.start), 'MMM dd, yyyy')} - 
                                        {formatDate(new Date(event.dates.end), 'MMM dd, yyyy')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-blue-500" />
                                    <span className="text-sm">{event.location?.city}, {event.location?.country}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6 flex-row overflow-y-auto custom-scrollbar bg-white rounded-xl p-6 shadow-sm">
                            <h2 className="text-xl font-semibold mb-4 text-blue-700">About the Event</h2>
                            <p className="text-blue-800 leading-relaxed">
                                {event.description || 'No description available.'}
                            </p>

                            {/* Social Media Links - Moved here */}
                            {hasSocialLinks && (
                                <div className="mt-8">
                                    <h2 className="text-xl font-semibold mb-4 text-blue-700">Connect With Us</h2>
                                    <div className="space-y-3 w-[400px]">
                                        {event.socialMediaLinks?.facebook && (
                                            <SocialLinkItem
                                                url={event.socialMediaLinks?.facebook}
                                                platform="facebook"
                                                icon={<FaFacebook className="text-blue-600" />}
                                            />
                                        )}
                                        {event.socialMediaLinks?.instagram && (
                                            <SocialLinkItem
                                                url={event.socialMediaLinks?.instagram}
                                                platform="instagram"
                                                icon={<FaInstagram className="text-blue-600" />}
                                            />
                                        )}
                                        {event.socialMediaLinks?.twitter && (
                                            <SocialLinkItem
                                                url={event.socialMediaLinks?.twitter}
                                                platform="twitter"
                                                icon={<FaTwitter className="text-blue-600" />}
                                            />
                                        )}
                                        {event.socialMediaLinks?.linkedin && (
                                            <SocialLinkItem
                                                url={event.socialMediaLinks?.linkedin}
                                                platform="linkedin"
                                                icon={<FaLinkedin className="text-blue-600" />}
                                            />
                                        )}
                                        {event.socialMediaLinks?.youtube && (
                                            <SocialLinkItem
                                                url={event.socialMediaLinks?.youtube}
                                                platform="youtube"
                                                icon={<FaYoutube className="text-blue-600" />}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Sidebar with Details */}
                    <div className="lg:w-1/3 h-full">
                        <div className="bg-white rounded-xl p-4 shadow-lg  overflow-y-auto custom-scrollbar">
                            {/* Event Details */}
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-3 text-blue-700 border-b pb-2 border-blue-100">Event Details</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                                        <span className="flex items-center gap-2 text-blue-600">
                                            <FaCalendarAlt />
                                            Year
                                        </span>
                                        <span className="font-medium">{event?.year}</span>
                                    </div>
                                    <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                                        <span className="flex items-center gap-2 text-blue-600">
                                            <FaHashtag />
                                            Edition
                                        </span>
                                        <span className="font-medium">{event?.edition}</span>
                                    </div>
                                    {event?.websiteURL && (
                                        <div className="bg-blue-50 p-3 rounded-lg">
                                            <div className="flex items-center gap-2 text-blue-600 mb-1">
                                                <FaLink />
                                                <span>Website</span>
                                            </div>
                                            <a
                                                href={event?.websiteURL}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-700 hover:text-blue-500 text-sm break-all"
                                            >
                                                {event?.websiteURL}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Location Details */}
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-3 text-blue-700 border-b pb-2 border-blue-100">Location</h2>
                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div className="bg-blue-50 p-3 rounded-lg col-span-2">
                                        <div className="flex items-center gap-2 text-blue-600 mb-1">
                                            <FaMapMarkerAlt />
                                            <span>Address</span>
                                        </div>
                                        <p className="text-blue-800 text-sm">{event?.location?.address}</p>
                                    </div>
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <div className="text-blue-600 text-xs mb-1">City</div>
                                        <p className="text-blue-800 text-sm">{event?.location?.city}</p>
                                    </div>
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <div className="text-blue-600 text-xs mb-1">State</div>
                                        <p className="text-blue-800 text-sm">{event?.location?.state}</p>
                                    </div>
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <div className="text-blue-600 text-xs mb-1">Country</div>
                                        <p className="text-blue-800 text-sm">{event?.location?.country}</p>
                                    </div>
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <div className="text-blue-600 text-xs mb-1">Pincode</div>
                                        <p className="text-blue-800 text-sm">{event?.location?.pincode}</p>
                                    </div>
                                </div>
                                {event?.location?.googleMapsLink && (
                                    <a
                                        href={event?.location?.googleMapsLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors w-full"
                                    >
                                        <FaMapMarkedAlt />
                                        <span>View on Google Maps</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom scrollbar styling */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(59, 130, 246, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(59, 130, 246, 0.3);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(59, 130, 246, 0.5);
                }
            `}</style>
        </div>
    );
}

function SocialLinkItem({ url, platform, icon }) {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
            <span className="text-xl text-blue-600">
                {icon}
            </span>
            <span className="text-blue-700 text-sm">{url}</span>
        </a>
    );
}