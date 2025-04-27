function TrainingResults({ accuracy, parameters, output }) {
    return (
      <>
        {accuracy && <p><strong>🎯 Accuracy :</strong> {accuracy}</p>}
  
        {parameters && (
          <div style={{ marginTop: '1rem' }}>
            <p><strong>📐 Nombre de couches :</strong> {parameters.layers}</p>
            <p><strong>📊 Taille du dataset :</strong> {parameters.dataset_size} nœuds</p>
          </div>
        )}
  
        {output && (
          <pre style={{
            background: '#1e1e1e',
            color: '#00ff88',
            padding: '1rem',
            marginTop: '1rem',
            maxHeight: '400px',
            overflowY: 'auto',
            border: '1px solid #333',
            borderRadius: '8px',
            fontFamily: 'Courier New, monospace',
            whiteSpace: 'pre-wrap'
          }}>
            {output}
          </pre>
        )}
      </>
    );
  }
  
  export default TrainingResults;
  