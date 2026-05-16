import FloatingWidget from './widget/FloatingWidget';
import { GraphProvider } from './context/GraphContext';

function App() {
  return (
    <GraphProvider>
      <FloatingWidget />
    </GraphProvider>
  );
}

export default App;

// Made with Bob
