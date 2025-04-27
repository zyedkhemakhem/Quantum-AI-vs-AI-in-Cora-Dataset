function Visualizations({ images }) {
    return (
      <>
        {images.graph && <img src={images.graph} alt="Graphe" style={{ maxWidth: '100%', marginTop: '2rem' }} />}
        {images.degrees && <img src={images.degrees} alt="Degrees" style={{ maxWidth: '100%', marginTop: '1rem' }} />}
        {images.tsne_before && <img src={images.tsne_before} alt="TSNE Before" style={{ maxWidth: '100%', marginTop: '2rem' }} />}
        {images.tsne_after && <img src={images.tsne_after} alt="TSNE After" style={{ maxWidth: '100%', marginTop: '1rem' }} />}
        {images.accuracy_degree && <img src={images.accuracy_degree} alt="Accuracy Degree" style={{ maxWidth: '100%', marginTop: '1rem' }} />}
      </>
    );
  }
  
  export default Visualizations;
  