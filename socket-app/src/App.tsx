import { Route, Router, Routes, useRoutes } from 'react-router-dom';
import './App.css';
import route from 'route';

const App = () => {
  return (
    <Routes>
        {route.map((x, i) => {
          return (
            <Route key={i} path={x.path} element={x.element} />
          )
        })}
    </Routes>
  );
}

export default App;