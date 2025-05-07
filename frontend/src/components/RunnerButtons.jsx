function RunnerButtons({ onTrain, loading }) {
  const models = [
    "gcn", "gat", "gcn_aug", "gat_aug",
    "qgcn", "qgat", "qgcn_aug", "qgat_aug"
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