function VisualizationButtons({ onBefore, onAfter, loading, hasTrained }) {
    return (
      <div style={{ marginTop: '2rem' }}>
        <button onClick={onBefore} disabled={loading} style={{ marginRight: '1rem' }}>
          Visualisation AVANT entraînement
        </button>
        <button onClick={onAfter} disabled={loading || !hasTrained}>
          Visualisation APRÈS entraînement
        </button>
      </div>
    );
  }
  
  export default VisualizationButtons;
  