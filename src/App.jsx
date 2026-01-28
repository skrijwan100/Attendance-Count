import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import QRScanner from './components/Attend'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <Attend/> */}
      <QRScanner/>
    </>
  )
}

export default App
