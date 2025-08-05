'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Building, Tag, ChevronRight, X, Edit, Trash } from 'lucide-react';
import Modal from '@/Component/UI/Modal';
import AgendaForm from './AgendaForm'; // Import your AgendaForm component

const SpecificAgendaBlogCard = ({ agenda, onDelete, onEdit }) => {
  const [selectedAgenda, setSelectedAgenda] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All Days');
  const agendaData = agenda?.data || [];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${dayName}, ${monthName} ${day}, ${year}`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  const formatTimeRange = (startTime, endTime) => {
    if (!startTime || !endTime) return '';
    if (startTime === endTime) return `All day`;

    const start = formatTime(startTime);
    const end = formatTime(endTime);

    if (start.slice(-2) === end.slice(-2)) {
      return `${start.slice(0, -3)} - ${end}`;
    }

    return `${start} - ${end}`;
  };

  const openAgendaDetails = (agenda) => {
    setSelectedAgenda(agenda);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedAgenda(null);
  };

  const openEditModal = () => {
    setIsDialogOpen(false);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleEditSuccess = () => {
    closeEditModal();
    onEdit(); // Notify parent that edit was successful
  };

  const handleDelete = () => {
    if (selectedAgenda && selectedAgenda._id) {
      onDelete(selectedAgenda._id);
      closeDialog();
    }
  };

  // Get unique days and categories for filtering
  const getDays = () => {
    const days = [...new Set(agendaData.map(item => item.day) || [])];
    return days.sort();
  };

  const getCategories = () => {
    const categories = new Set();
    agendaData.forEach(item => {
      if (item.category && Array.isArray(item.category)) {
        item.category.forEach(cat => categories.add(cat));
      }
    });
    return Array.from(categories).sort();
  };

  // Filter data based on active filter
  const getFilteredData = () => {
    if (!agendaData || agendaData.length === 0) return [];

    if (activeFilter === 'All Days') {
      return agendaData;
    } else if (getDays().includes(activeFilter)) {
      return agendaData.filter(item => item.day === activeFilter);
    } else {
      // Check if activeFilter is a category
      const allCategories = getCategories();
      if (allCategories.includes(activeFilter)) {
        return agendaData.filter(item =>
          item.category && item.category.includes(activeFilter)
        );
      }
    }
    return agendaData;
  };

  const days = getDays();
  const categories = getCategories();
  const filteredData = getFilteredData();

  return (
    <div className="mx-auto p-6 ">
      <div className="mb-4">
        <div className="flex flex-wrap gap-3 mb-4 max-h-32 overflow-y-auto py-2 px-1">
          <button
            onClick={() => setActiveFilter('All Days')}
            className={`px-3 py-1 rounded-full font-medium transition-all ${activeFilter === 'All Days'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
              }`}
          >
            All Days
          </button>
          {days.map(day => {
            const dayAgenda = agendaData.find(a => a.day === day);
            return (
              <button
                key={day}
                onClick={() => setActiveFilter(day)}
                className={`px-3 py-1 rounded-full font-medium transition-all ${activeFilter === day
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white text-blue-600 border border-blue-200 hover:bg-blue-50'
                  }`}
              >
                {day} - {dayAgenda?.date ? formatDate(dayAgenda.date).split(', ')[1] : ''}
              </button>
            );
          })}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeFilter === category
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Agenda List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {filteredData.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No events found for the selected filter</p>
          </div>
        ) : (
          <div 
            className={`divide-y divide-gray-100 ${filteredData.length > 5 ? 'max-h-[750px] overflow-y-auto' : ''}`}
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#9ca3af #f3f4f6',
              msOverflowStyle: 'none'
            }}
          >
            {filteredData.map(item => (
              <AgendaListItem
                key={item._id}
                agenda={item}
                onClick={() => openAgendaDetails(item)}
                formatTimeRange={formatTimeRange}
                onEdit={() => {
                  setSelectedAgenda(item);
                  setIsEditModalOpen(true);
                }}
                onDelete={() => onDelete(item._id)}
              />
            ))}
          </div>
        )}
      </div>


      {/* Detailed View Dialog */}
      {isDialogOpen && selectedAgenda && (
        <Modal isOpen={isDialogOpen} onClose={closeDialog} title={selectedAgenda.title} width="max-w-6xl" >
          <div className="absolute top-4 right-14 flex gap-2">
            <button 
              onClick={openEditModal}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors"
              title="Edit Agenda"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button 
              onClick={handleDelete}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-red-600 transition-colors"
              title="Delete Agenda"
            >
              <Trash className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 px-6">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatTime(selectedAgenda.startTime)} - {formatTime(selectedAgenda.endTime)}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(selectedAgenda.date)}
            </span>
          </div>

          {/* Dialog Content */}
          <div className="p-6 space-y-6">
            {/* Event Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Event Details</h3>
                {selectedAgenda.description && (
                  <p className="text-gray-700 mb-4">{selectedAgenda.description}</p>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Type:</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {selectedAgenda.type}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedAgenda.category.map((cat, index) => (
                    <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sessions */}
            {selectedAgenda.session?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Sessions ({selectedAgenda.session.length})
                </h3>
                <div className="space-y-4">
                  {selectedAgenda.session.map((session, index) => (
                    <SessionItem key={index} session={session} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
      
      {/* Edit Agenda Modal */}
      {isEditModalOpen && selectedAgenda && (
        <Modal isOpen={isEditModalOpen} onClose={closeEditModal} title={`Edit ${selectedAgenda.title}`} width="max-w-4xl">
          <AgendaForm
            eventId={selectedAgenda.yeaslyEventId}
            agendaData={selectedAgenda}
            onSuccess={handleEditSuccess}
            onClose={closeEditModal}
          />
        </Modal>
      )}
    </div>
  );
};

const AgendaListItem = ({ agenda, onClick, formatTimeRange, onEdit, onDelete }) => {
  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit();
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      className="p-6 hover:bg-gray-50 transition-all duration-200 cursor-pointer group border-l-4 border-transparent hover:border-blue-500 relative"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        {/* Time Column */}
        <div className="flex-shrink-0 text-center">
          <div className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg font-medium text-sm">
            {formatTimeRange(agenda.startTime, agenda.endTime)}
          </div>
        </div>

        {/* Content Column */}
        <div className="flex-1 px-3">
          <div className="space-y-1">
            {/* Title and Location */}
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                {agenda.title}
              </h3>
              {agenda.session?.[0]?.sessionLocation && (
                <div className="flex items-center gap-1 text-sm text-blue-600">
                  <MapPin className="h-4 w-4" />
                  {agenda.session[0].sessionLocation}
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                  {agenda.type}
                </span>
                {agenda.category.slice(0, 2).map((cat, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {cat}
                  </span>
                ))}
                {agenda.category.length > 2 && (
                  <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs">
                    +{agenda.category.length - 2} more
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            {agenda.description && (
              <p className="text-gray-600 text-sm leading-relaxed">
                {agenda.description}
              </p>
            )}

            {/* Session Info */}
            {agenda.session?.[0] && (
              <div className="space-y-2">
                {agenda.session[0].sessionTitle && (
                  <p className="text-sm font-medium text-gray-800">
                    {agenda.session[0].sessionTitle}
                  </p>
                )}

                {/* Speakers */}
                {agenda.session[0].sessionSpeakers?.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {agenda.session[0].sessionSpeakers.length} speakers
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Column */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handleEditClick}
            className="p-1.5 rounded-full text-gray-500 hover:bg-blue-100 hover:text-blue-600 transition-colors"
            title="Edit Agenda"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={handleDeleteClick}
            className="p-1.5 rounded-full text-gray-500 hover:bg-red-100 hover:text-red-600 transition-colors"
            title="Delete Agenda"
          >
            <Trash className="h-4 w-4" />
          </button>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
        </div>
      </div>
    </div>
  );
};

const SessionItem = ({ session }) => {
  return (
    <div className="border border-blue-100 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-all">
      <div className="space-y-4">
        {/* Session Header */}
        <div className="space-y-2">
          {session.sessionTitle && (
            <h4 className="text-lg font-semibold text-blue-800">{session.sessionTitle}</h4>
          )}

          {session.sessionDescription && (
            <p className="text-gray-600 text-sm">{session.sessionDescription}</p>
          )}
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Location */}
          {session.sessionLocation && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-gray-500">Location</p>
                <p className="text-sm text-gray-800">{session.sessionLocation}</p>
              </div>
            </div>
          )}

          {/* Speakers */}
          {session.sessionSpeakers?.length > 0 && (
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-gray-500">Speakers</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {session.sessionSpeakers.map((speaker, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs"
                    >
                      {typeof speaker === 'string' ? speaker : speaker.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Collaborations */}
          {session.sessionCollaborations?.length > 0 && (
            <div className="flex items-start gap-2">
              <Building className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-gray-500">Collaborations</p>
                <div className="space-y-1 mt-1">
                  {session.sessionCollaborations.map((collab, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">
                        {collab.head}
                      </span>
                      <span className="text-xs text-gray-700">
                        {typeof collab.company === 'string' ? collab.company : collab.company?.companyName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          {session.sessionInstructions?.length > 0 && (
            <div className="flex items-start gap-2">
              <svg className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-xs font-medium text-gray-500">Instructions</p>
                <ul className="list-disc list-inside text-xs text-gray-700 space-y-1 mt-1">
                  {session.sessionInstructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {session.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            {session.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecificAgendaBlogCard;