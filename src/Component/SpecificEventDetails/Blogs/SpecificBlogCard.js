'use client'
import { useState } from 'react';
import Image from 'next/image';
import Modal from '@/Component/UI/Modal';
import { Button } from '@/Component/UI/TableFormat';
import { FaTrash, FaEdit, FaCalendarAlt, FaUser, FaWeight } from 'react-icons/fa';
import { BlogApi } from '@/utilities/ApiManager';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/Redux/Reducer/menuSlice';
import { ConfirmDialog } from '@/Component/UI/TableFormat';

export default function SpecificBlogCard({ setEdit, data, onDelete }) {
  const dispatch = useDispatch();
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const openModal = (blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setConfirmOpen(true);
  };

  const deleteBlog = async () => {
    if (!blogToDelete) return;
    
    dispatch(setLoading(true));
    try {
      const response = await BlogApi(null, 'DEL', { Id: blogToDelete._id });
      if (response.statusCode === 200 || response.statusCode === 203 || response.status === "success") {
        toast.success(response.message || 'Blog deleted successfully');
        onDelete();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete blog');
    } finally {
      dispatch(setLoading(false));
      setConfirmOpen(false);
      setBlogToDelete(null);
      closeModal();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBlog(null);
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
        onConfirm={deleteBlog}
        title="Delete Blog Post?"
        description="Are you sure you want to delete this blog post? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmColor="danger"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.data?.map((blog) => (
          <div 
            key={blog._id}
            onClick={() => openModal(blog)}
            className="group relative cursor-pointer"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-0 group-hover:opacity-50 transition duration-300"></div>
            <div className="relative h-full bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
              {blog.image && (
                <div className="h-48 relative">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2">
                      {blog.body}
                    </p>
                    <div className="flex items-center mt-3 space-x-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Weight: {blog.contentWeight}
                      </span>
                      {blog.externalLink && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          External Link
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center text-xs text-gray-400">
                  <span>{formatDate(blog.createdAt)}</span>
                  {blog.isDeleted && (
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
                    setEdit({value: true, data: blog});
                  }}
                />
                <Button 
                  variant="danger"
                  size="sm"
                  className="bg-red/90  hover:bg-white"
                  icon={<FaTrash />} 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(blog);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Blog Detail Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal}
        title={selectedBlog?.title || ''}
        subtitle="Blog Post Details"
        size="xl"
      >
        {selectedBlog && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-6">
              {selectedBlog.image && (
                <div className="flex-shrink-0 w-full md:w-1/3 h-64 relative rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={selectedBlog.image}
                    alt={selectedBlog.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedBlog.title}
                </h2>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                    <FaWeight className="mr-1" /> Content Weight: {selectedBlog.contentWeight}
                  </span>
                  {selectedBlog.externalLink && (
                    <a 
                      href={selectedBlog.externalLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center hover:bg-green-200"
                    >
                       External Link
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <FaCalendarAlt className="mr-2 text-gray-400" />
                    Created: {formatDate(selectedBlog.createdAt)}
                  </div>
                  {selectedBlog.updatedAt && (
                    <div className="flex items-center text-sm text-gray-600">
                      <FaCalendarAlt className="mr-2 text-gray-400" />
                      Updated: {formatDate(selectedBlog.updatedAt)}
                    </div>
                  )}
                  {selectedBlog.createdBy && (
                    <div className="flex items-center text-sm text-gray-600">
                      <FaUser className="mr-2 text-gray-400" />
                      Author: {selectedBlog.createdBy.email || 'Unknown'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Body Content */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Body Content</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{selectedBlog.body}</p>
              </div>
            </div>

            {/* Main Content */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Main Content</h3>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line">{selectedBlog.content}</p>
              </div>
            </div>

            {/* External Link */}
            {selectedBlog.externalLink && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">External Link</h3>
                <a 
                  href={selectedBlog.externalLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                >
                  {selectedBlog.externalLink}
                </a>
              </div>
            )}

            {/* Status & Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Status</h4>
                <div className="mt-1 flex items-center space-x-2">
                  {selectedBlog.isDeleted ? (
                    <span className="text-red-600 font-medium">Deleted</span>
                  ) : (
                    <span className="text-green-600 font-medium">Active</span>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
                <p className="mt-1 text-sm text-gray-800">
                  {selectedBlog.updatedAt ? formatDate(selectedBlog.updatedAt) : 'Never'}
                </p>
                {selectedBlog.updatedBy && (
                  <p className="text-xs text-gray-500">
                    by {selectedBlog.updatedBy.email || 'Unknown'}
                  </p>
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
                  setEdit({value: true, data: selectedBlog});
                }}
              >
                Edit Blog
              </Button>
              <Button
                variant="danger"
                icon={<FaTrash />}
                onClick={() => {
                  handleDeleteClick(selectedBlog);
                }}
              >
                Delete Blog
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}