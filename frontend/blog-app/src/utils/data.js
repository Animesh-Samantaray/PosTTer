import {
    LuLayoutDashboard,LuGalleryVerticalEnd,LuMessageSquareQuote,LuLayoutTemplate,LuTag
} from 'react-icons/lu'



export const SIDE_MENU_DATA=[
    {
        id:"01",
        label:"Dashboard",
        icon:LuLayoutDashboard,
        Path:'/admin/dashboard'  
    },
    {
        id:"02",
        label:"Blog Posts",
        icon:LuGalleryVerticalEnd,
        Path:'/admin/posts'  
    },
    {
        id:"03",
        label:"Comments",
        icon:LuMessageSquareQuote,
        Path:'/admin/comments'  
    },
]


export const BLOG_NAVBAR_DATA=[
    {
        id:"01",
        label:"Home",
        icon:LuLayoutTemplate,
        path:'/'  
    },
    {
        id:"02",
        label:"React JS",
        icon:LuTag,
        path:'/tag/react'  
    },
    {
        id:"03",
        label:"Next JS",
        icon:LuTag,
        path:'/tag/Next.js'  
    },
]