'use client';
import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiChevronLeft, FiChevronRight, FiEye, FiEyeOff } from 'react-icons/fi';
import { formatDate } from '@/Component/UI/TableFormat';
import Modal from '@/Component/UI/Modal'; 

const SubCollaborationCard = ({ data = [], onDelete, setEdit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : data.data.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < data.data.length - 1 ? prev + 1 : 0));
  };

  const toggleDetails = (category) => {
    setSelectedCategory(category);
    setShowDetails(!showDetails);
    setIsModalOpen(!isModalOpen);
  };

  const handleEdit = (e, category) => {
    e.stopPropagation();
    setEdit({ value: true, data: category });
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this category?')) {
      onDelete(id);
    }
  };

  return (
    <div className="relative">
      {/* Left Navigation Arrow */}
      <button 
        onClick={handlePrev}
        className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-100 transition-colors"
      >
        <FiChevronLeft size={20} />
      </button>
      
      {/* Right Navigation Arrow */}
      <button 
        onClick={handleNext}
        className="absolute -right-1 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10 hover:bg-gray-100 transition-colors"
      >
        <FiChevronRight size={20} />
      </button>

      {/* Cards Container */}
      <div className="py-4 px-2">
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {data?.data?.map((category) => (
            <div 
              key={category?._id}
              className="flex-shrink-0 w-64 bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 truncate">{category?.title}</h3>
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mt-1">
                      {category?.type}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => handleEdit(e, category)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition-colors"
                      title="Edit"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, category?._id)}
                      className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                    <button
                      onClick={() => toggleDetails(category)}
                      className="text-gray-600 hover:text-gray-800 p-1 rounded-full hover:bg-gray-50 transition-colors"
                      title={showDetails ? "Hide details" : "Show details"}
                    >
                      {showDetails && selectedCategory?._id === category?._id ? (
                        <FiEyeOff size={16} />
                      ) : (
                        <FiEye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-2 text-sm text-gray-600">
                  <p>Created: {formatDate(category?.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center space-x-2 mt-4">
        {data?.data?.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${currentIndex === index ? 'bg-blue-600' : 'bg-gray-300'}`}
          />
        ))}
      </div>

      {/* Modal for Full Details */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedCategory?.title || 'Category Details'}
      >
        {selectedCategory && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Type</p>
                <p className="text-sm">{selectedCategory?.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <span className={`text-xs px-2 py-1 rounded-full ${selectedCategory?.isDeleted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {selectedCategory?.isDeleted ? 'Deleted' : 'Active'}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created</p>
                <p className="text-sm">{formatDate(selectedCategory?.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Updated</p>
                <p className="text-sm">{formatDate(selectedCategory?.updatedAt)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Event ID</p>
              <p className="text-sm">{selectedCategory?.yeaslyEventId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Created By</p>
              <p className="text-sm">{selectedCategory?.createdBy}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SubCollaborationCard;