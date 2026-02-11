import React from 'react'
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom'
import {Toaster} from 'react-hot-toast';
import BlogLandingPage from './Pages/Blog/BlogLandingPage';
import BlogPostView from './Pages/Blog/BlogPostView';
import PostByTags from './Pages/Blog/PostByTags';
import SearchPosts from './Pages/Blog/SearchPosts';
import AdminLogin from './Pages/Admin/AdminLogin';
import PrivateRoutes from './routes/PrivateRoutes';
import Dashboard from './Pages/Admin/Dashboard';
import BlogPosts from './Pages/Admin/BlogPosts';
import BlogPostEditor from './Pages/Admin/BlogPostEditor';
import UserProvider from './context/userContext';
const App = () => {
  return (
    <UserProvider>
    <div>
      <Router>
        <Routes>
           <Route path='/' element={<BlogLandingPage/>}/>
           <Route path='/:slug' element={<BlogPostView/>}/>
           <Route path='/tag/:tagName' element={<PostByTags/>}/>
           <Route path='/search' element={<SearchPosts/>}/>
           <Route path='/admin-login' element={<AdminLogin/>}/>
           <Route element={<PrivateRoutes allowedRoles={['admin']}/>}>
              <Route path='/admin/dashboard' element={<Dashboard/>}/>
              <Route path='/admin/posts' element={<BlogPosts/>}/>
              <Route path='/admin/create' element={<BlogPostEditor/>}/>
              <Route 
              path='/admin/edit/:postSlug'
              element={<BlogPostEditor   isEdit={true}/>}
              />
              <Route path='/admin/comments' element={<Comment />}/>
           </Route>

          
        </Routes>
      </Router>
      <Toaster 
      toastOptions={
        {
          className:"",
          style:{
            fontSize:'13px'
          }
        }
      }
      
      
      />
    </div>
    </UserProvider>
  )
}

export default App
