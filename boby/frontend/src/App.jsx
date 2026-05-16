import FloatingWidget from './widget/FloatingWidget';
import { BobyProvider } from './context/BobyContext';

function App() {
  return (
    <BobyProvider>
      <FloatingWidget />
    </BobyProvider>
  );
}

export default App;

// Made with Bob
