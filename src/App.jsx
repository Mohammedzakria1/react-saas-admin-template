import { createBrowserRouter , RouterProvider } from 'react-router'
import Home from './pages/Home'
import SaaSDashboard from './pages/Dashboard'

const router = createBrowserRouter([
{path:'/home', element:<Home/>},
{path:'/', element:<SaaSDashboard/>},

]);

export default function App(){
  return <RouterProvider router={router}/>
}