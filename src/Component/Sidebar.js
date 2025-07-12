import { useState, useEffect } from 'react';
import { 
  FiMenu, 
  FiX, 
  FiChevronRight, 
  FiGrid, 
  FiImage,
  FiSearch,
  FiFilter
} from 'react-icons/fi';
import { BroadFocusAreaApi } from '@/utilities/ApiManager';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

const Sidebar = ({isOpen, setIsOpen}) => {
  const [broadFocusAreas, setBroadFocusAreas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { id } = useParams();
  // Mock data - replace with your API call
  useEffect(() => {
     const getBroadFocusAreas = async () => {
      try {
        const response = await BroadFocusAreaApi(null,"GET",{id});
        setBroadFocusAreas(response.data);
      } catch (error) {
        console.error('Error fetching broad focus areas:', error);
      }
    };
    getBroadFocusAreas();
  }, []);

  // Check for mobile screen size
  useEffect(() => {
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

  const handleFocusAreaClick = (focusAreaId) => {
    console.log(`Navigate to focus area: ${focusAreaId}`);
    // router.push(`/administration/dashboard/${id}/focus-areas/${focusAreaId}`);
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const filteredAreas = broadFocusAreas.filter(area =>
    area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0  bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
             fixed  top-15 left-0 h-full z-1000 transition-all duration-300 ease-in-out font-sans
        ${isOpen ? 'w-80' : 'w-16'} 
        ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
        bg-white shadow-xl border-r border-gray-200
      `}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className={`flex items-center space-x-3 ${!isOpen && 'justify-center'}`}>
            {/* <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <FiGrid className="w-5 h-5 text-blue-600" />
            </div> */}
            {isOpen && (
              <div className="text-white">
                <h2 className="text-lg font-semibold">Focus Areas</h2>
                <p className="text-xs text-blue-100">Manage your initiatives</p>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:bg-blue-600 hover:bg-opacity-20 p-2 rounded-lg transition-colors"
          >
            {isOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>

        {/* Search Bar */}
        {isOpen && (
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search focus areas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {!isOpen && (
            <div className="space-y-4">
              {filteredAreas.slice(0, 5).map((area) => (
                <button
                  key={area._id}
                  onClick={() => handleFocusAreaClick(area._id)}
                  className="w-full p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                  title={area.name}
                >
                  {area.imageUrlPath ? (
                    <img
                      src={area.imageUrlPath}
                      alt={area.name}
                      className="w-8 h-8 rounded-md object-cover mx-auto"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-md flex items-center justify-center mx-auto">
                      <FiImage className="w-4 h-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {isOpen && (
            <div className="space-y-3">
              {filteredAreas.length === 0 && (
                <div className="text-center py-8">
                  <FiFilter className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No focus areas found</p>
                </div>
              )}
              
              {filteredAreas.map((area) => (
                <button
                  key={area._id}
                  onClick={() => handleFocusAreaClick(area._id)}
                  className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:shadow-md group border border-gray-200"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {area.imageUrlPath ? (
                        <img
                          src={area.imageUrlPath}
                          alt={area.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <FiImage className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                          {area.name}
                        </h4>
                        <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {area.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {isOpen && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-center">
              <p className="text-xs text-gray-500">
                {filteredAreas.length} focus area{filteredAreas.length !== 1 ? 's' : ''} total
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Toggle Button */}
      {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-30 p-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors md:hidden"
        >
          <FiMenu className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default Sidebar;