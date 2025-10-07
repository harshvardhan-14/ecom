export default function ProductSpecifications({ specifications }) {
  if (!specifications || Object.keys(specifications).length === 0) {
    return null;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Product Specifications</h2>
      <div style={styles.specsGrid}>
        {Object.entries(specifications).map(([key, value]) => (
          <div key={key} style={styles.specItem}>
            <span style={styles.specKey}>{key}:</span>
            <span style={styles.specValue}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: '40px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  title: {
    fontSize: '20px',
    marginBottom: '20px',
    color: '#2c3e50',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  specsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '15px',
  },
  specItem: {
    display: 'flex',
    gap: '10px',
    padding: '8px 0',
    borderBottom: '1px solid #f5f5f5',
  },
  specKey: {
    color: '#7f8c8d',
    minWidth: '120px',
    fontWeight: '500',
  },
  specValue: {
    color: '#2c3e50',
    flex: 1,
  },
};
