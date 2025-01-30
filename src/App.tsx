
import { RouterProvider } from 'react-router-dom'
import './App.css'
import LoginForm from './pages/LoginPage'
import routes from './routes/Routes'

function App() {

  return (
    <>
    <RouterProvider router={routes} />
       <LoginForm/>
    </>
  )
}

export default App
