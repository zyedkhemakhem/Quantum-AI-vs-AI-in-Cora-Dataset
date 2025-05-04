import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';

function CodeEditor({ title, apiEndpoint }) {
  const [code, setCode] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchInitialCode = async () => {
      try {
        const res = await fetch(apiEndpoint.replace('/update/', '/get/')); 
        const data = await res.json();
        if (data.code) {
          setCode(data.code);
        } else {
          alert("❌ Aucun code retourné !");
        }
      } catch (e) {
        alert("Erreur lors du chargement du code.");
      }
    };
  
    fetchInitialCode();
  }, [apiEndpoint]);
  

  const handleSave = async () => {
    if (!code.trim()) {
      alert("❌ Le code ne peut pas être vide !");
      return;
    }

    setSaving(true);
    const res = await fetch(apiEndpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });
    setSaving(false);
    if (res.ok) alert(`✅ ${title} sauvegardé avec succès`);
    else alert(' Erreur lors de la sauvegarde');
  };

  return (
    <div style={{ marginTop: '3rem' }}>
      <h2>{title}</h2>
      <CodeMirror
        value={code}
        height="400px"
        basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
        }}
        extensions={[python()]}
        onChange={(value) => setCode(value)}
        style={{
            fontSize: '14px',
            backgroundColor: '#f9f9f9',
            color: '#222',
            textAlign: 'left',
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '1rem'
        }}
        />

      <button onClick={handleSave} disabled={saving} style={{ marginTop: '1rem' }}>
        {saving ? "💾 Sauvegarde en cours..." : "💾 Enregistrer"}
      </button>
    </div>
  );
}

export default CodeEditor;
