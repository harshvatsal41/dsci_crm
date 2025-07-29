 const normalizeImagePath = (url) => {
    if (!url) return null;
    
    // Replace backslashes with forward slashes
    const normalizedPath = url.replace(/\\/g, '/');
    
    // Ensure the path starts with exactly one forward slash
    const cleanPath = normalizedPath.startsWith('/') 
      ? normalizedPath 
      : `/${normalizedPath}`;
    
    // Remove any duplicate slashes
    const finalPath = cleanPath.replace(/\/+/g, '/');
    
    // Basic validation
    if (/^\/[a-zA-Z0-9\-_\/.]+$/.test(finalPath)) {
      return finalPath;
    }
    
    console.warn('Invalid image path:', url);
    return null;
  };

   // const getValidImageUrl = (url) => {
  //   if (!url) return null;
    
  //   try {
  //     if (url.startsWith('http://') || url.startsWith('https://')) {
  //       new URL(url); // This will throw if invalid
  //       return url;
  //     }
      
  //     if (url.startsWith('/')) {
  //       const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  //       return `${baseUrl}${url}`;
  //     }
      
  //     // If it's a potentially malformed URL, try to fix it
  //     return `https://${url.replace(/^\/\//, '')}`;
  //   } catch (error) {
  //     console.error('Invalid image URL:', url);
  //     return null;
  //   }
  // };

  export {normalizeImagePath};
