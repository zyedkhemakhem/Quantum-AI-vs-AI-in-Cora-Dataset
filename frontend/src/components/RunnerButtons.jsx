function RunnerButtons({ onTrain, loading }) {
  const models = [
    "gcn", "gat", "gcn_aug", "gat_aug",
    "qgcn", "qgat", "qgcn_aug", "qgat_aug"
  ];

  return (
    <div style={{ marginBottom: "1rem" }}>
      {models.map((model) => (
        <button
          key={model}
          onClick={() => onTrain(model)}
          disabled={loading}
          className="primary"
        >
          {model.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export default RunnerButtons;
