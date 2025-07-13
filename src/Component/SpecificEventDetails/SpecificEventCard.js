'use client'
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Modal from '../UI/Modal';

export default function SpecificEventCard({ setEdit, data, type = 'focusArea' }) {
  const { Id } = useParams();

  // Configuration for different card types
  const cardConfig = {
    focusArea: {
      title: 'Focus Areas',
      emptyMessage: 'No focus areas found',
      basePath: 'focusArea',
      imageSize: 80
    },
    speaker: {
      title: 'Speakers',
      emptyMessage: 'No speakers found',
      basePath: 'speaker',
      imageSize: 80
    },
    sponsor: {
      title: 'Sponsors',
      emptyMessage: 'No sponsors found',
      basePath: 'sponsor',
      imageSize: 100
    },
    navbar: {
      title: 'Navigation Items',
      emptyMessage: 'No navigation items found',
      basePath: 'navbar',
      imageSize: 60
    },
    default: {
      title: 'Event Items',
      emptyMessage: 'No items found',
      basePath: 'item',
      imageSize: 70
    }
  };

  const config = cardConfig[type] || cardConfig.default;

  return (
    <div className="p-4">
      
      {data?.data?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">{config.emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.map((item) => (
            <Link 
              key={item._id} 
              href={`/administration/dashboard/specificEventCard/${Id}/${config.basePath}/${item._id}`}
              className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex items-center space-x-4">
                  {item.imageUrlPath && (
                    <div className="flex-shrink-0">
                      <Image
                        src={item.imageUrlPath}
                        alt={item.name}
                        width={config.imageSize}
                        height={config.imageSize}
                        className="rounded-lg object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                  <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                  {item.isDeleted && (
                    <span className="text-red-500">Deleted</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}