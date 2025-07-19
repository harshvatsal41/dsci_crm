'use client';
import React from 'react';
import { FiEdit2, FiTrash2, FiExternalLink, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useState, useMemo } from 'react';
import { formatDate } from '@/Component/UI/TableFormat';

const SpecificCollaborationTable = ({ data, onDelete, setEdit }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'contentWeight', direction: 'desc' });

  // Safely extract the data array from the data object
  const safeData = useMemo(() => {
    // Handle different data structures
    if (Array.isArray(data)) {
      return data;
    }
    if (data && Array.isArray(data.data)) {
      return data.data;
    }
    if (data && data.collaborations && Array.isArray(data.collaborations)) {
      return data.collaborations;
    }
    return [];
  }, [data]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Sort the data based on sort configuration
  const sortedData = useMemo(() => {
    if (!safeData.length) return [];

    return [...safeData].sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case 'title':
          aValue = a.title || '';
          bValue = b.title || '';
          break;
        case 'subCategory.title':
          aValue = a.subCategory?.title || '';
          bValue = b.subCategory?.title || '';
          break;
        case 'contentWeight':
          aValue = a.contentWeight || 0;
          bValue = b.contentWeight || 0;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [safeData, sortConfig]);

  const handleEdit = (e, collaboration) => {
    e.stopPropagation();
    setEdit({ value: true, data: collaboration });
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this collaboration?')) {
      onDelete(id);
    }
  };

  if (!sortedData.length) {
    return (
      <div className="font-sans">
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              {/* <FiUsers className="w-8 h-8 text-gray-400" /> */}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Collaborations Found</h3>
            <p className="text-gray-500">There are no collaborations to display.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans">
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center">
                  Title
                  {sortConfig.key === 'title' && (
                    <span className="ml-1 text-blue-600">
                      {sortConfig.direction === 'asc' ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('subCategory.title')}
              >
                <div className="flex items-center">
                  Category
                  {sortConfig.key === 'subCategory.title' && (
                    <span className="ml-1 text-blue-600">
                      {sortConfig.direction === 'asc' ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('contentWeight')}
              >
                <div className="flex items-center">
                  Weight
                  {sortConfig.key === 'contentWeight' && (
                    <span className="ml-1 text-blue-600">
                      {sortConfig.direction === 'asc' ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center">
                  Created
                  {sortConfig.key === 'createdAt' && (
                    <span className="ml-1 text-blue-600">
                      {sortConfig.direction === 'asc' ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((collaboration, index) => (
              <React.Fragment key={collaboration._id || collaboration.id || index}>
                <tr 
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => toggleRow(collaboration._id || collaboration.id || index)}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {collaboration.logoUrlPath ? (
                          <img
                            className="h-10 w-10 rounded-md object-cover border border-gray-200"
                            src={collaboration.logoUrlPath}
                            alt={collaboration.title || 'Logo'}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2NjYyI+PHBhdGggZD0iTTEyIDJDNi40NzcgMiAyIDYuNDc3IDIgMTJzNC40NzcgMTAgMTAgMTAgMTAtNC40NzcgMTAtMTBTMTcuNTIzIDIgMTIgMnptMCAyYzQuNDE4IDAgOCAzLjU4MiA4IDhzLTMuNTgyIDgtOCA4LTgtMy41ODItOC04IDMuNTgyLTggOC04eiIvPjwvc3ZnPg==';
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {collaboration.title ? collaboration.title.charAt(0).toUpperCase() : '?'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {collaboration.title || 'Untitled'}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {collaboration.about || 'No description'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {collaboration.subCategory?.title || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    <span className="font-medium">
                      {collaboration.contentWeight || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {collaboration.createdAt ? formatDate(collaboration.createdAt) : 'N/A'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-1">
                      <button
                        onClick={(e) => handleEdit(e, collaboration)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-md hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, collaboration._id || collaboration.id)}
                        className="text-red-600 hover:text-red-900 p-2 rounded-md hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRow === (collaboration._id || collaboration.id || index) && (
                  <tr className="bg-gray-50">
                    <td colSpan="5" className="px-4 py-4">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-sm">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-800 flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            Description
                          </h4>
                          <p className="text-gray-600 leading-relaxed">
                            {collaboration.description || collaboration.about || 'No description available'}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-800 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Social Links
                          </h4>
                          {collaboration.socialMediaLinks?.length > 0 ? (
                            <ul className="space-y-1">
                              {collaboration.socialMediaLinks.map((link, linkIndex) => (
                                <li key={linkIndex} className="flex items-start">
                                  <span className="text-gray-600 font-medium mr-2 min-w-0 flex-shrink-0">
                                    {link.title}:
                                  </span>
                                  <a 
                                    href={link.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 hover:underline flex items-center min-w-0 flex-1 break-all"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <span className="truncate">{link.link}</span>
                                    <FiExternalLink className="ml-1 flex-shrink-0" size={12} />
                                  </a>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-gray-500 italic">No social links available</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-800 flex items-center">
                            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                            Website
                          </h4>
                          {collaboration.websiteLink ? (
                            <a 
                              href={collaboration.websiteLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline flex items-center break-all"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className="truncate">Visit website</span>
                              <FiExternalLink className="ml-1 flex-shrink-0" size={12} />
                            </a>
                          ) : (
                            <p className="text-gray-500 italic">No website available</p>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpecificCollaborationTable;