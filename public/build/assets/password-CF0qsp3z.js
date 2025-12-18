import{r as _,j as a,J as i,K as l,B as x}from"./app-UDAP9ZxG.js";import{I as e}from"./input-error-B7ohFid_.js";import{A as m}from"./app-layout-CUMuWzsi.js";import{S as c,H as g,z as u}from"./heading-small-BWqpCmXn.js";import{I as r}from"./input-DaGRtwIr.js";import{L as t}from"./label-DzEL2TFw.js";/* empty css            */import"./app-header-floating-Cd8IZwRc.js";import"./index-Dnuv90eP.js";import"./index-LU-adX0W.js";import"./user-C3kezsfK.js";import"./app-logo-icon-CJEGrjYM.js";const b=[{title:"Configuración de contraseña",href:"/settings/password"}];function I(){const n=_.useRef(null),o=_.useRef(null);return a.jsxs(m,{breadcrumbs:b,children:[a.jsx(i,{title:"Configuración de contraseña"}),a.jsx(c,{children:a.jsx("div",{className:"space-y-6 sm:space-y-8 md:space-y-10",children:a.jsxs("div",{className:`
                        bg-gradient-to-b from-white to-slate-50/20 
                        rounded-md sm:rounded-lg md:rounded-xl 
                        border-0 
                        shadow-[0_2px_4px_rgba(0,0,0,0.06),0_8px_20px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,1)] 
                        relative 
                        before:absolute before:inset-0 before:rounded-md sm:before:rounded-lg md:before:rounded-xl before:pointer-events-none
                        overflow-hidden`,children:[a.jsx("div",{className:`
                            border-b border-slate-100/80 
                            pb-3 sm:pb-4 md:pb-5 
                            px-3 sm:px-4 md:px-6 
                            pt-3 sm:pt-4 md:pt-6
                            bg-gradient-to-b from-white/60 to-transparent`,children:a.jsx(g,{title:"Actualizar contraseña",description:"Asegúrate de que tu cuenta use una contraseña larga y aleatoria para mantenerte seguro"})}),a.jsx("div",{className:"px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6",children:a.jsx(l,{method:"put",action:route("password.update"),options:{preserveScroll:!0},resetOnError:["password","password_confirmation","current_password"],resetOnSuccess:!0,onError:s=>{s.password&&n.current?.focus(),s.current_password&&o.current?.focus()},className:"space-y-4 sm:space-y-5 md:space-y-6",children:({errors:s,processing:p,recentlySuccessful:d})=>a.jsxs(a.Fragment,{children:[a.jsxs("div",{className:"grid gap-2 sm:gap-2.5",children:[a.jsx(t,{htmlFor:"current_password",className:"text-sm font-medium text-slate-700",children:"Contraseña actual"}),a.jsx(r,{id:"current_password",ref:o,name:"current_password",type:"password",className:`mt-1 block w-full
                                                    bg-gradient-to-b from-white to-slate-50/30
                                                    shadow-[0_1px_2px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.9)]
                                                    hover:shadow-[0_1px_3px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)]
                                                    focus:shadow-[0_2px_4px_rgba(0,0,0,0.08),0_4px_12px_rgba(59,130,246,0.18),0_0_0_1px_rgba(59,130,246,0.3),inset_0_2px_4px_rgba(255,255,255,0.9)]
                                                    transition-all duration-200`,autoComplete:"current-password",placeholder:"••••••••"}),a.jsx(e,{className:"mt-1.5",message:s.current_password})]}),a.jsxs("div",{className:"grid gap-2.5",children:[a.jsx(t,{htmlFor:"password",className:"text-sm font-medium text-slate-700",children:"Nueva contraseña"}),a.jsx(r,{id:"password",ref:n,name:"password",type:"password",className:`mt-1 block w-full
                                                    bg-gradient-to-b from-white to-slate-50/30
                                                    shadow-[0_1px_2px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.9)]
                                                    hover:shadow-[0_1px_3px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)]
                                                    focus:shadow-[0_2px_4px_rgba(0,0,0,0.08),0_4px_12px_rgba(59,130,246,0.18),0_0_0_1px_rgba(59,130,246,0.3),inset_0_2px_4px_rgba(255,255,255,0.9)]
                                                    transition-all duration-200`,autoComplete:"new-password",placeholder:"••••••••"}),a.jsx(e,{className:"mt-1.5",message:s.password})]}),a.jsxs("div",{className:"grid gap-2.5",children:[a.jsx(t,{htmlFor:"password_confirmation",className:"text-sm font-medium text-slate-700",children:"Confirmar contraseña"}),a.jsx(r,{id:"password_confirmation",name:"password_confirmation",type:"password",className:`mt-1 block w-full
                                                    bg-gradient-to-b from-white to-slate-50/30
                                                    shadow-[0_1px_2px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.9)]
                                                    hover:shadow-[0_1px_3px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)]
                                                    focus:shadow-[0_2px_4px_rgba(0,0,0,0.08),0_4px_12px_rgba(59,130,246,0.18),0_0_0_1px_rgba(59,130,246,0.3),inset_0_2px_4px_rgba(255,255,255,0.9)]
                                                    transition-all duration-200`,autoComplete:"new-password",placeholder:"••••••••"}),a.jsx(e,{className:"mt-1.5",message:s.password_confirmation})]}),a.jsxs("div",{className:`
                                            flex flex-col sm:flex-row 
                                            items-stretch sm:items-center 
                                            gap-3 sm:gap-4 md:gap-5 
                                            pt-1 sm:pt-2 md:pt-3
                                            border-t border-slate-100/50 sm:border-0
                                            mt-2 sm:mt-0`,children:[a.jsx(x,{disabled:p,className:`w-full sm:w-auto
                                                    shadow-[0_1px_2px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.12),0_6px_20px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.25)]
                                                    hover:shadow-[0_2px_4px_rgba(0,0,0,0.1),0_4px_12px_rgba(0,0,0,0.14),0_8px_24px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.3)]
                                                    active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.2),inset_0_-1px_0_rgba(255,255,255,0.1)]
                                                    active:translate-y-px
                                                    disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-[0_1px_2px_rgba(0,0,0,0.06)]
                                                    transition-all duration-200`,children:p?a.jsxs("span",{className:"flex items-center justify-center gap-2",children:[a.jsxs("svg",{className:"animate-spin h-4 w-4",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[a.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),a.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Guardando..."]}):"Guardar contraseña"}),a.jsx(u,{show:d,enter:"transition ease-out duration-200",enterFrom:"opacity-0 scale-95 translate-y-1",leave:"transition ease-in duration-150",leaveTo:"opacity-0 scale-95 translate-y-1",children:a.jsx("div",{className:`bg-gradient-to-b from-green-50 to-green-100/50 
                                                    px-3 py-1.5 rounded-md
                                                    shadow-[0_1px_3px_rgba(0,0,0,0.06),0_2px_6px_rgba(34,197,94,0.1),inset_0_1px_0_rgba(255,255,255,0.6)]`,children:a.jsxs("p",{className:"text-sm font-medium text-green-700 flex items-center gap-1.5",children:[a.jsx("svg",{className:"h-4 w-4 flex-shrink-0",fill:"none",viewBox:"0 0 24 24",strokeWidth:2.5,stroke:"currentColor",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"})}),a.jsx("span",{children:"Contraseña actualizada"})]})})})]})]})})})]})})})]})}export{I as default};
