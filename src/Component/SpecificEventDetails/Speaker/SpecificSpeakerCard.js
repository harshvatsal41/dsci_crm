'use client'
import { useState } from 'react';
import Image from 'next/image';
import Modal from '@/Component/UI/Modal';
import { Button } from '@/Component/UI/TableFormat';
import { FaTrash, FaLinkedin, FaTwitter, FaFacebook, FaGlobe, FaEnvelope, FaPhone, FaCalendarAlt, FaBuilding, FaUser, FaAward, FaBriefcase } from 'react-icons/fa';
import { SpeakerApi } from '@/utilities/ApiManager';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import { ConfirmDialog } from '@/Component/UI/TableFormat';
import { userPermissions } from '@/Component/UserPermission';

export default function SpecificSpeakerCard({ setEdit, data, onDelete }) {
  const dispatch = useDispatch();
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [speakerToDelete, setSpeakerToDelete] = useState(null);

  userPermissions();
  const permissions = useSelector((state) => state.menu.permissions);

  const openModal = (speaker) => {
    setSelectedSpeaker(speaker);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (speaker) => {
    if (permissions?.speaker?.includes("delete")===false){
        toast.error("You don't have permission to delete this speaker");
        return;
    }
    setSpeakerToDelete(speaker);
    setConfirmOpen(true);
  };

  const deleteSpeaker = async () => {
    if (permissions?.speaker?.includes("delete")===false){
        toast.error("You don't have permission to delete this speaker");
        return;
    }
    if (!speakerToDelete) return;
    
    dispatch(setLoading(true));
    try {
      const response = await SpeakerApi(null, 'DELETE', { Id: speakerToDelete._id });
      if (response.statusCode === 200 || response.statusCode === 203 || response.status === "success") {
        toast.success(response.message || 'Speaker deleted successfully');
        onDelete();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete speaker');
    } finally {
      dispatch(setLoading(false));
      setConfirmOpen(false);
      setSpeakerToDelete(null);
      closeModal();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSpeaker(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getSocialIcon = (platform) => {
    switch (platform) {
      case 'linkedin': return <FaLinkedin className="text-blue-600" />;
      case 'twitter': return <FaTwitter className="text-blue-400" />;
      case 'facebook': return <FaFacebook className="text-blue-800" />;
      case 'website': return <FaGlobe className="text-gray-600" />;
      default: return <FaGlobe className="text-gray-600" />;
    }
  };

  return (
    <div className="p-6">
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={deleteSpeaker}
        title="Delete Speaker?"
        description="Are you sure you want to delete this speaker? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmColor="danger"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data?.data?.map((speaker) => (
          <div 
            key={speaker._id}
            onClick={() => openModal(speaker)}
            className="group relative cursor-pointer"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative h-full bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="h-2 bg-blue-100"></div>
              <div className="p-5">
                <div className="flex items-start space-x-4">
                  {speaker.photoUrl ? (
                    <div className="flex-shrink-0 relative w-14 h-14 rounded-full overflow-hidden border-2 border-blue-200">
                      <Image
                        src={speaker.photoUrl}
                        alt={speaker.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-2xl">
                      🎤
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {speaker.title} {speaker.name}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium truncate">
                      {speaker.position}
                    </p>
                    <p className="text-gray-500 text-sm truncate">
                      {speaker.organization}
                    </p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {speaker.experience}+ years
                      </span>
                      {speaker.isActive && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
                  <span>{formatDate(speaker.createdAt)}</span>
                  {speaker.isDeleted && (
                    <span className="text-red-500">Deleted</span>
                  )}
                  <Button 
                    className='bg-red-600 text-white cursor-pointer hover:bg-red-700' 
                    icon={<FaTrash />} 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(speaker);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Speaker Detail Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        title={selectedSpeaker ? `${selectedSpeaker.title} ${selectedSpeaker.name}` : ''}
        subtitle="Speaker Details"
      >
        {selectedSpeaker && (
          <div className="space-y-4">
            {/* Header Section */}
            <div className="flex items-center space-x-4">
              {selectedSpeaker.photoUrl ? (
                <div className="flex-shrink-0 relative w-24 h-24 rounded-full overflow-hidden border-4 border-blue-200">
                  <Image
                    src={selectedSpeaker.photoUrl}
                    alt={selectedSpeaker.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex-shrink-0 w-24 h-24 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-4xl">
                  🎤
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedSpeaker.title} {selectedSpeaker.name}
                </h3>
                <p className="text-lg text-blue-600 font-medium">{selectedSpeaker.position}</p>
                <p className="text-gray-600">{selectedSpeaker.organization}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {selectedSpeaker.experience}+ years experience
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {selectedSpeaker.gender}
                  </span>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            {selectedSpeaker.bio && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Biography</h4>
                <p className="text-gray-800 leading-relaxed">{selectedSpeaker.bio}</p>
              </div>
            )}

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h4>
                <div className="space-y-2">
                  {selectedSpeaker.emailOfficial && (
                    <div className="flex items-center space-x-2">
                      <FaEnvelope className="text-gray-400" />
                      <span className="text-sm text-gray-800">{selectedSpeaker.emailOfficial}</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Official</span>
                    </div>
                  )}
                  {selectedSpeaker.emailPersonal && (
                    <div className="flex items-center space-x-2">
                      <FaEnvelope className="text-gray-400" />
                      <span className="text-sm text-gray-800">{selectedSpeaker.emailPersonal}</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Personal</span>
                    </div>
                  )}
                  {selectedSpeaker.phone && (
                    <div className="flex items-center space-x-2">
                      <FaPhone className="text-gray-400" />
                      <span className="text-sm text-gray-800">{selectedSpeaker.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Personal Information</h4>
                <div className="space-y-2">
                  {selectedSpeaker.dob && (
                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="text-gray-400" />
                      <span className="text-sm text-gray-800">
                        {formatDate(selectedSpeaker.dob)} (Age: {calculateAge(selectedSpeaker.dob)})
                      </span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <FaUser className="text-gray-400" />
                    <span className="text-sm text-gray-800">{selectedSpeaker.gender}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaBriefcase className="text-gray-400" />
                    <span className="text-sm text-gray-800">{selectedSpeaker.experience}+ years experience</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expertise */}
            {selectedSpeaker.expertise && selectedSpeaker.expertise.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Areas of Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSpeaker.expertise.map((skill, index) => (
                    <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Awards */}
            {selectedSpeaker.awards && selectedSpeaker.awards.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Awards & Recognition</h4>
                <div className="space-y-2">
                  {selectedSpeaker.awards.map((award, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <FaAward className="text-yellow-500" />
                      <span className="text-sm text-gray-800">{award}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links */}
            {selectedSpeaker.socialLinks && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Social Media</h4>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(selectedSpeaker.socialLinks).map(([platform, url]) => (
                    url && (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
                      >
                        {getSocialIcon(platform)}
                        <span className="text-sm font-medium capitalize">{platform}</span>
                      </a>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Event Information */}
            {selectedSpeaker.yeaslyEventId && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Event Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-800">
                    <strong>Event:</strong> {selectedSpeaker.yeaslyEventId.title} ({selectedSpeaker.yeaslyEventId.year})
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Sessions: {selectedSpeaker.sessionIds?.length || 0} | 
                    Events: {selectedSpeaker.eventIds?.length || 0}
                  </p>
                </div>
              </div>
            )}

            {/* Internal Note */}
            {selectedSpeaker.internalNote && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Internal Note</h4>
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <p className="text-sm text-gray-800">{selectedSpeaker.internalNote}</p>
                </div>
              </div>
            )}

            {/* Status & Metadata */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Status</h4>
                <div className="mt-1 flex items-center space-x-2">
                  {selectedSpeaker.isActive ? (
                    <span className="text-green-600 font-medium">Active</span>
                  ) : (
                    <span className="text-red-600 font-medium">Inactive</span>
                  )}
                  {selectedSpeaker.isDeleted && (
                    <span className="text-red-500 text-sm">(Deleted)</span>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Created</h4>
                <p className="mt-1 text-sm text-gray-800">
                  {formatDate(selectedSpeaker.createdAt)}
                </p>
                {selectedSpeaker.createdBy && (
                  <p className="text-xs text-gray-500">
                    by {selectedSpeaker.createdBy.email}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  closeModal();
                  if (permissions?.speaker?.includes("update")===false){
                      toast.error("You don't have permission to update this speaker");
                      return;
                  }
                  setEdit({value: true, data: selectedSpeaker});
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Speaker
              </button>
              {/* <button
                type="button"
                onClick={() => {
                  handleDeleteClick(selectedSpeaker);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete Speaker
              </button> */}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}