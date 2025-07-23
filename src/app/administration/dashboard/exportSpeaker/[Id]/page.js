'use client';
import { useState, useEffect, useRef } from 'react';
import { FiSave, FiImage, FiType, FiLayout, FiDownload, FiUpload, FiCode } from 'react-icons/fi';
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
    margin: '10px',
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
  const [cardsPerRow, setCardsPerRow] = useState(4);
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

  const calculateGridColumns = () => {
    const cardWidth = parseInt(styles.card.width) || 280;
    const cardMargin = parseInt(styles.card.margin) || 10;
    
    return {
      gridTemplateColumns: `repeat(${cardsPerRow}, ${cardWidth}px)`,
      gap: `${cardMargin * 2}px`,
      justifyContent: 'center'
    };
  };

  const exportToPDF = async () => {
    setIsLoading(true);
    try {
      const printWindow = window.open('', '_blank');
      const previewElement = previewRef.current;
      
      if (previewElement && printWindow) {
        const containerPadding = styles.container.padding || '20px';
        const containerBgColor = styles.container.backgroundColor || '#f5f5f5';
        const containerBgImage = styles.container.backgroundImage || '';
        
        const pdfHTML = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Speaker Cards</title>
            <style>
              @page {
                size: A4;
                margin: 10mm;
              }
              body { 
                margin: 0; 
                padding: ${containerPadding}; 
                font-family: Arial, sans-serif;
                background-color: ${containerBgColor};
                ${containerBgImage ? `background-image: ${containerBgImage};` : ''}
                background-size: cover;
                background-position: center;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              .speakers-container {
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: ${styles.card.margin || '10px'};
                padding: ${containerPadding};
              }
              .speaker-card {
                width: ${styles.card.width || '280px'};
                padding: ${styles.card.padding || '20px'};
                margin: 0;
                border-radius: ${styles.card.borderRadius || '0px'};
                background-color: transparent;
                background-image: none;
                box-shadow: none;
                display: flex;
                flex-direction: column;
                gap: ${styles.card.gap || '15px'};
                break-inside: avoid;
                page-break-inside: avoid;
              }
              .speaker-image {
                width: ${styles.image.width || '120px'};
                height: ${styles.image.height || '120px'};
                border-radius: ${styles.image.borderRadius || '50%'};
                object-fit: cover;
                margin: 0 auto;
                border: ${styles.image.border || '3px solid #e0e0e0'};
              }
              .speaker-name {
                font-size: ${styles.name.fontSize || '20px'};
                font-weight: ${styles.name.fontWeight || '600'};
                color: ${styles.name.color || '#333333'};
                text-align: ${styles.name.textAlign || 'center'};
                margin: 0;
                font-family: ${styles.name.fontFamily || 'Arial, sans-serif'};
              }
              .speaker-title {
                font-size: ${styles.title.fontSize || '16px'};
                font-weight: ${styles.title.fontWeight || '500'};
                color: ${styles.title.color || '#555555'};
                text-align: ${styles.title.textAlign || 'center'};
                margin: 0;
                font-family: ${styles.title.fontFamily || 'Arial, sans-serif'};
              }
              .speaker-organization {
                font-size: ${styles.organization.fontSize || '14px'};
                font-weight: ${styles.organization.fontWeight || '400'};
                color: ${styles.organization.color || '#666666'};
                text-align: ${styles.organization.textAlign || 'center'};
                margin: 0;
                font-family: ${styles.organization.fontFamily || 'Arial, sans-serif'};
              }
              @media print {
                body {
                  padding: ${containerPadding} !important;
                  background-color: ${containerBgColor} !important;
                  ${containerBgImage ? `background-image: ${containerBgImage} !important;` : ''}
                  background-size: cover !important;
                  background-position: center !important;
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
                .speakers-container {
                  padding: 10mm !important;
                }
              }
            </style>
          </head>
          <body>
            <div class="speakers-container">
              ${speakers.map(speaker => `
                <div class="speaker-card">
                  <img src="${speaker.photoUrl || '/placeholder-speaker.jpg'}" alt="${speaker.name}" class="speaker-image" />
                  <h2 class="speaker-name">${speaker.name}</h2>
                  <p class="speaker-title">${speaker.position}</p>
                  <p class="speaker-organization">${speaker.organization}</p>
                </div>
              `).join('')}
            </div>
         <script>
  function waitForImagesToLoad(callback) {
    const images = document.images;
    let loadedCount = 0;

    if (images.length === 0) {
      callback();
      return;
    }

    for (let i = 0; i < images.length; i++) {
      if (images[i].complete) {
        loadedCount++;
        if (loadedCount === images.length) callback();
      } else {
        images[i].addEventListener('load', () => {
          loadedCount++;
          if (loadedCount === images.length) callback();
        });
        images[i].addEventListener('error', () => {
          loadedCount++;
          if (loadedCount === images.length) callback();
        });
      }
    }
  }

  window.onload = function() {
    waitForImagesToLoad(function() {
      setTimeout(function() {
        window.print();
        window.close();
      }, 300); // slight delay after load
    });
  };
</script>
          </body>
          </html>
        `;
        
        printWindow.document.write(pdfHTML);
        printWindow.document.close();
      }
    } catch (error) {
      console.error('PDF export failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to download HTML version
  const downloadHTML = () => {
    const containerPadding = styles.container.padding || '20px';
    const containerBgColor = styles.container.backgroundColor || '#f5f5f5';
    const containerBgImage = styles.container.backgroundImage || '';

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Speaker Cards</title>
        <style>
          body {
            margin: 0;
            padding: ${containerPadding};
            font-family: Arial, sans-serif;
            background-color: ${containerBgColor};
            ${containerBgImage ? `background-image: ${containerBgImage};` : ''}
            background-size: cover;
            background-position: center;
          }
          .speakers-container {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: ${styles.card.margin || '10px'};
            padding: ${containerPadding};
          }
          .speaker-card {
            width: ${styles.card.width || '280px'};
            padding: ${styles.card.padding || '20px'};
            margin: 0;
            border-radius: ${styles.card.borderRadius || '0px'};
            background-color: transparent;
            background-image: none;
            box-shadow: none;
            display: flex;
            flex-direction: column;
            gap: ${styles.card.gap || '15px'};
          }
          .speaker-image {
            width: ${styles.image.width || '120px'};
            height: ${styles.image.height || '120px'};
            border-radius: ${styles.image.borderRadius || '50%'};
            object-fit: cover;
            margin: 0 auto;
            border: ${styles.image.border || '3px solid #e0e0e0'};
          }
          .speaker-name {
            font-size: ${styles.name.fontSize || '20px'};
            font-weight: ${styles.name.fontWeight || '600'};
            color: ${styles.name.color || '#333333'};
            text-align: ${styles.name.textAlign || 'center'};
            margin: 0;
            font-family: ${styles.name.fontFamily || 'Arial, sans-serif'};
          }
          .speaker-title {
            font-size: ${styles.title.fontSize || '16px'};
            font-weight: ${styles.title.fontWeight || '500'};
            color: ${styles.title.color || '#555555'};
            text-align: ${styles.title.textAlign || 'center'};
            margin: 0;
            font-family: ${styles.title.fontFamily || 'Arial, sans-serif'};
          }
          .speaker-organization {
            font-size: ${styles.organization.fontSize || '14px'};
            font-weight: ${styles.organization.fontWeight || '400'};
            color: ${styles.organization.color || '#666666'};
            text-align: ${styles.organization.textAlign || 'center'};
            margin: 0;
            font-family: ${styles.organization.fontFamily || 'Arial, sans-serif'};
          }
        </style>
      </head>
      <body>
        <div class="speakers-container">
          ${speakers.map(speaker => `
            <div class="speaker-card">
              <img src="${speaker.photoUrl || '/placeholder-speaker.jpg'}" alt="${speaker.name}" class="speaker-image" />
              <h2 class="speaker-name">${speaker.name}</h2>
              <p class="speaker-title">${speaker.position}</p>
              <p class="speaker-organization">${speaker.organization}</p>
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `;

    // Create download link
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'speaker-cards.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Cards per Row</label>
              <select
                value={cardsPerRow}
                onChange={(e) => setCardsPerRow(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value={2}>2 Cards</option>
                <option value={3}>3 Cards</option>
                <option value={4}>4 Cards</option>
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
            onClick={exportToPDF}
            className="w-full bg-green-600 text-white py-2 px-4 rounded flex items-center justify-center hover:bg-green-700 transition-colors"
            disabled={isLoading}
          >
            <FiDownload className="mr-2" />
            {isLoading ? 'Exporting...' : 'Export to PDF'}
          </button>
          
          <button
            onClick={downloadHTML}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded flex items-center justify-center hover:bg-blue-700 transition-colors"
          >
            <FiCode className="mr-2" />
            Download HTML
          </button>
        </div>
      </div>

      {/* Live Preview */}
      <div className="w-full lg:w-2/3 p-2 overflow-auto">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Live Preview ({speakers.length} speakers)</h2>
          <p className="text-gray-600">Preview shows {cardsPerRow} cards per row</p>
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
            style={calculateGridColumns()}
            className="grid p-6"
          >
            {speakers.map((speaker) => (
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