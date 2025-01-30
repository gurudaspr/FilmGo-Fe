
import './App.css'
import Navbar from './components/navbar/Navbar'
import  { CarouselSize  } from './components/slider/Slider'
import LoginForm from './pages/LoginPage'

function App() {

  return (
    <>
    <Navbar/>
    <div className='mt-20'>
    <CarouselSize/>
    </div>
       <LoginForm/>
    </>
  )
}

export default App
