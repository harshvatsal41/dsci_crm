'use client';
import { useState, useEffect, useRef } from 'react';
import { FiSave, FiImage, FiType, FiLayout, FiDownload, FiUpload, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import {SpeakerApi} from '@/utilities/ApiManager';
import { useParams } from 'next/navigation';

const defaultStyles = {
  container: {
    backgroundColor: '#f5f5f5',
    backgroundImage: '',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '20px',
    minHeight: '100vh'
  },
  card: {
    width: '280px',
    height: 'auto',
    padding: '20px',
    margin: '10px auto',
    borderRadius: '0px',
    backgroundColor: 'transparent',
    backgroundImage: 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    transition: 'all 0.3s ease'
  },
  image: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    margin: '0 auto',
    border: '3px solid #e0e0e0'
  },
  name: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    margin: '0',
    fontFamily: 'Arial, sans-serif'
  },
  title: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#555555',
    textAlign: 'center',
    margin: '0',
    fontFamily: 'Arial, sans-serif'
  },
  organization: {
    fontSize: '14px',
    fontWeight: '400',
    color: '#666666',
    textAlign: 'center',
    margin: '0',
    fontFamily: 'Arial, sans-serif'
  }
};

export default function SpeakerCardDesigner() {
  const [speakers, setSpeakers] = useState([]);
  const [styles, setStyles] = useState(defaultStyles);
  const [activeTab, setActiveTab] = useState('layout');
  const [isLoading, setIsLoading] = useState(false);
  const [cardsPerPage, setCardsPerPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const previewRef = useRef(null);
  const params = useParams();

  const handleStyleChange = (section, property, value) => {
    setStyles(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [property]: value
      }
    }));
  };

  const handleImageShapeChange = (shape) => {
    let borderRadius;
    if (shape === 'circle') {
      borderRadius = '50%';
    } else if (shape === 'rounded') {
      borderRadius = '12px';
    } else {
      borderRadius = '0';
    }
    handleStyleChange('image', 'borderRadius', borderRadius);
  };

  const handleBackgroundImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleStyleChange('container', 'backgroundImage', `url(${e.target.result})`);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => { 
    const fetchSpeakers = async () => {
      const res = await SpeakerApi(null, "GET", {Id: params.Id});
      if(res.success || res.statusCode==200){
        setSpeakers(res.data);
      }
    };
    fetchSpeakers();
  }, []);   

  // Calculate pagination
  const totalPages = Math.ceil(speakers.length / cardsPerPage);
  const startIndex = (currentPage - 1) * cardsPerPage;
  const currentSpeakers = speakers.slice(startIndex, startIndex + cardsPerPage);

  const exportToPDF = async () => {
    setIsLoading(true);
    try {
      const printWindow = window.open('', '_blank');
      const previewElement = previewRef.current;
      
      if (previewElement && printWindow) {
        const cardWidth = styles.card.width || '280px';
        const cardMargin = styles.card.margin || '10px';
        const containerPadding = styles.container.padding || '20px';
        
        const pdfHTML = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Speaker Cards</title>
            <style>
              body { 
                margin: 0; 
                padding: 0; 
                font-family: Arial, sans-serif;
                background: ${styles.container.backgroundColor};
                ${styles.container.backgroundImage ? `background-image: ${styles.container.backgroundImage};` : ''}
                background-size: cover;
                background-position: center;
              }
              .page {
                width: 100%;
                height: 100vh;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: ${containerPadding};
                page-break-after: always;
              }
              .speaker-card {
                width: ${cardWidth};
                padding: ${styles.card.padding || '20px'};
                margin: ${cardMargin};
                border-radius: ${styles.card.borderRadius || '12px'};
                background-color: ${styles.card.backgroundColor || '#ffffff'};
                ${styles.card.backgroundImage ? `background-image: ${styles.card.backgroundImage};` : ''}
                background-size: cover;
                background-position: center;
                box-shadow: ${styles.card.boxShadow || '0 4px 12px rgba(0, 0, 0, 0.15)'};
                opacity: ${styles.card.opacity || 1};
                display: flex;
                flex-direction: column;
                gap: ${styles.card.gap};
              }
              .speaker-image {
                width: ${styles.image.width};
                height: ${styles.image.height};
                border-radius: ${styles.image.borderRadius};
                object-fit: cover;
                margin: 0 auto;
                border: ${styles.image.border};
              }
              .speaker-name {
                font-size: ${styles.name.fontSize};
                font-weight: ${styles.name.fontWeight};
                color: ${styles.name.color};
                text-align: ${styles.name.textAlign};
                margin: 0;
                font-family: ${styles.name.fontFamily};
              }
              .speaker-title {
                font-size: ${styles.title.fontSize};
                font-weight: ${styles.title.fontWeight};
                color: ${styles.title.color};
                text-align: ${styles.title.textAlign};
                margin: 0;
                font-family: ${styles.title.fontFamily};
              }
              .speaker-organization {
                font-size: ${styles.organization.fontSize};
                font-weight: ${styles.organization.fontWeight};
                color: ${styles.organization.color};
                text-align: ${styles.organization.textAlign};
                margin: 0;
                font-family: ${styles.organization.fontFamily};
              }
              @media print {
                body {
                  padding: 0 !important;
                  margin: 0 !important;
                }
                .page {
                  padding: 10mm !important;
                }
              }
            </style>
          </head>
          <body>
            ${speakers.map((speaker, index) => {
              // Start a new page for each card when cardsPerPage=1
              // For multiple cards per page, group them
              if (index % cardsPerPage === 0) {
                let pageContent = '';
                const pageSpeakers = speakers.slice(index, index + cardsPerPage);
                
                pageContent += `<div class="page">`;
                pageSpeakers.forEach(sp => {
                  pageContent += `
                    <div class="speaker-card">
                      <img src="${sp.photoUrl || '/placeholder-speaker.jpg'}" alt="${sp.name}" class="speaker-image" />
                      <h2 class="speaker-name">${sp.name}</h2>
                      <p class="speaker-title">${sp.position}</p>
                      <p class="speaker-organization">${sp.organization}</p>
                    </div>
                  `;
                });
                pageContent += `</div>`;
                return pageContent;
              }
              return '';
            }).join('')}
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                  window.close();
                }, 500);
              };
            </script>
          </body>
          </html>
        `;
        
        printWindow.document.write(pdfHTML);
        printWindow.document.close();
        
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 1000);
      }
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row max-h-screen overflow-auto bg-gray-50">
      {/* Design Controls */}
      <div className="w-full lg:w-1/3 p-6 bg-white border-r border-gray-200 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Speaker Cards Designer</h1>
        
        <div className="flex border-b mb-4 overflow-x-auto">
          <button
            className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'layout' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('layout')}
          >
            <FiLayout className="inline mr-2" /> Layout
          </button>
          <button
            className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'background' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('background')}
          >
            Background
          </button>
          <button
            className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'image' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('image')}
          >
            <FiImage className="inline mr-2" /> Image
          </button>
          <button
            className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'text' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('text')}
          >
            <FiType className="inline mr-2" /> Text
          </button>
        </div>

        {activeTab === 'layout' && (
          <div className="space-y-4">
            <h3 className="font-medium">Card Layout</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cards per Page</label>
              <select
                value={cardsPerPage}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value);
                  setCardsPerPage(newValue);
                  setCurrentPage(1);
                }}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value={1}>1 Card</option>
                <option value={2}>2 Cards</option>
                <option value={4}>4 Cards</option>
                <option value={6}>6 Cards</option>
                <option value={8}>8 Cards</option>
                <option value={10}>10 Cards</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Width</label>
              <input
                type="text"
                value={styles.card.width}
                onChange={(e) => handleStyleChange('card', 'width', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="280px"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Padding</label>
              <div className="grid grid-cols-4 gap-2">
                <input
                  type="text"
                  value={styles.card.padding || ''}
                  onChange={(e) => handleStyleChange('card', 'padding', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Top"
                />
                <input
                  type="text"
                  value={styles.card.paddingRight || ''}
                  onChange={(e) => handleStyleChange('card', 'paddingRight', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Right"
                />
                <input
                  type="text"
                  value={styles.card.paddingBottom || ''}
                  onChange={(e) => handleStyleChange('card', 'paddingBottom', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Bottom"
                />
                <input
                  type="text"
                  value={styles.card.paddingLeft || ''}
                  onChange={(e) => handleStyleChange('card', 'paddingLeft', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Left"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Margin</label>
              <input
                type="text"
                value={styles.card.margin}
                onChange={(e) => handleStyleChange('card', 'margin', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="10px"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Gap</label>
              <input
                type="text"
                value={styles.card.gap}
                onChange={(e) => handleStyleChange('card', 'gap', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="15px"
              />
            </div>
          </div>
        )}

        {activeTab === 'background' && (
          <div className="space-y-4">
            <h3 className="font-medium">Background Settings</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
              <input
                type="text"
                value={styles.container.backgroundColor}
                onChange={(e) => handleStyleChange('container', 'backgroundColor', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="#f5f5f5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Image</label>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundImageUpload}
                  className="hidden"
                  id="bg-upload"
                />
                <label
                  htmlFor="bg-upload"
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-50"
                >
                  <FiUpload className="mr-2" />
                  Upload Image
                </label>
                {styles.container.backgroundImage && (
                  <button
                    onClick={() => handleStyleChange('container', 'backgroundImage', '')}
                    className="px-3 py-2 text-red-600 border border-red-300 rounded hover:bg-red-50"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'image' && (
          <div className="space-y-4">
            <h3 className="font-medium">Image Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                <input
                  type="text"
                  value={styles.image.width}
                  onChange={(e) => handleStyleChange('image', 'width', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="120px"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                <input
                  type="text"
                  value={styles.image.height}
                  onChange={(e) => handleStyleChange('image', 'height', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="120px"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image Shape</label>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleImageShapeChange('circle')}
                  className={`p-3 border rounded ${styles.image.borderRadius === '50%' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                >
                  <span className="block text-xs mt-1">Circle</span>
                </button>
                <button
                  onClick={() => handleImageShapeChange('rounded')}
                  className={`p-3 border rounded ${styles.image.borderRadius === '12px' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                >
                  <span className="block text-xs mt-1">Rounded</span>
                </button>
                <button
                  onClick={() => handleImageShapeChange('square')}
                  className={`p-3 border rounded ${styles.image.borderRadius === '0' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                >
                  <span className="block text-xs mt-1">Square</span>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image Border</label>
              <input
                type="text"
                value={styles.image.border}
                onChange={(e) => handleStyleChange('image', 'border', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="3px solid #e0e0e0"
              />
            </div>
          </div>
        )}

        {activeTab === 'text' && (
          <div className="space-y-4">
            <h3 className="font-medium">Text Settings</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name Font Size</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={styles.name.fontSize}
                  onChange={(e) => handleStyleChange('name', 'fontSize', e.target.value)}
                  className="w-1/2 p-2 border border-gray-300 rounded"
                  placeholder="20px"
                />
                <select
                  value={styles.name.fontFamily || 'Arial, sans-serif'}
                  onChange={(e) => handleStyleChange('name', 'fontFamily', e.target.value)}
                  className="w-1/2 p-2 border border-gray-300 rounded"
                >
                  <option value="Arial, sans-serif">Sans (Arial)</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Mono (Courier New)</option>
                  <option value="Tahoma, Geneva, sans-serif">Sans (Tahoma)</option>
                  <option value="'Times New Roman', Times, serif">Serif (Times New Roman)</option>
                  <option value="'Roboto', Arial, sans-serif">Sans (Roboto)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name Color</label>
              <input
                type="text"
                value={styles.name.color}
                onChange={(e) => handleStyleChange('name', 'color', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="#333333"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title Font Size</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={styles.title.fontSize}
                  onChange={(e) => handleStyleChange('title', 'fontSize', e.target.value)}
                  className="w-1/2 p-2 border border-gray-300 rounded"
                  placeholder="16px"
                />
                <select
                  value={styles.title.fontFamily || 'Arial, sans-serif'}
                  onChange={(e) => handleStyleChange('title', 'fontFamily', e.target.value)}
                  className="w-1/2 p-2 border border-gray-300 rounded"
                >
                  <option value="Arial, sans-serif">Sans (Arial)</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Mono (Courier New)</option>
                  <option value="Tahoma, Geneva, sans-serif">Sans (Tahoma)</option>
                  <option value="'Times New Roman', Times, serif">Serif (Times New Roman)</option>
                  <option value="'Roboto', Arial, sans-serif">Sans (Roboto)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title Color</label>
              <input
                type="text"
                value={styles.title.color}
                onChange={(e) => handleStyleChange('title', 'color', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="#555555"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Font Size</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={styles.organization.fontSize}
                  onChange={(e) => handleStyleChange('organization', 'fontSize', e.target.value)}
                  className="w-1/2 p-2 border border-gray-300 rounded"
                  placeholder="14px"
                />
                <select
                  value={styles.organization.fontFamily || 'Arial, sans-serif'}
                  onChange={(e) => handleStyleChange('organization', 'fontFamily', e.target.value)}
                  className="w-1/2 p-2 border border-gray-300 rounded"
                >
                  <option value="Arial, sans-serif">Sans (Arial)</option>
                  <option value="Georgia, serif">Serif (Georgia)</option>
                  <option value="'Courier New', monospace">Mono (Courier New)</option>
                  <option value="Tahoma, Geneva, sans-serif">Sans (Tahoma)</option>
                  <option value="'Times New Roman', Times, serif">Serif (Times New Roman)</option>
                  <option value="'Roboto', Arial, sans-serif">Sans (Roboto)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Color</label>
              <input
                type="text"
                value={styles.organization.color}
                onChange={(e) => handleStyleChange('organization', 'color', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="#666666"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-3 mt-6">
          <button
            className="w-full bg-blue-600 text-white py-2 px-4 rounded flex items-center justify-center hover:bg-blue-700 transition-colors"
            disabled={isLoading}
          >
            <FiSave className="mr-2" />
            {isLoading ? 'Saving...' : 'Save Design'}
          </button>
          
          <button
            onClick={exportToPDF}
            className="w-full bg-green-600 text-white py-2 px-4 rounded flex items-center justify-center hover:bg-green-700 transition-colors"
            disabled={isLoading}
          >
            <FiDownload className="mr-2" />
            {isLoading ? 'Exporting...' : 'Export to PDF'}
          </button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="w-full lg:w-2/3 p-2 overflow-auto">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Live Preview ({speakers.length} speakers)</h2>
          
          {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 flex items-center"
              >
                <FiChevronLeft className="mr-1" /> Prev
              </button>
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 flex items-center"
              >
                Next <FiChevronRight className="ml-1" />
              </button>
            </div>
          )}
        </div>
        
        <div
          ref={previewRef}
          style={{
            ...styles.container,
            minHeight: 'auto'
          }}
          className="rounded-lg border border-gray-200 overflow-hidden"
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              padding: '20px'
            }}
          >
            {currentSpeakers.map((speaker) => (
              <div key={speaker._id} style={styles.card}>
                <img
                  src={speaker.photoUrl || '/placeholder-speaker.jpg'}
                  alt={speaker.name}
                  style={styles.image}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/120x120/cccccc/666666?text=No+Image';
                  }}
                />
                <h2 style={styles.name}>{speaker.name}</h2>
                <p style={styles.title}>{speaker.position}</p>
                <p style={styles.organization}>{speaker.organization}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}