'use client'
import { useState } from 'react';
import Image from 'next/image';
import Modal from '../UI/Modal';
import { Button } from '@/Component/UI/TableFormat';
import { FaTrash } from 'react-icons/fa';
import { BroadFocusAreaApi, SpeakerApi } from '@/utilities/ApiManager';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';

export default function SpecificEventCard({ setEdit, data, type = 'focusArea', onDelete }) {
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Configuration for different card types
  const cardConfig = {
    focusArea: {
      title: 'Focus Area',
      emptyMessage: 'No focus area found',
      icon: '🌍',
      accentColor: 'bg-emerald-100 text-emerald-800'
    },
    speaker: {
      title: 'Speakers',
      emptyMessage: 'No speakers found',
      icon: '🎤',
      accentColor: 'bg-blue-100 text-blue-800'
    },
    agenda: {
        title: 'Agenda',
        emptyMessage: 'No agenda found',
        icon: '📅',
        accentColor: 'bg-gray-100 text-gray-800'
      },  
    sponsor: {
      title: 'Sponsors',
      emptyMessage: 'No sponsors found',
      icon: '🏢',
      accentColor: 'bg-purple-100 text-purple-800'
    },
    faq: {
        title: 'FAQ',
        emptyMessage: 'No FAQ found',
        icon: '❓',
        accentColor: 'bg-gray-100 text-gray-800'
      },
    testimonial: {
        title: 'Testimonials',
        emptyMessage: 'No testimonials found',
        icon: '💬',
        accentColor: 'bg-gray-100 text-gray-800'
      },
    navbar: {
      title: 'Navigation',
      emptyMessage: 'No navigation items found',
      icon: '🧭',
      accentColor: 'bg-amber-100 text-amber-800'
    },
    ticketing: {
        title: 'Ticketing',
        emptyMessage: 'No ticketing found',
        icon: '🎟️',
        accentColor: 'bg-gray-100 text-gray-800'
      },
    blogs: {
        title: 'Blogs',
        emptyMessage: 'No blogs found',
        icon: '📝',
        accentColor: 'bg-gray-100 text-gray-800'
      },
  
    default: {
      title: 'Event Items',
      emptyMessage: 'No items found',
      icon: '📅',
      accentColor: 'bg-gray-100 text-gray-800'
    }
  };

  const config = cardConfig[type] || cardConfig.default;

  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const deleteItem = async (item) => {
    dispatch(setLoading(true));
    closeModal();
    try {
      const response = await BroadFocusAreaApi(null, 'DELETE', { Id: item._id });
      if (response.statusCode === 200 || response.statusCode === 203 || response.status === "success") {
        toast.success(response.message || 'Item deleted successfully');
        onDelete();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete item');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data?.data?.map((item) => (
              <div 
                key={item._id}
                onClick={() => openModal(item)}
                className="group relative cursor-pointer"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative h-full bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <div className={`h-2 ${config.accentColor}`}></div>
                  <div className="p-5">
                    <div className="flex items-start space-x-4">
                      {item.imageUrlPath ? (
                        <div className="flex-shrink-0 relative w-14 h-14 rounded-lg overflow-hidden">
                          <Image
                            src={item.imageUrlPath}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className={`flex-shrink-0 w-14 h-14 rounded-lg ${config.accentColor} flex items-center justify-center text-2xl`}>
                          {config.icon}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      {item.isDeleted && (
                        <span className="text-red-500">Deleted</span>
                      )}
                    <Button className='bg-red-600 text-white cursor-pointer hover:bg-red-700' icon={<FaTrash />} onClick={() => deleteItem(item)}></Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

      {/* Detail Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        title={selectedItem?.name || ''}
        subtitle={type.charAt(0).toUpperCase() + type.slice(1)}
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              {selectedItem.imageUrlPath ? (
                <div className="flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden">
                  <Image
                    src={selectedItem.imageUrlPath}
                    alt={selectedItem.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className={`flex-shrink-0 w-20 h-20 rounded-lg ${config.accentColor} flex items-center justify-center text-4xl`}>
                  {config.icon}
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedItem.name}</h3>
                <p className="text-gray-500">{new Date(selectedItem.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Description</h4>
                <p className="mt-1 text-gray-800">{selectedItem.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <p className="mt-1">
                    {selectedItem.isDeleted ? (
                      <span className="text-red-500">Deleted</span>
                    ) : (
                      <span className="text-green-500">Active</span>
                    )}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Created</h4>
                  <p className="mt-1 text-gray-800">
                    {new Date(selectedItem.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  closeModal();
                  setEdit({value:true, data:selectedItem});
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}