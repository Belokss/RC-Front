import{g as d,b as m,s as p,_ as a,r as i,d as y,e as L,L as b,j as x,f as S,h as A}from"./index-B7pbG10J.js";function I(t){return m("MuiListItemSecondaryAction",t)}d("MuiListItemSecondaryAction",["root","disableGutters"]);const f=["className"],C=t=>{const{disableGutters:s,classes:e}=t;return A({root:["root",s&&"disableGutters"]},I,e)},G=p("div",{name:"MuiListItemSecondaryAction",slot:"Root",overridesResolver:(t,s)=>{const{ownerState:e}=t;return[s.root,e.disableGutters&&s.disableGutters]}})(({ownerState:t})=>a({position:"absolute",right:16,top:"50%",transform:"translateY(-50%)"},t.disableGutters&&{right:0})),g=i.forwardRef(function(s,e){const o=y({props:s,name:"MuiListItemSecondaryAction"}),{className:n}=o,c=L(o,f),l=i.useContext(b),r=a({},o,{disableGutters:l.disableGutters}),u=C(r);return x.jsx(G,a({className:S(u.root,n),ownerState:r,ref:e},c))});g.muiName="ListItemSecondaryAction";export{g as L};
