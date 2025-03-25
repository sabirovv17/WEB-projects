import { render, screen } from '@testing-library/react';
import App from './App';
import ReactDOM from "react-dom/client";

ReactDOM.render(
    // <React.StrictMode>
    <App />,
    // </React.StrictMode>,
    // eslint-disable-next-line testing-library/no-node-access
    document.getElementById('root')
);