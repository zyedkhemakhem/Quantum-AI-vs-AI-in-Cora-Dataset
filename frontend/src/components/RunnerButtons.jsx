function RunnerButtons({ onTrain, loading }) {
    return (
      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => onTrain('gcn')} disabled={loading} style={{ marginRight: '1rem' }}>
          Lancer GCN
        </button>
        <button onClick={() => onTrain('gat')} disabled={loading}>
          Lancer GAT
        </button>
      </div>
    );
  }
  
  export default RunnerButtons;
  