'use client';

import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Building, Tag, ChevronRight, X } from 'lucide-react';
import Modal from '@/Component/UI/Modal';

const SpecificAgendaBlogCard = ({data, onEdit, onDelete, type}) => {
  const [selectedAgenda, setSelectedAgenda] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  

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
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  const groupAgendasByDay = () => {
    const grouped = {};
    data?.data?.forEach(agenda => {
      if (!grouped[agenda.day]) {
        grouped[agenda.day] = [];
      }
      grouped[agenda.day].push(agenda);
    });
    return grouped;
  };

  const openAgendaDetails = (agenda) => {
    setSelectedAgenda(agenda);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedAgenda(null);
  };

  const groupedAgendas = groupAgendasByDay();

  return (
    <div className="max-w-6xl mx-auto p-3 bg-gray-50 rounded-xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Agenda</h1>
        <p className="text-gray-600">Complete schedule and event details</p>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedAgendas).map(([day, dayAgendas]) => (
          <div key={day} className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Day Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <Calendar className="h-6 w-6" />
                {day}
              </h2>
              <p className="text-blue-100 mt-1">
                {dayAgendas.length} {dayAgendas.length === 1 ? 'event' : 'events'} scheduled
              </p>
            </div>
            
            {/* Agenda Items */}
            <div className="divide-y divide-gray-200">
              {dayAgendas.map(agenda => (
                <AgendaItem 
                  key={agenda._id} 
                  agenda={agenda} 
                  onClick={() => openAgendaDetails(agenda)}
                  formatTime={formatTime}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed View Dialog */}
      {isDialogOpen && selectedAgenda && (
        <Modal isOpen={isDialogOpen} onClose={closeDialog} title={selectedAgenda.title} width="max-w-6xl" >
          
            
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
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
                      <Tag className="h-4 w-4 text-purple-600" />
                      <span className="font-medium">Type:</span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                        {selectedAgenda.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAgenda.category.map((cat, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
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
    </div>
  );
};

const AgendaItem = ({ agenda, onClick, formatTime, formatDate }) => {
  return (
    <div 
      className="p-6 hover:bg-gray-50 transition-colors cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 space-y-3">
          {/* Title and Time */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {agenda.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span className="font-medium">
                {formatTime(agenda.startTime)} - {formatTime(agenda.endTime)}
              </span>
            </div>
          </div>

          {/* Description */}
          {agenda.description && (
            <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
              {agenda.description}
            </p>
          )}

          {/* Tags and Categories */}
          <div className="flex flex-wrap gap-2">
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
              {agenda.type}
            </span>
            {agenda.category.map((cat, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                {cat}
              </span>
            ))}
          </div>

          {/* Session Count */}
          {agenda.session?.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{agenda.session.length} {agenda.session.length === 1 ? 'session' : 'sessions'}</span>
            </div>
          )}
        </div>

        {/* View Details Button */}
        <div className="flex items-center gap-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            View Details
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const SessionItem = ({ session }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="space-y-3">
        {/* Session Title */}
        {session.sessionTitle && (
          <h4 className="font-semibold text-gray-900 text-lg">{session.sessionTitle}</h4>
        )}
        
        {/* Session Description */}
        {session.sessionDescription && (
          <p className="text-gray-700">{session.sessionDescription}</p>
        )}
        
        {/* Location */}
        {session.sessionLocation && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="font-medium">Location:</span>
            <span>{session.sessionLocation}</span>
          </div>
        )}
        
        {/* Speakers */}
        {session.sessionSpeakers?.length > 0 && (
          <div>
            <h5 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Speakers:
            </h5>
            <div className="flex flex-wrap gap-2">
              {session.sessionSpeakers.map((speaker, index) => (
                <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {typeof speaker === 'string' ? speaker : speaker.name}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Collaborations */}
        {session.sessionCollaborations?.length > 0 && (
          <div>
            <h5 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
              <Building className="h-4 w-4" />
              Collaborations:
            </h5>
            <div className="space-y-2">
              {session.sessionCollaborations.map((collab, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                    {collab.head}
                  </span>
                  <span className="text-gray-700">
                    {typeof collab.company === 'string' ? collab.company : collab.company?.companyName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Instructions */}
        {session.sessionInstructions?.length > 0 && (
          <div>
            <h5 className="font-medium text-gray-800 mb-2">Instructions:</h5>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-4">
              {session.sessionInstructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Tags */}
        {session.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {session.tags.map((tag, index) => (
              <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
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