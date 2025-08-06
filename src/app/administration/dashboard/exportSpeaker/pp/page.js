'use client';
import { useState, useRef, useEffect } from 'react';
import { FiUser, FiImage, FiSettings, FiGrid, FiDownload, FiChevronLeft, FiChevronRight, FiItalic, FiBold, FiUnderline, FiType, FiLayout, FiUpload, FiPlus, FiTrash2, FiMove } from 'react-icons/fi';
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

const SpeakerCardGenerator = () => {
    // State for sidebar tabs
    const [activeTab, setActiveTab] = useState('layout');
    const [selectedRatio, setSelectedRatio] = useState('1:1');
    const [orientation, setOrientation] = useState('portrait');
    const [dpi, setDpi] = useState(300);
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [speakers, setSpeakers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [cardsPerRow, setCardsPerRow] = useState(4);
    const [selectedTextElement, setSelectedTextElement] = useState(null);
    const [draggedElement, setDraggedElement] = useState(null);
    const [cardArrangement, setCardArrangement] = useState('vertical');
    
    const [styles, setStyles] = useState({
      ...defaultStyles,
      textElements: [...defaultTextElements]
    });

    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const previewRef = useRef(null);
    const params = useParams();

    // Fetch speakers data
    useEffect(() => {
        const fetchSpeakers = async () => {
            const res = await SpeakerApi(null, "GET", { Id: params.Id || "6873a80cfe53b141095ab8d5" });
            if (res.success || res.statusCode === 200) {
                setSpeakers(res.data);
            }
        };
        fetchSpeakers();
    }, [params.Id]);

    const aspectRatios = [
        { name: 'Square', ratio: '1:1' },
        { name: 'Standard', ratio: '3:4' },
        { name: 'Widescreen', ratio: '9:16' },
        { name: 'Classic', ratio: '2:3' },
        { name: 'Golden', ratio: '3:5' },
        { name: 'Portrait', ratio: '4:5' },
        { name: 'International', ratio: '5:7' },
    ];

    // Calculate dimensions
    const calculateDimensions = () => {
        const [widthRatio, heightRatio] = selectedRatio.split(':').map(Number);
        const baseRatio = widthRatio / heightRatio;
        const baseSize = dpi === 300 ? 2480 : 595;

        let width, height;

        if (orientation === 'landscape') {
            width = baseSize * Math.max(baseRatio, 1);
            height = baseSize * Math.min(baseRatio, 1);
        } else {
            width = baseSize * Math.min(baseRatio, 1);
            height = baseSize * Math.max(baseRatio, 1);
        }

        if (selectedRatio === '1:1') {
            width = baseSize;
            height = baseSize;
        }

        return {
            width: Math.round(width),
            height: Math.round(height),
            ratioText: orientation === 'landscape' ?
                `${heightRatio}:${widthRatio}` :
                `${widthRatio}:${heightRatio}`
        };
    };

    // Handle background image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setBackgroundImage(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

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

    // Generate canvas with multiple cards
    const generateCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas || speakers.length === 0) return;

        const { width, height } = calculateDimensions();
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');

        // Fill background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        // Draw background image if exists
        if (backgroundImage) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, width, height);
                drawCards(ctx, width, height);
            };
            img.src = backgroundImage;
        } else {
            drawCards(ctx, width, height);
        }
    };

    // Draw multiple cards
    const drawCards = (ctx, canvasWidth, canvasHeight) => {
        const cardsPerPage = cardsPerRow * Math.floor(canvasHeight / (canvasWidth / cardsPerRow * 1.5));
        const startIndex = currentPage * cardsPerPage;
        const endIndex = Math.min(startIndex + cardsPerPage, speakers.length);
        const currentSpeakers = speakers.slice(startIndex, endIndex);

        const cardWidth = canvasWidth / cardsPerRow;
        const cardHeight = cardWidth * 1; // Maintain aspect ratio

        currentSpeakers.forEach((speaker, index) => {
            const row = Math.floor(index / cardsPerRow);
            const col = index % cardsPerRow;
            const x = col * cardWidth;
            const y = row * cardHeight;

            // Draw card background
            ctx.fillStyle = styles.card.backgroundColor;
            ctx.beginPath();
            ctx.roundRect(x, y, cardWidth, cardHeight, parseInt(styles.card.borderRadius));
            ctx.fill();

            // Draw speaker content
            drawSpeakerContent(ctx, speaker, x, y, cardWidth, cardHeight);
        });
    };

    // Draw speaker content
    const drawSpeakerContent = (ctx, speaker, x, y, width, height) => {
        const centerX = x + width / 2;
        
        // Draw speaker photo
        if (true) {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                const photoSize = Math.min(width, height) * 0.3;
                const photoX = centerX - photoSize / 2;
                const photoY = y + height * 0.1;

                // Draw photo with specified shape
                if (styles.image.borderRadius === '50%') {
                  ctx.beginPath();
                  ctx.arc(centerX, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
                  ctx.closePath();
                  ctx.clip();
                } else {
                  ctx.beginPath();
                  ctx.roundRect(photoX, photoY, photoSize, photoSize, 
                    styles.image.borderRadius === '0' ? 0 : 
                    styles.image.borderRadius === '12px' ? 12 : 
                    parseInt(styles.image.borderRadius) || 0);
                  ctx.closePath();
                  ctx.clip();
                }
                
                ctx.drawImage(img, photoX, photoY, photoSize, photoSize);
                ctx.restore();

                // Draw text content
                drawTextContent(ctx, speaker, centerX, photoY + photoSize + 20, width);
            };
            img.onerror = () => {
                drawTextContent(ctx, speaker, centerX, y + height * 0.1, width);
            };
            img.src = speaker.photoUrl;
        } else {
            drawTextContent(ctx, speaker, centerX, y + height * 0.1, width);
        }
    };

    // Draw text content
    const drawTextContent = (ctx, speaker, centerX, startY, width) => {
      styles.textElements.forEach(element => {
        const content = element.type === 'custom' ? element.content : speaker[element.type] || '';
        if (!content) return;

        // Apply text styles
        ctx.fillStyle = element.styles.color || '#333333';
        ctx.font = `${element.styles.fontWeight || '400'} ${element.styles.fontSize || '16px'} ${element.styles.fontFamily || 'Arial, sans-serif'}`;
        ctx.textAlign = element.styles.textAlign || 'center';
        
        // Calculate position based on margin
        const textX = element.styles.textAlign === 'left' ? centerX - width/2 + (parseInt(element.styles.marginLeft) || 0) : 
        element.styles.textAlign === 'right' ? centerX + width/2 - (parseInt(element.styles.marginRight) || 0) : 
        centerX;        
        // Draw text
        ctx.fillText(content, textX, startY);
        
        // Adjust startY for next element
        startY += parseInt(element.styles.fontSize || '16px') + (parseInt(element.styles.marginBottom) || 0)
      });
    };

    // Toggle orientation
    const toggleOrientation = () => {
        setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait');
    };

    // Update canvas when settings change
    useEffect(() => {
        generateCanvas();
    }, [
        selectedRatio, orientation, dpi, backgroundColor, backgroundImage, 
        speakers, currentPage, cardsPerRow, styles
    ]);

    // Download image
    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        setIsLoading(true);
        
        const { ratioText } = calculateDimensions();
        const link = document.createElement('a');
        link.download = `speaker-cards-${ratioText.replace(':', '-')}-${orientation}-${dpi}dpi.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        setIsLoading(false);
    };

    // Handle page navigation
    const totalPages = Math.ceil(speakers.length / (cardsPerRow * 2)); // Approximate pages
    const handlePreviousPage = () => setCurrentPage(prev => Math.max(0, prev - 1));
    const handleNextPage = () => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-80 bg-white p-4 shadow-md flex flex-col">
                <h2 className="text-xl font-bold mb-4">Speaker Card Generator</h2>

                {/* Tab Navigation */}
                <div className="overflow-x-auto border-b mb-4">
                    <div className="flex whitespace-nowrap space-x-4 px-2">
                        <button
                            onClick={() => setActiveTab('layout')}
                            className={`flex items-center px-4 py-2 font-medium rounded-t ${activeTab === 'layout' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                        >
                            <FiGrid className="inline mr-2" /> Layout
                        </button>
                        <button
                            onClick={() => setActiveTab('design')}
                            className={`flex items-center px-4 py-2 font-medium rounded-t ${activeTab === 'design' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                        >
                            <FiImage className="inline mr-2" /> Design
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`flex items-center px-4 py-2 font-medium rounded-t ${activeTab === 'settings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                        >
                            <FiSettings className="inline mr-2" /> Settings
                        </button>
                        <button
                            onClick={() => setActiveTab('content')}
                            className={`flex items-center px-4 py-2 font-medium rounded-t ${activeTab === 'content' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                        >
                            <FiType className="inline mr-2" /> Content
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto">
                    {activeTab === 'layout' && (
                        <div className="space-y-4">
                            <h3 className="font-medium">Layout Settings</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Cards Per Row</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[2, 3, 4, 5, 6].map(num => (
                                        <button
                                            key={num}
                                            onClick={() => setCardsPerRow(num)}
                                            className={`p-2 rounded ${cardsPerRow === num ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Page Navigation</label>
                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={handlePreviousPage}
                                        disabled={currentPage === 0}
                                        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-3 py-1">
                                        Page {currentPage + 1} of {totalPages}
                                    </span>
                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage >= totalPages - 1}
                                        className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Showing</label>
                                <div className="p-2 border border-gray-300 rounded bg-gray-50">
                                    {speakers.length} speakers ({cardsPerRow} per row)
                                </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Card Layout</label>
                              <div className="grid grid-cols-2 gap-3">
                                {layoutTemplates.map(template => (
                                  <button
                                    key={template.id}
                                    onClick={() => applyTemplate(template.id)}
                                    className="p-2 border border-gray-300 rounded hover:border-blue-500 hover:bg-blue-50 text-left text-sm"
                                  >
                                    <h3 className="font-medium">{template.name}</h3>
                                    <p className="text-xs text-gray-500">{template.description}</p>
                                  </button>
                                ))}
                              </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'design' && (
                        <div className="space-y-4">
                            <h3 className="font-medium">Design Settings</h3>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Card Background</label>
                                <input
                                    type="color"
                                    value={styles.card.backgroundColor}
                                    onChange={(e) => handleStyleChange('card', 'backgroundColor', e.target.value)}
                                    className="w-full h-10"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Card Border Radius</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    value={parseInt(styles.card.borderRadius)}
                                    onChange={(e) => handleStyleChange('card', 'borderRadius', `${e.target.value}px`)}
                                    className="w-full"
                                />
                                <div className="text-center">{styles.card.borderRadius}</div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Image Style</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => handleImageShapeChange('circle')}
                                        className={`p-2 rounded ${styles.image.borderRadius === '50%' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                                    >
                                        Circle
                                    </button>
                                    <button
                                        onClick={() => handleImageShapeChange('rounded')}
                                        className={`p-2 rounded ${styles.image.borderRadius === '12px' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                                    >
                                        Rounded
                                    </button>
                                    <button
                                        onClick={() => handleImageShapeChange('square')}
                                        className={`p-2 rounded ${styles.image.borderRadius === '0' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                                    >
                                        Square
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Image Size</label>
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    value={styles.image.width}
                                    onChange={(e) => handleStyleChange('image', 'width', e.target.value)}
                                    className="p-2 border border-gray-300 rounded"
                                    placeholder="Width"
                                  />
                                  <input
                                    type="text"
                                    value={styles.image.height}
                                    onChange={(e) => handleStyleChange('image', 'height', e.target.value)}
                                    className="p-2 border border-gray-300 rounded"
                                    placeholder="Height"
                                  />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Text Styles</label>
                                <div className="space-y-4">
                                    {styles.textElements.map((element) => (
                                        <div key={element.id}>
                                            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{element.type}</label>
                                            <div className="flex items-center">
                                                <input
                                                    type="color"
                                                    value={element.styles.color}
                                                    onChange={(e) => handleTextElementChange(element.id, 'color', e.target.value)}
                                                    className="w-8 h-8 mr-2"
                                                />
                                                <select
                                                    value={element.styles.fontSize}
                                                    onChange={(e) => handleTextElementChange(element.id, 'fontSize', e.target.value)}
                                                    className="flex-1 p-1 border rounded"
                                                >
                                                    {['12px', '14px', '16px', '18px', '20px', '22px', '24px'].map(size => (
                                                        <option key={size} value={size}>{size}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="space-y-4">
                            <h3 className="font-medium">Export Settings</h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Aspect Ratio</label>
                                <div className="space-y-2">
                                    {aspectRatios.map(({ name, ratio }) => (
                                        <button
                                            key={ratio}
                                            onClick={() => setSelectedRatio(ratio)}
                                            className={`w-full p-2 text-left rounded ${selectedRatio === ratio ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                                        >
                                            {name} ({ratio})
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Orientation</label>
                                <button
                                    onClick={toggleOrientation}
                                    className={`w-full p-3 rounded flex items-center justify-center ${orientation === 'portrait' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}
                                >
                                    {orientation === 'portrait' ? (
                                        <>
                                            <span className="mr-2">Portrait</span>
                                            <div className="w-6 h-8 border-2 border-blue-500"></div>
                                        </>
                                    ) : (
                                        <>
                                            <span className="mr-2">Landscape</span>
                                            <div className="w-8 h-6 border-2 border-green-500"></div>
                                        </>
                                    )}
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Resolution</label>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setDpi(300)}
                                        className={`flex-1 p-2 rounded ${dpi === 300 ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                                    >
                                        300 DPI (Print)
                                    </button>
                                    <button
                                        onClick={() => setDpi(72)}
                                        className={`flex-1 p-2 rounded ${dpi === 72 ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                                    >
                                        72 DPI (Web)
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
                                <input
                                    type="color"
                                    value={backgroundColor}
                                    onChange={(e) => setBackgroundColor(e.target.value)}
                                    className="w-full h-10 mb-2"
                                />
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                    className="hidden"
                                    id="bg-upload"
                                />
                                <label
                                    htmlFor="bg-upload"
                                    className="block w-full p-3 border border-gray-300 rounded cursor-pointer text-center hover:bg-gray-50"
                                >
                                    {backgroundImage ? 'Change Background Image' : 'Upload Background Image'}
                                </label>
                                {backgroundImage && (
                                    <button
                                        onClick={() => setBackgroundImage(null)}
                                        className="w-full mt-2 p-2 text-red-600 border border-red-300 rounded hover:bg-red-50"
                                    >
                                        Remove Background Image
                                    </button>
                                )}
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
                </div>

                {/* Download Button */}
                <button
                    onClick={downloadImage}
                    disabled={isLoading}
                    className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                >
                    <FiDownload className="mr-2" />
                    {isLoading ? 'Generating...' : 'Export All Cards'}
                </button>
            </div>

            {/* Main Content - Canvas Preview */}
            <div className="flex-1 p-8 overflow-auto flex items-center justify-center">
                <div className="bg-white p-4 rounded shadow-md">
                    <div className="mb-2 text-sm text-gray-600 text-center">
                        {calculateDimensions().ratioText} - {calculateDimensions().width}px × {calculateDimensions().height}px - {dpi} DPI - {orientation}
                    </div>
                    <div className="mb-4 flex justify-between">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 0}
                            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 flex items-center"
                        >
                            <FiChevronLeft className="mr-1" /> Previous
                        </button>
                        <span className="px-3 py-1">
                            Page {currentPage + 1} of {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage >= totalPages - 1}
                            className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 flex items-center"
                        >
                            Next <FiChevronRight className="ml-1" />
                        </button>
                    </div>
                    <canvas
                        ref={canvasRef}
                        className="border border-gray-300"
                        style={{
                            width: 'auto',
                            height: '70vh',
                            maxWidth: '90vw',
                            objectFit: 'contain'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default SpeakerCardGenerator;