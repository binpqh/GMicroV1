import React from 'react';
import RootContainer from './App/Root/RootContainer';
import ErrorBoundary from './App/Containers/Errors/ErrorBoundary';
function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <RootContainer />
    </ErrorBoundary>

  );
}
export default App;
