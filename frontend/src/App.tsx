
import './styles/global.css';
import AppRouter from './router/app-route';
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { GlobalStyles } from './styles';


function App() {
  return (
    <>
     <GlobalStyles />
      <AppRouter />
    </>
  );
}

export default App;
