import { Suspense } from 'react';
import { HashRouter as Router } from 'react-router-dom'
import { Spin } from 'antd'
import { routes } from 'router'
import RouterView from 'router/RouterView'
import './App.css';

const App: React.FC<{}> = () => {
  return (
    // <div className="App">
      <Router>
        <Suspense fallback={<div style={{ textAlign: 'center' }}><Spin size="large" /></div>}>
          <RouterView routerList={routes} />
        </Suspense>
      </Router>
    // </div>
  );
}

export default App;
