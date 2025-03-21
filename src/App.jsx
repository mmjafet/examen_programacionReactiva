import { useState } from 'react'
import Productos from './Components/productos'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Productos/>
    </>
  )
}

export default App
