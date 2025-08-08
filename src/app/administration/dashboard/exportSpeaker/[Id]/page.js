'use client';
import { useState, useEffect, useRef } from 'react';
import { FiImage,FiItalic, FiBold, FiUnderline, FiType, FiLayout, FiDownload, FiUpload, FiChevronLeft, FiChevronRight, FiPlus, FiTrash2, FiMove } from 'react-icons/fi';
import { SpeakerApi } from '@/utilities/ApiManager';
import { useParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

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
};

// Text elements with unique IDs
const defaultTextElements = [
  {
    id: uuidv4(),
    type: 'name',
    content: 'Speaker Name',
    styles: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#333333',
      textAlign: 'center',
      margin: '0',
      fontFamily: 'Arial, sans-serif'
    }
  },
  {
    id: uuidv4(),
    type: 'title',
    content: 'Position Title',
    styles: {
      fontSize: '16px',
      fontWeight: '500',
      color: '#555555',
      textAlign: 'center',
      margin: '0',
      fontFamily: 'Arial, sans-serif'
    }
  },
  {
    id: uuidv4(),
    type: 'organization',
    content: 'Organization',
    styles: {
      fontSize: '14px',
      fontWeight: '400',
      color: '#666666',
      textAlign: 'center',
      margin: '0',
      fontFamily: 'Arial, sans-serif'
    }
  }
];

const layoutTemplates = [
  {
    id: 'default',
    name: 'Default',
    description: 'Simple centered layout'
  },
  {
    id: 'business',
    name: 'Business Conference',
    description: 'Professional layout with header/footer'
  },
  {
    id: 'webinar',
    name: 'Webinar',
    description: 'Layout optimized for online events'
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean and simple design'
  }
];

const businessTemplateStyles = {
  container: {
    backgroundColor: '#f0f8ff',
    backgroundImage: '',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '20px',
    minHeight: '100vh'
  },
  card: {
    width: '320px',
    height: 'auto',
    padding: '25px',
    margin: '10px auto',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    backgroundImage: 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    transition: 'all 0.3s ease'
  },
  image: {
    width: '140px',
    height: '140px',
    borderRadius: '50%',
    objectFit: 'cover',
    margin: '0 auto',
    border: '4px solid #e6f2ff'
  },
  textElements: [
    {
      id: uuidv4(),
      type: 'custom',
      content: 'BUSINESS CONFERENCE',
      styles: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#2c6fbb',
        textAlign: 'center',
        margin: '0 0 5px 0',
        fontFamily: 'Arial, sans-serif',
        letterSpacing: '1.5px',
        textTransform: 'uppercase'
      }
    },
    {
      id: uuidv4(),
      type: 'name',
      content: 'Speaker Name',
      styles: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#1a365d',
        textAlign: 'center',
        margin: '15px 0 0 0',
        fontFamily: 'Georgia, serif'
      }
    },
    {
      id: uuidv4(),
      type: 'title',
      content: 'Position Title',
      styles: {
        fontSize: '18px',
        fontWeight: '500',
        color: '#4a5568',
        textAlign: 'center',
        margin: '5px 0',
        fontFamily: 'Arial, sans-serif',
        fontStyle: 'italic'
      }
    },
    {
      id: uuidv4(),
      type: 'organization',
      content: 'Organization',
      styles: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#2b6cb0',
        textAlign: 'center',
        margin: '0 0 15px 0',
        fontFamily: 'Arial, sans-serif'
      }
    },
    {
      id: uuidv4(),
      type: 'custom',
      content: 'FREE WEBINAR',
      styles: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#2c6fbb',
        textAlign: 'center',
        margin: '20px 0 5px 0',
        fontFamily: 'Arial, sans-serif',
        padding: '10px 0',
        borderTop: '1px solid #e2e8f0'
      }
    }
  ]
};

export default function SpeakerCardDesigner() {
  const [speakers, setSpeakers] = useState([]);
  const [styles, setStyles] = useState({
    ...defaultStyles,
    textElements: [...defaultTextElements]
  });
  const [activeTab, setActiveTab] = useState('layout');
  const [isLoading, setIsLoading] = useState(false);
  const [cardsPerPage, setCardsPerPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTextElement, setSelectedTextElement] = useState(null);
  const [draggedElement, setDraggedElement] = useState(null);
  const [cardArrangement, setCardArrangement] = useState('vertical'); // 'vertical' or 'horizontal'
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

  const handleTextElementChange = (id, property, value) => {
    setStyles(prev => {
      const updatedTextElements = prev.textElements.map(element => {
        if (element.id === id) {
          if (property === 'content') {
            return { ...element, content: value };
          } else {
            return {
              ...element,
              styles: {
                ...element.styles,
                [property]: value
              }
            };
          }
        }
        return element;
      });

      return { ...prev, textElements: updatedTextElements };
    });
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

  const handleBackgroundImageUpload = (event, section = 'container') => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleStyleChange(section, 'backgroundImage', `url(${e.target.result})`);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTextElement = () => {
    const newElement = {
      id: uuidv4(),
      type: 'custom',
      content: 'New Text',
      styles: {
        fontSize: '16px',
        fontWeight: '400',
        color: '#333333',
        textAlign: 'center',
        margin: '5px 0',
        fontFamily: 'Arial, sans-serif'
      }
    };

    setStyles(prev => ({
      ...prev,
      textElements: [...prev.textElements, newElement]
    }));

    setSelectedTextElement(newElement.id);
  };

  const removeTextElement = (id) => {
    setStyles(prev => ({
      ...prev,
      textElements: prev.textElements.filter(element => element.id !== id)
    }));

    if (selectedTextElement === id) {
      setSelectedTextElement(null);
    }
  };

  const applyTemplate = (templateId) => {
    if (templateId === 'business') {
      setStyles({
        ...businessTemplateStyles,
        textElements: businessTemplateStyles.textElements.map(el => ({
          ...el,
          id: uuidv4()
        }))
      });
    } else {
      // Default template
      setStyles({
        ...defaultStyles,
        textElements: [...defaultTextElements]
      });
    }
    setSelectedTextElement(null);
  };

  const handleDragStart = (e, id) => {
    setDraggedElement(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetId) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');

    if (draggedId !== targetId) {
      setStyles(prev => {
        const elements = [...prev.textElements];
        const draggedIndex = elements.findIndex(el => el.id === draggedId);
        const targetIndex = elements.findIndex(el => el.id === targetId);

        if (draggedIndex === -1 || targetIndex === -1) return prev;

        const [draggedItem] = elements.splice(draggedIndex, 1);
        elements.splice(targetIndex, 0, draggedItem);

        return { ...prev, textElements: elements };
      });
    }

    setDraggedElement(null);
  };

  useEffect(() => {
    const fetchSpeakers = async () => {
      const res = await SpeakerApi(null, "GET", { Id: params.Id });
      if (res.success || res.statusCode === 200) {
        setSpeakers(res.data);
      }
    };
    fetchSpeakers();
  }, [params.Id]);

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
        // Group speakers into pages
        const pages = [];
        for (let i = 0; i < speakers.length; i += cardsPerPage) {
          pages.push(speakers.slice(i, i + cardsPerPage));
        }

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
                min-height: 100vh;
                display: flex;
                flex-direction: ${cardArrangement === 'horizontal' ? 'row' : 'column'};
                flex-wrap: ${cardArrangement === 'horizontal' ? 'wrap' : 'nowrap'};
                align-items: center;
                justify-content: center;
                padding: ${styles.container.padding || '20px'};
                box-sizing: border-box;
              }
              .speaker-card {
                width: ${styles.card.width || '280px'};
                padding: ${styles.card.padding || '20px'};
                margin: ${styles.card.margin || '10px'};
                border-radius: ${styles.card.borderRadius || '0'};
                background-color: ${styles.card.backgroundColor || 'transparent'};
                ${styles.card.backgroundImage ? `background-image: ${styles.card.backgroundImage};` : ''}
                background-size: cover;
                background-position: center;
                box-shadow: ${styles.card.boxShadow || 'none'};
                display: flex;
                flex-direction: column;
                gap: ${styles.card.gap || '15px'};
                opacity: ${styles.card.opacity || 1};
              }
              .speaker-image {
                width: ${styles.image.width || '120px'};
                height: ${styles.image.height || '120px'};
                border-radius: ${styles.image.borderRadius || '50%'};
                object-fit: cover;
                margin: 0 auto;
                border: ${styles.image.border || '3px solid #e0e0e0'};
              }
              @media print {
                body {
                  padding: 0 !important;
                  margin: 0 !important;
                }
                .page {
                  padding: 10mm !important;
                  page-break-after: avoid;
                }
              }
            </style>
          </head>
          <body>
            ${pages.map(pageSpeakers => `
              <div class="page">
                ${pageSpeakers.map(speaker => `
                  <div class="speaker-card">
                    <img src="${speaker.photoUrl || '/placeholder-speaker.jpg'}" alt="${speaker.name}" class="speaker-image" />
                    ${styles.textElements.map(element => {
          const content = element.type === 'custom'
            ? element.content
            : speaker[element.type] || '';
          return `<div style="${Object.entries(element.styles).map(([key, val]) => `${key}:${val}`).join(';')}">
                        ${content}
                      </div>`;
        }).join('')}
                  </div>
                `).join('')}
              </div>
            `).join('')}
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
      toast.error('PDF export failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row max-h-screen overflow-auto bg-gray-50">
      {/* Design Controls */}
      <div className="w-full lg:w-1/3 p-6 bg-white border-r border-gray-200 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Speaker Cards Designer</h1>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Layout Template</label>
          <div className="grid grid-cols-2 gap-3">
            {layoutTemplates.map(template => (
              <button
                key={template.id}
                onClick={() => applyTemplate(template.id)}
                className="p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
              >
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{template.description}</p>
              </button>
            ))}
          </div>
        </div>

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
          <button
            className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'content' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('content')}
          >
            Content
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
            {cardsPerPage > 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Arrangement</label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setCardArrangement('vertical')}
                    className={`p-2 border rounded ${cardArrangement === 'vertical' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                  >
                    Vertical
                  </button>
                  <button
                    onClick={() => setCardArrangement('horizontal')}
                    className={`p-2 border rounded ${cardArrangement === 'horizontal' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                  >
                    Horizontal
                  </button>
                </div>
              </div>
            )}
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
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Page Background</label>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleBackgroundImageUpload(e, 'container')}
                  className="hidden"
                  id="page-bg-upload"
                />
                <label
                  htmlFor="page-bg-upload"
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-50"
                >
                  <FiUpload className="mr-2" />
                  Upload Page BG
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Background</label>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleBackgroundImageUpload(e, 'card')}
                  className="hidden"
                  id="card-bg-upload"
                />
                <label
                  htmlFor="card-bg-upload"
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-50"
                >
                  <FiUpload className="mr-2" />
                  Upload Card BG
                </label>
                {styles.card.backgroundImage && (
                  <button
                    onClick={() => handleStyleChange('card', 'backgroundImage', '')}
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

        {activeTab === 'text' && selectedTextElement && (
          <div className="space-y-4">
            <h3 className="font-medium">Text Settings</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={styles.textElements.find(e => e.id === selectedTextElement)?.styles.fontSize || ''}
                    onChange={(e) => handleTextElementChange(selectedTextElement, 'fontSize', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="16px"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Font Family</label>
                <select
                  value={styles.textElements.find(e => e.id === selectedTextElement)?.styles.fontFamily || 'Arial, sans-serif'}
                  onChange={(e) => handleTextElementChange(selectedTextElement, 'fontFamily', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="'Times New Roman', Times, serif">Times New Roman</option>
                  <option value="'Courier New', monospace">Courier New</option>
                  <option value="Verdana, Geneva, sans-serif">Verdana</option>
                  <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                  <option value="'Gill Sans', sans-serif">Gill Sans</option>
                  <option value="'Segoe UI', Tahoma, sans-serif">Segoe UI</option>
                  <option value="'Roboto', Arial, sans-serif">Roboto</option>
                  <option value="'Open Sans', sans-serif">Open Sans</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={styles.textElements.find(e => e.id === selectedTextElement)?.styles.color || '#333333'}
                  onChange={(e) => handleTextElementChange(selectedTextElement, 'color', e.target.value)}
                  className="w-10 h-10 p-1 border border-gray-300 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={styles.textElements.find(e => e.id === selectedTextElement)?.styles.color || ''}
                  onChange={(e) => handleTextElementChange(selectedTextElement, 'color', e.target.value)}
                  className="ml-2 w-full p-2 border border-gray-300 rounded"
                  placeholder="#333333"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
                <div className="flex border border-gray-300 rounded overflow-hidden">
                  <button
                    onClick={() => handleTextElementChange(selectedTextElement, 'textAlign', 'left')}
                    className={`flex-1 py-2 px-3 ${styles.textElements.find(e => e.id === selectedTextElement)?.styles.textAlign === 'left' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                  >
                    Left
                  </button>
                  <button
                    onClick={() => handleTextElementChange(selectedTextElement, 'textAlign', 'center')}
                    className={`flex-1 py-2 px-3 ${styles.textElements.find(e => e.id === selectedTextElement)?.styles.textAlign === 'center' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                  >
                    Center
                  </button>
                  <button
                    onClick={() => handleTextElementChange(selectedTextElement, 'textAlign', 'right')}
                    className={`flex-1 py-2 px-3 ${styles.textElements.find(e => e.id === selectedTextElement)?.styles.textAlign === 'right' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                  >
                    Right
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text Transform</label>
                <select
                  value={styles.textElements.find(e => e.id === selectedTextElement)?.styles.textTransform || 'none'}
                  onChange={(e) => handleTextElementChange(selectedTextElement, 'textTransform', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="none">Normal</option>
                  <option value="uppercase">UPPERCASE</option>
                  <option value="lowercase">lowercase</option>
                  <option value="capitalize">Capitalize</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Font Weight</label>
                <select
                  value={styles.textElements.find(e => e.id === selectedTextElement)?.styles.fontWeight || '400'}
                  onChange={(e) => handleTextElementChange(selectedTextElement, 'fontWeight', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="100">Thin (100)</option>
                  <option value="200">Extra Light (200)</option>
                  <option value="300">Light (300)</option>
                  <option value="400">Normal (400)</option>
                  <option value="500">Medium (500)</option>
                  <option value="600">Semi Bold (600)</option>
                  <option value="700">Bold (700)</option>
                  <option value="800">Extra Bold (800)</option>
                  <option value="900">Black (900)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Line Height</label>
                <input
                  type="text"
                  value={styles.textElements.find(e => e.id === selectedTextElement)?.styles.lineHeight || ''}
                  onChange={(e) => handleTextElementChange(selectedTextElement, 'lineHeight', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="1.4"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Letter Spacing</label>
                <input
                  type="text"
                  value={styles.textElements.find(e => e.id === selectedTextElement)?.styles.letterSpacing || ''}
                  onChange={(e) => handleTextElementChange(selectedTextElement, 'letterSpacing', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="0px"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Text Styles</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      const currentStyle = styles.textElements.find(e => e.id === selectedTextElement)?.styles.fontStyle || 'normal';
                      handleTextElementChange(
                        selectedTextElement,
                        'fontStyle',
                        currentStyle === 'italic' ? 'normal' : 'italic'
                      );
                    }}
                    className={`p-2 border rounded ${styles.textElements.find(e => e.id === selectedTextElement)?.styles.fontStyle === 'italic' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                  >
                    <FiItalic />
                  </button>
                  <button
                    onClick={() => {
                      const currentStyle = styles.textElements.find(e => e.id === selectedTextElement)?.styles.fontWeight || '400';
                      handleTextElementChange(
                        selectedTextElement,
                        'fontWeight',
                        currentStyle === '700' ? '400' : '700'
                      );
                    }}
                    className={`p-2 border rounded ${styles.textElements.find(e => e.id === selectedTextElement)?.styles.fontWeight === '700' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                  >
                    <FiBold />
                  </button>
                  <button
                    onClick={() => {
                      const currentStyle = styles.textElements.find(e => e.id === selectedTextElement)?.styles.textDecoration || 'none';
                      handleTextElementChange(
                        selectedTextElement,
                        'textDecoration',
                        currentStyle === 'underline' ? 'none' : 'underline'
                      );
                    }}
                    className={`p-2 border rounded ${styles.textElements.find(e => e.id === selectedTextElement)?.styles.textDecoration === 'underline' ? 'bg-blue-100 border-blue-500' : 'border-gray-300'}`}
                  >
                    <FiUnderline />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Margin</label>
              <div className="grid grid-cols-4 gap-2">
                <input
                  type="text"
                  value={styles.textElements.find(e => e.id === selectedTextElement)?.styles.marginTop || ''}
                  onChange={(e) => handleTextElementChange(selectedTextElement, 'marginTop', e.target.value)}
                  className="p-2 border border-gray-300 rounded text-center"
                  placeholder="Top"
                />
                <input
                  type="text"
                  value={styles.textElements.find(e => e.id === selectedTextElement)?.styles.marginRight || ''}
                  onChange={(e) => handleTextElementChange(selectedTextElement, 'marginRight', e.target.value)}
                  className="p-2 border border-gray-300 rounded text-center"
                  placeholder="Right"
                />
                <input
                  type="text"
                  value={styles.textElements.find(e => e.id === selectedTextElement)?.styles.marginBottom || ''}
                  onChange={(e) => handleTextElementChange(selectedTextElement, 'marginBottom', e.target.value)}
                  className="p-2 border border-gray-300 rounded text-center"
                  placeholder="Bottom"
                />
                <input
                  type="text"
                  value={styles.textElements.find(e => e.id === selectedTextElement)?.styles.marginLeft || ''}
                  onChange={(e) => handleTextElementChange(selectedTextElement, 'marginLeft', e.target.value)}
                  className="p-2 border border-gray-300 rounded text-center"
                  placeholder="Left"
                />
              </div>
            </div>
          </div>
        )}


        {activeTab === 'content' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Content Elements</h3>
              <button
                onClick={addTextElement}
                className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              >
                <FiPlus className="mr-1" /> Add Element
              </button>
            </div>

            <div className="space-y-2">
              {styles.textElements.map((element, index) => (
                <div
                  key={element.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, element.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, element.id)}
                  className={`p-3 border rounded-lg flex items-center justify-between ${selectedTextElement === element.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                    } ${draggedElement === element.id ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-center">
                    <FiMove className="mr-3 text-gray-400 cursor-move" />
                    <div>
                      <div className="font-medium">
                        {element.type === 'custom' ? 'Custom Text' :
                          element.type.charAt(0).toUpperCase() + element.type.slice(1)}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{element.content}</div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {/* <button 
                      onClick={() => setSelectedTextElement(element.id)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button> */}
                    <button
                      onClick={() => removeTextElement(element.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {selectedTextElement && (
              <div className="mt-4 p-3 border border-gray-300 rounded-lg">
                <h4 className="font-medium mb-2">Edit Content</h4>
                <textarea
                  value={styles.textElements.find(e => e.id === selectedTextElement)?.content || ''}
                  onChange={(e) => handleTextElementChange(selectedTextElement, 'content', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  rows={3}
                />
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col space-y-3 mt-6">
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
              flexDirection: cardArrangement === 'horizontal' ? 'row' : 'column',
              flexWrap: cardArrangement === 'horizontal' ? 'wrap' : 'nowrap',
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
                {styles.textElements.map(element => {
                  const content = element.type === 'custom'
                    ? element.content
                    : speaker[element.type] || '';

                  return (
                    <div
                      key={element.id}
                      style={element.styles}
                      className={selectedTextElement === element.id ? 'ring-2 ring-blue-500' : ''}
                    >
                      {content}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}