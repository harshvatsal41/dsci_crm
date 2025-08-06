'use client';
import React, { useState } from 'react';
import { FiEdit2, FiTrash2, FiEye, FiExternalLink } from 'react-icons/fi';
import { formatDate } from '@/Component/UI/TableFormat';
import Modal from '@/Component/UI/Modal';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { UserPermissions } from '@/Component/UserPermission';

const SpecificCollaborationCard = ({ data, onDelete, setEdit }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  UserPermissions();
  const permissions = useSelector((state) => state.menu.permissions);
  
  // Safely extract the data array
  const safeData = Array.isArray(data) ? data : 
                  data?.data ? data.data : 
                  data?.collaborations ? data.collaborations : [];


  if (!safeData.length) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Collaborations Found</h3>
        <p className="text-gray-500">There are no collaborations to display at this time.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border  border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Weight
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {safeData.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {item.logoUrlPath ? (
                        <img
                          className="h-10 w-10 rounded-md object-cover border border-gray-200"
                          src={item.logoUrlPath}
                          alt={item.title || 'Company logo'}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2NjYyI+PHBhdGggZD0iTTEyIDJDNi40NzcgMiAyIDYuNDc3IDIgMTJzNC40NzcgMTAgMTAgMTAgMTAtNC40NzcgMTAtMTBTMTcuNTIzIDIgMTIgMnptMCAyYzQuNDE4IDAgOCAzLjU4MiA4IDhzLTMuNTgyIDgtOCA4LTgtMy41ODItOC04IDMuNTgyLTggOC04eiIvPjwvc3ZnPg==';
                          }}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {item.title?.charAt(0).toUpperCase() || '?'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{item.title || 'Untitled'}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{item.about || 'No description'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {item.subCategory?.title || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.contentWeight || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(item.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => setSelectedItem(item)}
                      className="text-gray-600 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 transition-colors"
                      title="View Details"
                      aria-label={`View details for ${item.title}`}
                    >
                      <FiEye size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (permissions?.colab?.includes("update")===true) {
                            setEdit({ value: true, data: item });
                        } else {
                            toast.error("You don't have permission to edit this collaboration");
                        }
                      }}
                      className="text-blue-600 hover:text-blue-900 p-2 rounded-md hover:bg-blue-50 transition-colors"
                      title="Edit"
                      aria-label={`Edit ${item.title}`}
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (permissions?.colab?.includes("delete")===true) {
                            if (window.confirm('Are you sure you want to delete this collaboration?')) {
                                handleDelete(e, item._id);
                            }
                        } else {
                            toast.error("You don't have permission to delete this collaboration");
                        }
                      }}
                      className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50 transition-colors"
                      title="Delete"
                      aria-label={`Delete ${item.title}`}
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for detailed view */}
      <Modal 
        isOpen={!!selectedItem} 
        onClose={() => setSelectedItem(null)} 
        title={selectedItem?.title || "Collaboration Details"}
      >
        {selectedItem && (
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              {selectedItem.logoUrlPath ? (
                <img
                  className="h-16 w-16 rounded-md object-cover border border-gray-200"
                  src={selectedItem.logoUrlPath}
                  alt={selectedItem.title || 'Company logo'}
                />
              ) : (
                <div className="h-16 w-16 rounded-md bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {selectedItem.title?.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selectedItem.title || 'Untitled'}</h3>
                <p className="text-sm text-gray-500">{selectedItem.subCategory?.title || 'N/A'} <span className="text-blue-500">Type: {selectedItem.subCategory?.type || 'N/A'}</span></p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800">About</h4>
                <p className="text-gray-600">{selectedItem.about || 'No description available'}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800">Description</h4>
                <p className="text-gray-600">{selectedItem.description || 'No description available'}</p>
              </div>
            </div>
            <div className="flex justify-between p-2">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800">Details</h4>
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="text-gray-500">Weight:</span> {selectedItem.contentWeight || 0}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Created:</span> {formatDate(selectedItem.createdAt)}
                  </p>
                  {selectedItem.websiteLink && (
                    <p className="text-sm">
                      <span className="text-gray-500">Website:</span>{' '}
                      <a 
                        href={selectedItem.websiteLink.startsWith('http') ? selectedItem.websiteLink : `https://${selectedItem.websiteLink}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline inline-flex items-center"
                      >
                        {selectedItem.websiteLink.length > 30 ? `${selectedItem.websiteLink.substring(0, 30)}...` : selectedItem.websiteLink}
                        {selectedItem.websiteLink.length > 30 ? <FiExternalLink className="ml-1" size={12} /> : null}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {selectedItem.socialMediaLinks?.length > 0 && (
                <div className="md:col-span-2 space-y-2">
                  <h4 className="font-semibold text-gray-800">Social Links</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.socialMediaLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.link.startsWith('http') ? link.link : `https://${link.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm hover:bg-gray-200 transition-colors"
                      >
                        {link.title}
                        {link.link.length > 30 ? <FiExternalLink className="ml-1" size={12} /> : null}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              </div>
          </div>
        )}    
      </Modal>
    </div>
  );

  function handleDelete(e, id) {
    e.stopPropagation();

    if (window.confirm('Are you sure you want to delete this collaboration?')) {
      onDelete(id);
    }
  }
};

export default SpecificCollaborationCard;