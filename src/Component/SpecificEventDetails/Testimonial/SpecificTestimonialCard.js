'use client'
import { useState } from 'react';
import Image from 'next/image';
import Modal from '@/Component/UI/Modal';
import { Button } from '@/Component/UI/TableFormat';
import { FaTrash, FaEdit, FaEnvelope, FaBuilding, FaCalendarAlt } from 'react-icons/fa';
import { TestimonialApi } from '@/utilities/ApiManager';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import { ConfirmDialog } from '@/Component/UI/TableFormat';
import { UserPermissions } from '@/Component/UserPermission';

export default function SpecificTestimonialCard({ setEdit, data, onDelete }) {
  const dispatch = useDispatch();
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);
  UserPermissions();
  const permissions = useSelector((state) => state.menu.permissions);

  const openModal = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (testimonial) => {
    if(permissions?.testimonial.includes('delete') === false){
        toast.error('You are not authorized to delete testimonial');
        return
    }
    setTestimonialToDelete(testimonial);
    setConfirmOpen(true);
  };

  const deleteTestimonial = async () => {
    if (!testimonialToDelete) return;
    
    dispatch(setLoading(true));
    try {
      const response = await TestimonialApi(null, 'DELETE', { Id: testimonialToDelete._id });
      if (response.statusCode === 200 || response.statusCode === 203 || response.status === "success") {
        toast.success(response.message || 'Testimonial deleted successfully');
        onDelete();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete testimonial');
    } finally {
      dispatch(setLoading(false));
      setConfirmOpen(false);
      setTestimonialToDelete(null);
      closeModal();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTestimonial(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6">
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={deleteTestimonial}
        title="Delete Testimonial?"
        description="Are you sure you want to delete this testimonial? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmColor="danger"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data?.map((testimonial) => (
          <div 
            key={testimonial._id}
            onClick={() => openModal(testimonial)}
            className="group relative cursor-pointer"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative h-full bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className={`h-2 ${testimonial.status === 'Active' ? 'bg-green-100' : 'bg-gray-200'}`}></div>
              <div className="p-5">
                <div className="flex items-start space-x-4">
                  {testimonial.imageUrlPath ? (
                    <div className="flex-shrink-0 relative w-14 h-14 rounded-full overflow-hidden border-2 border-purple-200">
                      <Image
                        src={testimonial.imageUrlPath}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-2xl">
                      💬
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-purple-600 font-medium truncate">
                      {testimonial.organization}
                    </p>
                    <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                      {testimonial.description}
                    </p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        testimonial.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {testimonial.status}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Weight: {testimonial.contentWeight}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
                  <span>{formatDate(testimonial.createdAt)}</span>
                  {testimonial.isDeleted && (
                    <span className="text-red-500">Deleted</span>
                  )}
                  <Button 
                    className='bg-red-600 text-white cursor-pointer hover:bg-red-700' 
                    icon={<FaTrash />} 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(testimonial);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Testimonial Detail Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        title={selectedTestimonial?.name || ''}
        subtitle="Testimonial Details"
      >
        {selectedTestimonial && (
          <div className="space-y-4">
            {/* Header Section */}
            <div className="flex items-center space-x-4">
              {selectedTestimonial.imageUrlPath ? (
                <div className="flex-shrink-0 relative w-24 h-24 rounded-full overflow-hidden border-4 border-purple-200">
                  <Image
                    src={selectedTestimonial.imageUrlPath}
                    alt={selectedTestimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex-shrink-0 w-24 h-24 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-4xl">
                  💬
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedTestimonial.name}
                </h3>
                <p className="text-lg text-purple-600 font-medium">{selectedTestimonial.organization}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    selectedTestimonial.status === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedTestimonial.status}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    Content Weight: {selectedTestimonial.contentWeight}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FaEnvelope className="text-gray-400" />
                    <span className="text-sm text-gray-800">{selectedTestimonial.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaBuilding className="text-gray-400" />
                    <span className="text-sm text-gray-800">{selectedTestimonial.organization}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Event Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <FaCalendarAlt className="text-gray-400" />
                    <span className="text-sm text-gray-800">
                      {formatDate(selectedTestimonial.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Description</h4>
              <p className="text-gray-800 leading-relaxed">{selectedTestimonial.description}</p>
            </div>

            {/* Body Content */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Testimonial Content</h4>
              <div 
                className="prose max-w-none text-gray-800 border border-gray-200 rounded-lg p-4"
                dangerouslySetInnerHTML={{ __html: selectedTestimonial.body }}
              />
            </div>

            {/* Status & Metadata */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Status</h4>
                <div className="mt-1 flex items-center space-x-2">
                  {selectedTestimonial.isDeleted ? (
                    <span className="text-red-600 font-medium">Deleted</span>
                  ) : (
                    <span className={`font-medium ${
                      selectedTestimonial.status === 'Active' 
                        ? 'text-green-600' 
                        : 'text-gray-600'
                    }`}>
                      {selectedTestimonial.status}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Created</h4>
                <p className="mt-1 text-sm text-gray-800">
                  {formatDate(selectedTestimonial.createdAt)}
                </p>
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
                  if(permissions?.testimonial.includes('update') === false){
                      toast.error('You are not authorized to update testimonial');
                      return
                  }
                  setEdit({value: true, data: selectedTestimonial});
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <FaEdit className="mr-2" /> Edit
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}