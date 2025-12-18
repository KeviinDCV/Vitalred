import{r as o,j as e,L as d}from"./app-D9F8BQJw.js";import{A as c}from"./app-logo-icon-DOHWMODH.js";function h({children:x,title:n,description:i,showHeader:r=!0}){const[l,m]=o.useState(0),s=["/images/1.png","/images/2.png","/images/3.png"];return o.useEffect(()=>{const a=setInterval(()=>{m(t=>(t+1)%s.length)},4e3);return()=>clearInterval(a)},[s.length]),e.jsxs("div",{className:"flex min-h-screen min-h-[100dvh] w-full overflow-hidden bg-slate-100",children:[e.jsx("div",{className:`
                w-full lg:w-1/3 
                flex flex-col justify-center items-center 
                p-4 sm:p-6 md:p-8 lg:p-12 
                bg-white shadow-xl z-10 
                overflow-y-auto
            `,children:e.jsxs("div",{className:"w-full max-w-sm sm:max-w-md",children:[r&&e.jsx("div",{className:"text-center mb-4 sm:mb-6 lg:mb-8",children:e.jsxs(d,{href:route("home"),className:"inline-block",children:[e.jsx(c,{size:100,className:"w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 mx-auto mb-1 sm:mb-2"}),e.jsx("h1",{className:"text-2xl sm:text-3xl lg:text-4xl font-bold text-primary tracking-tight",children:"HERMES"})]})}),e.jsxs("div",{className:`
                        bg-white 
                        p-4 sm:p-6 md:p-8 
                        rounded-xl sm:rounded-2xl 
                        shadow-sm border border-slate-200
                    `,children:[e.jsxs("div",{className:"text-center mb-4 sm:mb-5 lg:mb-6",children:[e.jsx("h2",{className:"text-lg sm:text-xl lg:text-2xl font-semibold text-slate-800",children:n}),e.jsx("p",{className:"text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1",children:i})]}),x]}),e.jsx("p",{className:"text-[10px] sm:text-xs text-center text-slate-400 mt-4 sm:mt-6 lg:mt-8",children:"© 2025 Hospital Universitario Del Valle. Todos los derechos reservados."})]})}),e.jsxs("div",{className:`
                hidden lg:flex 
                lg:w-2/3 
                relative bg-primary 
                items-center justify-center 
                overflow-hidden
            `,children:[e.jsx("div",{className:"absolute inset-0 bg-gradient-to-br from-blue-900 to-primary opacity-90 mix-blend-multiply z-10"}),e.jsx("div",{className:"absolute inset-0 opacity-5 z-0",style:{backgroundImage:`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}),e.jsxs("div",{className:"relative z-20 w-full max-w-4xl xl:max-w-5xl px-6 xl:px-8 flex flex-col items-center",children:[e.jsx("div",{className:"mb-6 xl:mb-8 text-center text-white opacity-90",children:e.jsx("img",{src:"/images/huv-h.png",alt:"Hospital Universitario del Valle",className:"h-24 xl:h-32 2xl:h-36 w-auto object-contain filter drop-shadow-lg mx-auto"})}),e.jsxs("h2",{className:"text-3xl xl:text-4xl 2xl:text-5xl font-bold text-white mb-8 xl:mb-10 2xl:mb-12 drop-shadow-lg text-center",children:["Bienvenido a ",e.jsx("span",{className:"text-blue-200",children:"HERMES"})]}),e.jsxs("div",{className:`
                        relative w-full 
                        aspect-video 
                        max-h-[380px] xl:max-h-[450px] 2xl:max-h-[500px] 
                        rounded-xl xl:rounded-2xl 
                        overflow-hidden shadow-2xl 
                        border-2 xl:border-4 border-white/10
                    `,children:[e.jsx("div",{className:"flex transition-transform duration-1000 ease-in-out h-full",style:{transform:`translateX(-${l*100}%)`},children:s.map((a,t)=>e.jsxs("div",{className:"w-full h-full flex-shrink-0 relative",children:[e.jsx("img",{src:a,alt:`Imagen ${t+1} de HERMES`,className:"w-full h-full object-cover",loading:t===0?"eager":"lazy",decoding:"async"}),e.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"})]},t))}),e.jsx("div",{className:"absolute bottom-4 xl:bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2 xl:space-x-3",children:s.map((a,t)=>e.jsx("button",{onClick:()=>m(t),className:`
                                        w-2.5 h-2.5 xl:w-3 xl:h-3 
                                        rounded-full transition-all duration-300 shadow-md 
                                        ${l===t?"bg-white opacity-100 scale-110":"bg-white opacity-40 hover:opacity-75"}
                                    `,"aria-label":`Ir a imagen ${t+1}`},t))}),e.jsxs("div",{className:"absolute bottom-12 xl:bottom-14 left-4 xl:left-6 text-white max-w-sm xl:max-w-md",children:[e.jsxs("div",{className:"flex items-center gap-1.5 xl:gap-2 mb-1.5 xl:mb-2",children:[e.jsx("span",{className:"bg-red-600 text-white text-[10px] xl:text-xs font-bold px-1.5 xl:px-2 py-0.5 rounded",children:"Referencia"}),e.jsx("span",{className:"bg-primary text-white text-[10px] xl:text-xs font-bold px-1.5 xl:px-2 py-0.5 rounded",children:"Contrareferencia"})]}),e.jsx("h3",{className:"text-xl xl:text-2xl 2xl:text-3xl font-bold leading-tight mb-0.5 xl:mb-1",children:"Sistema de Referencia"}),e.jsx("p",{className:"text-xs xl:text-sm text-gray-200 line-clamp-2",children:"Coordinación eficiente de referencias y contrareferencias entre instituciones de salud."})]})]})]})]})]})}function f({children:x,title:n,description:i,showHeader:r,...l}){return e.jsx(h,{title:n,description:i,showHeader:r,...l,children:x})}export{f as A};
