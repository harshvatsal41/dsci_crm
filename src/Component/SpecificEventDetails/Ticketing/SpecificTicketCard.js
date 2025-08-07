'use client'
import { useState } from 'react';
import Image from 'next/image';
import Modal from '@/Component/UI/Modal';
import { Button } from '@/Component/UI/TableFormat';
import { FaTrash, FaEdit, FaCalendarAlt, FaTicketAlt, FaLink, FaPercent, FaTag } from 'react-icons/fa';
import { TicketApi } from '@/utilities/ApiManager';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import { ConfirmDialog } from '@/Component/UI/TableFormat';
import { UserPermissions } from '@/Component/UserPermission';

export default function SpecificTicketCard({ setEdit, data, onDelete }) {
  const dispatch = useDispatch();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  UserPermissions();
  const permissions = useSelector((state) => state.menu.permissions);

  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (ticket) => {
    if(permissions?.ticket.includes('delete') === false){
        toast.error('You are not authorized to delete tickets');
        return 
    }
    setTicketToDelete(ticket);
    setConfirmOpen(true);
  };

  const deleteTicket = async () => {
    if (!ticketToDelete) return;
    
    dispatch(setLoading(true));
    try {
      const response = await TicketApi(null, 'DEL', { Id: ticketToDelete._id });
      if (response.statusCode === 200 || response.statusCode === 203 || response.status === "success") {
        toast.success(response.message || 'Ticket deleted successfully');
        onDelete();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete ticket');
    } finally {
      dispatch(setLoading(false));
      setConfirmOpen(false);
      setTicketToDelete(null);
      closeModal();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inactive' },
      soldOut: { color: 'bg-red-100 text-red-800', label: 'Sold Out' }
    };
    const statusInfo = statusMap[status] || statusMap.inactive;
    return (
      <span className={`text-xs ${statusInfo.color} px-2 py-1 rounded`}>
        {statusInfo.label}
      </span>
    );
  };

  if(!data?.data?.length){
    return <div className="p-6"><p>No ticket found</p></div>
  }

  return (
    <div className="p-6">
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={deleteTicket}
        title="Delete Ticket?"
        description="Are you sure you want to delete this ticket? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmColor="danger"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data?.map((ticket) => (
          <div 
            key={ticket._id}
            onClick={() => openModal(ticket)}
            className="group relative cursor-pointer"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative h-full bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">
                      {ticket.name}
                    </h3>
                    {ticket.subHeading && (
                      <p className="text-gray-500 text-sm mb-2">
                        {ticket.subHeading}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(ticket.price)}
                        </span>
                        {ticket.discountPercentage > 0 && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatCurrency(ticket.originalPrice)}
                          </span>
                        )}
                      </div>
                      {getStatusBadge(ticket.availableStatus)}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center">
                        <FaTicketAlt className="mr-1" /> {ticket.passType}
                      </span>
                      {ticket.venue && (
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {ticket.venue}
                        </span>
                      )}
                      {ticket.discountPercentage > 0 && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center">
                          <FaPercent className="mr-1" /> {ticket.discountPercentage}% off
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
                  <span>{formatDate(ticket.createdAt)}</span>
                  {ticket.isDeleted && (
                    <span className="text-red-500">Deleted</span>
                  )}
                </div>
              </div>
              <div className="absolute top-2 right-2 flex space-x-2">
                <Button 
                  variant="outline"
                  size="sm"
                  className="bg-white/90 hover:bg-white"
                  icon={<FaEdit />} 
                  onClick={(e) => {
                    e.stopPropagation();
                    if(permissions?.ticket.includes('update') === false){
                        toast.error('You are not authorized to update tickets');
                        return 
                    }
                    setEdit({value: true, data: ticket});
                  }}
                />
                <Button 
                  variant="danger"
                  size="sm"
                  className="bg-red/90 hover:bg-red"
                  icon={<FaTrash />} 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(ticket);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ticket Detail Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        title={selectedTicket?.name || ''}
        subtitle="Ticket Details"
        size="xl"
      >
        {selectedTicket && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {selectedTicket.name}
                  </h2>
                  {selectedTicket.subHeading && (
                    <p className="text-gray-600 mb-3">{selectedTicket.subHeading}</p>
                  )}
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl font-bold text-gray-900">
                      {formatCurrency(selectedTicket.price)}
                    </div>
                    {selectedTicket.discountPercentage > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-lg text-gray-500 line-through">
                          {formatCurrency(selectedTicket.originalPrice)}
                        </span>
                        <span className="text-green-600 font-medium">
                          {selectedTicket.discountPercentage}% OFF
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {getStatusBadge(selectedTicket.availableStatus)}
                  <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full h-fit">
                    {selectedTicket.passType}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-sm text-gray-600">
                  <FaCalendarAlt className="mr-2 text-gray-400" />
                  Created: {formatDate(selectedTicket.createdAt)}
                </div>
                {selectedTicket.updatedAt && (
                  <div className="flex items-center text-sm text-gray-600">
                    <FaCalendarAlt className="mr-2 text-gray-400" />
                    Updated: {formatDate(selectedTicket.updatedAt)}
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Ticket Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment Details</h3>
                  <div className="flex items-center text-sm text-gray-700">
                    <FaLink className="mr-2 text-gray-400" />
                    <a 
                      href={selectedTicket.paymentUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Payment Link
                    </a>
                  </div>
                </div>

                {selectedTicket.venue && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Venue</h3>
                    <p className="text-gray-700">{selectedTicket.venue}</p>
                  </div>
                )}

                {selectedTicket.validityPeriod?.startDate && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Validity Period</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-gray-500">Start Date</p>
                        <p className="text-gray-700">{formatDate(selectedTicket.validityPeriod.startDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">End Date</p>
                        <p className="text-gray-700">{formatDate(selectedTicket.validityPeriod.endDate)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTicket.applicableDate && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Applicable Date</h3>
                    <p className="text-gray-700">{formatDate(selectedTicket.applicableDate)}</p>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {selectedTicket.priceReference?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Price References</h3>
                    <div className="space-y-2">
                      {selectedTicket.priceReference.map((ref, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded">
                          <div className="flex justify-between">
                            <span className="font-medium">{formatCurrency(ref.price)}</span>
                            {ref.eligibility && (
                              <span className="text-sm text-gray-600">{ref.eligibility}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTicket.accessIncludes?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Access Includes</h3>
                    <ul className="space-y-2">
                      {selectedTicket.accessIncludes.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <span className="text-gray-700">
                            {item.label}
                            {item.isComplimentary && (
                              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                Complimentary
                              </span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={closeModal}
              >
                Close
              </Button>
              <Button
                variant="primary"
                icon={<FaEdit />}
                onClick={() => {
                  closeModal();
                  setEdit({value: true, data: selectedTicket});
                }}
              >
                Edit Ticket
              </Button>
              {/* <Button
                variant="danger"
                icon={<FaTrash />}
                onClick={() => {
                  handleDeleteClick(selectedTicket);
                }}
              >
                Delete Ticket
              </Button> */}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}