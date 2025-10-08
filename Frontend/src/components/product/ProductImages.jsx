import { useState } from 'react';

export default function ProductImages({ images, selectedImage, onImageSelect }) {
  return (
    <div style={styles.container}>
      <div style={styles.mainImageContainer}>
        <img 
          src={images[selectedImage]} 
          alt="Product" 
          style={styles.mainImage}
        />
      </div>
      <div style={styles.thumbnailContainer}>
        {images.map((img, index) => (
          <div 
            key={index}
            style={{
              ...styles.thumbnail,
              border: selectedImage === index ? '2px solid #3498db' : '1px solid #ddd',
            }}
            onClick={() => onImageSelect(index)}
          >
            <img 
              src={img} 
              alt={`Thumbnail ${index + 1}`} 
              style={styles.thumbnailImage}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  mainImageContainer: {
    width: '100%',
    height: '400px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  mainImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
  thumbnailContainer: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
    padding: '5px 0',
  },
  thumbnail: {
    width: '70px',
    height: '70px',
    borderRadius: '4px',
    cursor: 'pointer',
    flexShrink: 0,
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  thumbnailImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
};