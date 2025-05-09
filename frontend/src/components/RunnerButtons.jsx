function RunnerButtons({ onTrain, loading }) {
  const models = [
    "gcn", "gat", "gcn_augmented", "gat_augmented",
    "qgcn", "qgat", "qgcn_augmented", "qgat_augmented"
  ];


  return (
    <div style={{ marginBottom: "1rem" }}>
      <div className="button-group">
      {models.map((model) => (
        <button
          key={model}
          onClick={() => onTrain(model)}
          disabled={loading}

        >
          {model.toUpperCase()}
        </button>
      ))}
      </div>
    </div>
  );
}

export default RunnerButtons;