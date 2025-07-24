'use client'
import { useState, useEffect } from 'react';
import { 
  FiMenu, 
  FiX, 
  FiChevronDown,
  FiChevronRight, 
  FiGrid, 
  FiImage,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiUsers,
  FiTarget,
  FiFileText,
  FiBarChart2,
  FiMessageSquare,
  FiRotateCcw,
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectFilteredMenu } from '@/Redux/Reducer/menuSlice';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();
  const { Id } = useParams();
  // Get filtered menu items based on user role from Redux
  const menuItems = useSelector(selectFilteredMenu);
  
  // Check for mobile screen size
  useEffect(() => {
    setHasMounted(true);
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!hasMounted) {
    return null;
  }

  const toggleExpand = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleNavigation = (item) => {
    // Define the base paths for each menu item
    const basePaths = {
      'Dashboard': `/administration/dashboard/specificEventCard/${Id}`,
      'Focus Area': `/administration/dashboard/specificEventCard/${Id}/specificEventArea/focusArea`,
      'Speakers': `/administration/dashboard/specificEventCard/${Id}/specificEventArea/speaker`,
      'Agenda': `/administration/dashboard/specificEventCard/${Id}/specificEventArea/agenda`,
      'Sponser': `/administration/dashboard/specificEventCard/${Id}/specificEventArea/sponser`,
      'Collaboration': `/administration/dashboard/specificEventCard/${Id}/specificEventArea/collaboration`,
      'FAQ': `/administration/dashboard/specificEventCard/${Id}/specificEventArea/faq`,
      'Testimonial': `/administration/dashboard/specificEventCard/${Id}/specificEventArea/testimonial`,
      'Navbar': `/administration/dashboard/specificEventCard/${Id}/specificEventArea/navbar`,
      'Ticketing': `/administration/dashboard/specificEventCard/${Id}/specificEventArea/ticketing`,
      'Blogs': `/administration/dashboard/specificEventCard/${Id}/specificEventArea/blogs`
    };

    const path = basePaths[item.title] || item.path;
    
    if (path) {
      router.push(path);
      if (isMobile) {
        setIsOpen(false);
      }
    }
  };

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'dashboard': return <FiGrid className="w-5 h-5" />;
      case 'event': return <FiCalendar className="w-5 h-5" />;
      case 'users': return <FiUsers className="w-5 h-5" />;
      case 'target': return <FiTarget className="w-5 h-5" />;
      case 'file-text': return <FiFileText className="w-5 h-5" />;
      case 'assessment': return <FiBarChart2 className="w-5 h-5" />;
      case 'message-square': return <FiMessageSquare className="w-5 h-5" />;
      case 'menu': return <FiMenu className="w-5 h-5" />;
      case 'ticket': return <FiRotateCcw className="w-5 h-5" />;
      case 'image': return <FiImage className="w-5 h-5" />;
      case 'blogs': return <FiImage className="w-5 h-5" />;
      default: return <FiGrid className="w-5 h-5" />;
    }
  };

  const renderMenuItems = (items, level = 0) => {
    return items.map((item) => (
      <div key={item.id} className={`${level > 0 ? 'pl-4' : ''}`}>
        <div
          className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer
            ${item.path ? 'hover:text-blue-600' : ''}
            ${level === 0 ? 'font-medium' : 'font-normal'}
          `}
          onClick={() => {
            if (item.children) {
              toggleExpand(item.id);
            } else {
              handleNavigation(item);
            }
          }}
        >
          <div className="flex items-center space-x-3">
            {item.icon && (
              <span className="text-gray-600">
                {getIconComponent(item.icon)}
              </span>
            )}
            {isOpen && (
              <span className="text-sm">{item.title}</span>
            )}
          </div>
          
          {item.children && isOpen && (
            <span className="text-gray-400">
              {expandedItems[item.id] ? <FiChevronDown /> : <FiChevronRight />}
            </span>
          )}
        </div>

        {item.children && expandedItems[item.id] && isOpen && (
          <div className="ml-2 border-l border-gray-200">
            {renderMenuItems(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0  bg-opacity-50 z-1 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-15  md:left-0  h-full   z-1 transition-all duration-300 ease-in-out font-sans
        ${isOpen ? 'w-64' : 'w-16'} 
        ${isMobile ? (isOpen ? 'translate-x-0' : 'translate-x-[-16px]') : 'translate-x-0'}
        bg-white shadow-xl border-r border-gray-200
      `}>
        {/* Header */}
        <div className="flex items-center justify-end p-4 border-b border-gray-200 bg-white">
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            {isOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>

        {/* Search Bar - Only shown when sidebar is open */}
        {isOpen && (
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-2">
          {!isOpen ? (
            <div className="space-y-4 pt-4">
              {menuItems.slice(0, 6).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item)}
                  className="w-full p-2 rounded-lg hover:bg-gray-100 transition-colors group flex justify-center"
                  title={item.title}
                >
                  {item.icon ? (
                    <span className="text-gray-600">
                      {getIconComponent(item.icon)}
                    </span>
                  ) : (
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-md flex items-center justify-center">
                      <FiGrid className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-2">
              {renderMenuItems(menuItems)}
            </div>
          )}
        </div>

        {/* Footer - Only shown when sidebar is open */}
        {isOpen && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                {menuItems.length} main menu items
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Toggle Button */}
      {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-40 p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors md:hidden"
        >
          <FiMenu className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default Sidebar;