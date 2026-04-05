import { useState, useEffect } from "react";

const LT_C = {
  bg:"#FFFFFF",bg2:"#F2F2F7",bg3:"#E5E5EA",fill:"#E5E5EA",
  blue:"#007AFF",green:"#34C759",red:"#FF3B30",orange:"#FF9500",
  yellow:"#FFCC00",purple:"#AF52DE",cyan:"#32ADE6",
  t1:"#000000",t2:"#3C3C4399",t3:"#3C3C434D",sep:"#C6C6C8",
  shadow:"0 0 0 1px #E5E5EA, 0 20px 60px rgba(0,0,0,0.12)",tabBg:"rgba(249,249,249,0.85)",
  // Pro design tokens
  meshBg:"radial-gradient(ellipse at 20% 0%, rgba(0,122,255,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(52,199,89,0.03) 0%, transparent 50%)",
  heroGlass:"rgba(255,255,255,0.7)",heroBorder:"rgba(255,255,255,0.8)",heroShadow:"0 2px 20px rgba(0,0,0,0.04)",
  cardShadow:"0 1px 8px rgba(0,0,0,0.03)",
  tabBlur:"saturate(180%) blur(20px)",
};
const DK_C = {
  bg:"#000000",bg2:"#1C1C1E",bg3:"#2C2C2E",fill:"#3A3A3C",
  blue:"#0A84FF",green:"#30D158",red:"#FF453A",orange:"#FF9F0A",
  yellow:"#FFD60A",purple:"#BF5AF2",cyan:"#64D2FF",
  t1:"#FFFFFF",t2:"#EBEBF5CC",t3:"#EBEBF54D",sep:"#38383A",
  shadow:"0 0 0 1px #38383A, 0 20px 60px rgba(0,0,0,0.6)",tabBg:"rgba(28,28,30,0.85)",
  meshBg:"radial-gradient(ellipse at 20% 0%, rgba(10,132,255,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 100%, rgba(48,209,88,0.04) 0%, transparent 50%)",
  heroGlass:"rgba(28,28,30,0.6)",heroBorder:"rgba(255,255,255,0.08)",heroShadow:"0 2px 20px rgba(0,0,0,0.2)",
  cardShadow:"0 1px 8px rgba(0,0,0,0.15)",
  tabBlur:"saturate(180%) blur(20px)",
};
const FF="-apple-system,'SF Pro Display',system-ui,sans-serif";
const scr={height:720,overflowY:"auto",overflowX:"hidden",paddingBottom:120};

// ── Data ──
// Exchange rates per date (USD/JPY) - in production, fetched from API
const FX_RATES={"2026-04-04":149.50,"2026-04-03":149.82,"2026-03-31":148.95,"2026-03-28":149.20,"2026-03-25":150.10,"2026-03-24":149.75,"2026-03-20":148.60,"2026-03-29":149.30,"2026-03-27":149.55,"2026-03-26":149.40};
const DEFAULT_RATE=149.50;
function getRate(dateStr){
  // Convert "4月4日" or "2026年4月4日" to "2026-04-04"
  const m=dateStr.match(/(\d{4})?年?(\d{1,2})月(\d{1,2})日/);
  if(m){const y=m[1]||"2026";const key=`${y}-${m[2].padStart(2,"0")}-${m[3].padStart(2,"0")}`;return FX_RATES[key]||DEFAULT_RATE;}
  return DEFAULT_RATE;
}
function toJPY(amt,currency,dateStr){if(currency==="JPY")return amt;return Math.round(amt*getRate(dateStr));}

const incD=[
  {id:101,name:"給与",amt:280000,method:"振込",tag:"給与",date:"3月25日",icon:"💰",currency:"JPY"},
  {id:102,name:"副業報酬",amt:85000,method:"振込",tag:"副業",date:"4月3日",icon:"💼",currency:"JPY"},
  {id:103,name:"配当金",amt:12500,method:"証券",tag:"投資",date:"3月31日",icon:"📈",currency:"JPY"},
  {id:104,name:"アプリ収益",amt:3200,method:"振込",tag:"副業",date:"3月28日",icon:"📱",currency:"JPY"},
  {id:105,name:"ポイント換金",amt:1500,method:"電子マネー",tag:"その他",date:"3月20日",icon:"🎁",currency:"JPY"},
  {id:106,name:"海外案件報酬",amt:500,method:"PayPal",tag:"副業",date:"4月3日",icon:"🌐",currency:"USD"},
];
const expD=[
  {id:1,name:"コンビニ",amt:-680,method:"PayPay",tag:"食費",date:"4月4日",type:"variable",icon:"🍙",currency:"JPY"},
  {id:2,name:"Netflix",amt:-1490,method:"クレカ",tag:"サブスク",date:"4月1日",type:"fixed",icon:"🎬",currency:"JPY"},
  {id:3,name:"電気代",amt:-8500,method:"引落",tag:"光熱費",date:"4月1日",type:"fixed",icon:"⚡",currency:"JPY"},
  {id:4,name:"ランチ",amt:-1200,method:"現金",tag:"食費",date:"3月30日",type:"variable",icon:"🍽",currency:"JPY"},
  {id:5,name:"Suica",amt:-5000,method:"クレカ",tag:"交通費",date:"3月29日",type:"variable",icon:"🚃",currency:"JPY"},
  {id:6,name:"家賃",amt:-85000,method:"引落",tag:"住居費",date:"3月27日",type:"fixed",icon:"🏠",currency:"JPY"},
  {id:7,name:"Amazon US",amt:-29.99,method:"クレカ",tag:"娯楽費",date:"3月24日",type:"variable",icon:"📦",currency:"USD"},
  {id:8,name:"スマホ代",amt:-4800,method:"引落",tag:"通信費",date:"3月26日",type:"fixed",icon:"📱",currency:"JPY"},
];
const subsD=[
  {id:1,name:"Netflix",amt:1490,next:"5月1日",card:"三井住友",icon:"🎬",cycle:"月額"},
  {id:2,name:"Spotify",amt:980,next:"4月15日",card:"楽天",icon:"🎵",cycle:"月額"},
  {id:3,name:"iCloud+",amt:400,next:"4月20日",card:"三井住友",icon:"☁️",cycle:"月額"},
  {id:4,name:"ChatGPT Plus",amt:3000,next:"4月22日",card:"楽天",icon:"🤖",cycle:"月額"},
  {id:5,name:"Adobe CC",amt:6480,next:"5月5日",card:"三井住友",icon:"🎨",cycle:"月額"},
];
const cardsD=[
  {id:1,name:"三井住友カード",last4:"4521",bal:145000,lim:500000,cd:15,pd:10,color:"#00A650"},
  {id:2,name:"楽天カード",last4:"8832",bal:68000,lim:300000,cd:25,pd:27,color:"#BF0000"},
];
const schedD=[
  {id:1,name:"結婚式（友人）",amt:300000,date:"2026年8月10日",days:128,icon:"💒",memo:"ご祝儀＋交通費"},
  {id:2,name:"車検",amt:120000,date:"2026年11月",days:210,icon:"🚗",memo:"ディーラー見積もり"},
  {id:3,name:"引越し費用",amt:350000,date:"2027年3月",days:335,icon:"📦",memo:"敷金・礼金・仲介料"},
];
const loanD=[
  {id:1,name:"住宅ローン",principal:35000000,rate:0.475,years:35,start:"2025年4月",icon:"🏠",bank:"三井住友銀行"},
  {id:2,name:"自動車ローン",principal:3000000,rate:1.9,years:5,start:"2025年10月",icon:"🚗",bank:"楽天銀行"},
];
function calcMonthly(p,r,y){if(r===0)return Math.round(p/(y*12));const mr=r/100/12;const n=y*12;return Math.round(p*mr*Math.pow(1+mr,n)/(Math.pow(1+mr,n)-1));}
function calcTotal(p,r,y){return calcMonthly(p,r,y)*y*12;}
const actD=[
  {m:"11月",inc:365000,exp:280000},{m:"12月",inc:520000,exp:340000},
  {m:"1月",inc:380000,exp:285000},{m:"2月",inc:355000,exp:270000},
  {m:"3月",inc:420000,exp:310000},{m:"4月",inc:195000,exp:148000},
];
const fcD=[
  {m:"5月",inc:390000,exp:295000},{m:"6月",inc:385000,exp:290000},
  {m:"7月",inc:395000,exp:300000},{m:"8月",inc:390000,exp:595000},
  {m:"9月",inc:400000,exp:285000},{m:"10月",inc:395000,exp:290000},
  {m:"11月",inc:385000,exp:285000},{m:"12月",inc:530000,exp:350000},
  {m:"1月",inc:390000,exp:290000},{m:"2月",inc:385000,exp:285000},
  {m:"3月",inc:395000,exp:295000},{m:"4月",inc:390000,exp:290000},
];

// ── HIG Primitives (theme via c prop) ──
function SB({c}){const f=c.t1;return <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 24px 0",fontSize:15,fontWeight:600,color:f}}><span>9:41</span><div style={{width:126,height:34,background:c===LT_C?"#fff":"#000",borderRadius:22,position:"absolute",left:"50%",transform:"translateX(-50%)",top:6}}/><div style={{display:"flex",gap:5,alignItems:"center"}}><svg width="16" height="12" viewBox="0 0 16 12" fill={f}><rect x="0" y="3" width="3" height="9" rx="1"/><rect x="4.5" y="1.5" width="3" height="10.5" rx="1"/><rect x="9" y="0" width="3" height="12" rx="1"/><rect x="13.5" y="3" width="2.5" height="9" rx="1" opacity="0.3"/></svg><svg width="24" height="12" viewBox="0 0 24 12"><rect x="0" y="0" width="22" height="12" rx="3" fill="none" stroke={f} strokeWidth="1" opacity="0.35"/><rect x="23" y="3.5" width="1.5" height="5" rx="0.5" fill={f} opacity="0.35"/><rect x="1.5" y="1.5" width="14" height="9" rx="1.5" fill={c.green}/></svg></div></div>;}

// HIG: Large Title with month nav (Clarity principle - clear hierarchy)
function LgT({title,sub,c,nav}){return <div style={{padding:"8px 20px 12px"}}>{sub&&<div style={{display:"flex",alignItems:"center",gap:8}}>{nav&&<span onClick={nav.prev} style={{fontSize:22,color:c.blue,cursor:"pointer",minWidth:44,minHeight:44,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:300}}>‹</span>}<span style={{fontSize:13,color:c.t2,fontWeight:400,flex:1,textAlign:nav?"center":"left"}}>{sub}</span>{nav&&<span onClick={nav.next} style={{fontSize:22,color:c.blue,cursor:"pointer",minWidth:44,minHeight:44,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:300}}>›</span>}</div>}<div style={{fontSize:34,fontWeight:700,letterSpacing:0.4,lineHeight:1.1,color:c.t1}}>{title}</div></div>;}

// HIG: Nav bar with back chevron (Depth principle - stack navigation)
function NvB({title,onBack,c,rightAction}){return <div style={{display:"flex",alignItems:"center",padding:"8px 12px 12px 20px",gap:4}}><div onClick={onBack} style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer",minHeight:44,minWidth:44}}><svg width="12" height="20" viewBox="0 0 12 20" fill="none"><path d="M10 2L2 10L10 18" stroke={c.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg><span style={{fontSize:17,color:c.blue}}>戻る</span></div><div style={{flex:1,textAlign:"center",fontSize:17,fontWeight:600,color:c.t1}}>{title}</div>{rightAction?<div onClick={rightAction.action} style={{minWidth:60,textAlign:"right",cursor:"pointer",minHeight:44,display:"flex",alignItems:"center",justifyContent:"flex-end"}}><span style={{fontSize:17,color:c.blue}}>{rightAction.label}</span></div>:<div style={{width:60}}/>}</div>;}

// HIG: Tab Bar with SVG icons (filled=active, outline=inactive)
const TBIcons={
  income:(a,cl)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill={a?cl:"none"} stroke={a?"none":cl} strokeWidth="1.5"/><path d="M12 8v8M8 12l4 4 4-4" stroke={a?"#fff":cl} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  expense:(a,cl)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="3" fill={a?cl:"none"} stroke={a?"none":cl} strokeWidth="1.5"/><path d="M2 10h20" stroke={a?"#fff":cl} strokeWidth="1.5"/><path d="M6 15h4" stroke={a?"#fff":cl} strokeWidth="1.5" strokeLinecap="round"/></svg>,
  analysis:(a,cl)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="12" width="4" height="8" rx="1" fill={a?cl:"none"} stroke={a?"none":cl} strokeWidth="1.5"/><rect x="10" y="6" width="4" height="14" rx="1" fill={a?cl:"none"} stroke={a?"none":cl} strokeWidth="1.5"/><rect x="17" y="2" width="4" height="18" rx="1" fill={a?cl:"none"} stroke={a?"none":cl} strokeWidth="1.5"/></svg>,
  settings:(a,cl)=><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" fill={a?cl:"none"} stroke={a?"none":cl} strokeWidth="1.5"/><path d="M12 1v3M12 20v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M1 12h3M20 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke={cl} strokeWidth="1.5" strokeLinecap="round"/></svg>,
};
function TBar({active,go,c}){return <div style={{position:"absolute",bottom:0,left:0,right:0,height:83,background:c.tabBg,backdropFilter:c.tabBlur,WebkitBackdropFilter:c.tabBlur,borderTop:`0.5px solid ${c.sep}`,display:"flex",justifyContent:"space-around",alignItems:"stretch",paddingBottom:20}}>{[{id:"income",l:"収入",k:"income"},{id:"expense",l:"支出",k:"expense"},{id:"analysis",l:"分析",k:"analysis"},{id:"settings",l:"設定",k:"settings"}].map(t=>{const a=active===t.id;const cl=a?c.blue:c.t3;return <div key={t.id} onClick={()=>go(t.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",minWidth:44,minHeight:44,flex:1,gap:2,paddingTop:6}}>{TBIcons[t.k](a,cl)}<span style={{fontSize:10,fontWeight:500,color:cl}}>{t.l}</span></div>;})}</div>;}

// HIG: Grouped section (Deference - content grouping)
function Sc({header,c,children,footer}){return <div style={{margin:"0 16px 16px"}}>{header&&<div style={{fontSize:13,color:c.t2,fontWeight:400,padding:"8px 4px 6px",textTransform:"uppercase",letterSpacing:0.5}}>{header}</div>}<div style={{background:c.bg2,borderRadius:12,overflow:"hidden",boxShadow:c.cardShadow}}>{children}</div>{footer&&<div style={{fontSize:13,color:c.t2,padding:"6px 4px 0"}}>{footer}</div>}</div>;}

// HIG: Table row (44pt touch target guaranteed)
function Rw({icon,iconBg,title,subtitle,right,rightColor,last,onClick,badge,c,badgeColor,rightSub}){return <div onClick={onClick} style={{display:"flex",alignItems:"center",padding:"0 16px",minHeight:44,cursor:onClick?"pointer":"default",borderBottom:last?"none":`0.5px solid ${c.sep}`}}>{icon&&<div style={{width:30,height:30,borderRadius:8,background:iconBg||c.fill,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,marginRight:12,flexShrink:0}}>{icon}</div>}<div style={{flex:1,padding:"10px 0"}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:17,fontWeight:400,color:c.t1}}>{title}</span>{badge&&<span style={{fontSize:11,fontWeight:500,color:badgeColor||c.cyan,background:`${badgeColor||c.cyan}22`,padding:"1px 6px",borderRadius:6}}>{badge}</span>}</div>{subtitle&&<div style={{fontSize:13,color:c.t2,marginTop:1}}>{subtitle}</div>}</div><div style={{marginLeft:8,flexShrink:0,textAlign:"right"}}>{right&&<span style={{fontSize:17,fontWeight:400,color:rightColor||c.t1,display:"block"}}>{right}</span>}{rightSub&&<span style={{fontSize:11,color:c.t2,display:"block",marginTop:1}}>{rightSub}</span>}</div>{onClick&&<svg width="8" height="14" viewBox="0 0 8 14" fill="none" style={{marginLeft:6,flexShrink:0}}><path d="M1 1L7 7L1 13" stroke={c.t3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div>;}

// HIG: Segmented control
function Sg({opts,active,onChange,c}){return <div style={{display:"flex",margin:"0 16px 12px",background:c.fill,borderRadius:12,padding:2}}>{opts.map(([k,lb])=><div key={k} onClick={()=>onChange(k)} style={{flex:1,padding:"7px 0",borderRadius:10,textAlign:"center",fontSize:13,fontWeight:active===k?600:400,cursor:"pointer",background:active===k?c.bg:"transparent",color:active===k?c.t1:c.t2,transition:"all 0.15s"}}>{lb}</div>)}</div>;}

// OOUI: FAB for object creation (not a separate tab)
function FAB({onClick,color}){return <div onClick={onClick} style={{position:"absolute",right:20,bottom:96,width:56,height:56,borderRadius:28,background:color,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",zIndex:10,boxShadow:`0 4px 20px ${color}55, 0 2px 8px rgba(0,0,0,0.12)`,transition:"transform 0.15s",":hover":{transform:"scale(1.05)"}}}><svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 4V20M4 12H20" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/></svg></div>;}

// Chart bars (barW: customizable bar width for progressive disclosure)
function Bars({data,dashed,start=0,count=6,c,barW=16}){const sl=data.slice(start,start+count);const mx=Math.max(...sl.map(d=>Math.max(d.inc,d.exp)),1);return <div style={{display:"flex",alignItems:"flex-end",gap:6,height:140,padding:"0 4px"}}>{sl.map((d,i)=>{const iH=(d.inc/mx)*100,eH=(d.exp/mx)*100,net=d.inc-d.exp;return <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center"}}><div style={{fontSize:10,color:net>=0?c.green:c.red,fontWeight:500,marginBottom:3}}>{net>=0?"+":""}{Math.round(net/10000)}万</div><div style={{display:"flex",gap:2,alignItems:"flex-end",height:100}}><div style={{width:barW,height:iH,background:dashed?`${c.blue}44`:`linear-gradient(to top, ${c.blue}, ${c.blue}BB)`,borderRadius:"5px 5px 0 0",border:dashed?`1px dashed ${c.blue}88`:"none",transition:"all 0.4s ease"}}/><div style={{width:barW,height:eH,background:dashed?`${c.red}33`:`linear-gradient(to top, ${c.red}DD, ${c.red}88)`,borderRadius:"5px 5px 0 0",border:dashed?`1px dashed ${c.red}66`:"none",transition:"all 0.4s ease"}}/></div><div style={{fontSize:10,color:c.t2,marginTop:4}}>{d.m}</div></div>;})}</div>;}

function Legend({c}){return <div style={{display:"flex",gap:20,justifyContent:"center",marginTop:12}}>{[["収入",c.blue],["支出",c.red]].map(([l,cl])=><div key={l} style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:10,height:10,borderRadius:3,background:cl,opacity:0.8}}/><span style={{fontSize:13,color:c.t2}}>{l}</span></div>)}</div>;}

// ── Login ──
function Login({go,c}){return <div style={{padding:"100px 24px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",position:"relative",overflow:"hidden"}}>
  <div style={{position:"absolute",top:60,right:-30,width:100,height:100,borderRadius:50,background:`${c.blue}06`}}/>
  <div style={{position:"absolute",bottom:120,left:-20,width:80,height:80,borderRadius:40,background:`${c.purple}05`}}/>
  <div style={{position:"relative",zIndex:1,width:"100%",display:"flex",flexDirection:"column",alignItems:"center"}}>
    <div style={{width:80,height:80,borderRadius:22,background:`linear-gradient(135deg, ${c.blue}, ${c.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40,marginBottom:24,boxShadow:`0 12px 36px ${c.blue}33`}}>💰</div>
    <div style={{fontSize:30,fontWeight:700,color:c.t1,letterSpacing:-0.3}}>あなたのCFO</div>
    <div style={{fontSize:15,color:c.t2,marginTop:8,marginBottom:48}}>お金の流れを、完全に把握する</div>
    <div onClick={go} style={{width:"100%",padding:16,background:c.t1,borderRadius:14,textAlign:"center",cursor:"pointer",marginBottom:10,minHeight:48,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 12px rgba(0,0,0,0.1)"}}><span style={{color:c.bg,fontWeight:600,fontSize:17}}>Appleでサインイン</span></div>
    <div onClick={go} style={{width:"100%",padding:16,background:c.heroGlass,borderRadius:14,textAlign:"center",cursor:"pointer",marginBottom:10,border:`0.5px solid ${c.sep}`,minHeight:48,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)"}}><span style={{color:c.t1,fontWeight:600,fontSize:17}}>Googleでサインイン</span></div>
    <div onClick={go} style={{marginTop:16,cursor:"pointer",minHeight:44,display:"flex",alignItems:"center"}}><span style={{fontSize:17,color:c.blue}}>ゲストで始める</span></div>
    <div style={{fontSize:12,color:c.t2,marginTop:6,textAlign:"center"}}>後からアカウントを作成できます</div>
  </div>
</div>;}

// ══ Tab 1: 収入 (OOUI: Collection → Single → Action) ══
function IncList({onSelect,onAdd,c}){
  const [f,sf]=useState("all");
  const fd=f==="all"?incD:incD.filter(t=>t.tag===f);
  const tI=incD.reduce((a,b)=>a+toJPY(b.amt,b.currency||"JPY",b.date),0);
  const tE=expD.reduce((a,b)=>a+toJPY(Math.abs(b.amt),b.currency||"JPY",b.date),0);
  const net=tI-tE;
  const hasUsd=incD.some(t=>t.currency==="USD");
  return <div style={scr}>
    <LgT title="収入" sub="2026年4月" c={c} nav={{prev:()=>{},next:()=>{}}}/>
    {/* OOUI: Object state visible in collection — net CF shows overall health */}
    <div style={{display:"flex",gap:8,margin:"0 16px 12px"}}>
      <div style={{flex:1,padding:"12px 14px",borderRadius:12,background:c.heroGlass,backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",border:`0.5px solid ${c.heroBorder}`,boxShadow:c.cardShadow}}>
        <div style={{fontSize:11,color:c.green,fontWeight:500}}>収入合計{hasUsd?" (円換算)":""}</div>
        <div style={{fontSize:22,fontWeight:500,color:c.t1,marginTop:2}}>¥{tI.toLocaleString()}</div>
      </div>
      <div style={{flex:1,padding:"12px 14px",borderRadius:12,background:net>=0?`${c.green}10`:`${c.red}10`,border:`0.5px solid ${net>=0?`${c.green}22`:`${c.red}22`}`,boxShadow:c.cardShadow}}>
        <div style={{fontSize:11,color:net>=0?c.green:c.red,fontWeight:500}}>純CF</div>
        <div style={{fontSize:22,fontWeight:500,color:c.t1,marginTop:2}}>{net>=0?"+":""}¥{net.toLocaleString()}</div>
      </div>
    </div>
    {/* OOUI: Filter by object property */}
    <div style={{display:"flex",gap:5,margin:"0 16px 12px",overflowX:"auto"}}>
      {[["all","すべて"],["給与","給与"],["副業","副業"],["投資","投資"],["その他","その他"]].map(([k,lb])=>(
        <div key={k} onClick={()=>sf(k)} style={{padding:"6px 14px",borderRadius:8,fontSize:13,fontWeight:f===k?600:400,cursor:"pointer",background:f===k?`${c.green}22`:"transparent",color:f===k?c.green:c.t3,border:`0.5px solid ${f===k?`${c.green}44`:c.sep}`,whiteSpace:"nowrap"}}>{lb}</div>
      ))}
    </div>
    {/* OOUI: Collection view with badge showing category */}
    <Sc c={c}>
      {fd.map((t,i)=>{const cur=t.currency||"JPY";const sym=cur==="USD"?"$":"¥";const jpyAmt=toJPY(t.amt,cur,t.date);
        return <Rw key={t.id} c={c} icon={t.icon} iconBg={`${c.green}22`} title={t.name}
          subtitle={`${t.method} · ${t.date}${cur==="USD"?` · ¥${jpyAmt.toLocaleString()}換算`:""}`}
          badge={cur==="USD"?"USD":t.tag} badgeColor={cur==="USD"?c.purple:c.green}
          right={`+${sym}${t.amt.toLocaleString()}`} rightColor={c.green}
          rightSub={cur==="USD"?`@${getRate(t.date)} JPY/USD`:undefined}
          last={i===fd.length-1} onClick={()=>onSelect(t)}/>;
      })}
    </Sc>
    <FAB onClick={onAdd} color={c.green}/>
  </div>;
}

// OOUI: Single view — properties + actions (名詞→動詞)
function IncDetail({item,onBack,c}){const cur=item.currency||"JPY";const sym=cur==="USD"?"$":"¥";const jpyAmt=toJPY(item.amt,cur,item.date);
return <div style={scr}>
  <NvB title="収入詳細" onBack={onBack} c={c} rightAction={{label:"編集",action:()=>{}}}/>
  <div style={{textAlign:"center",padding:"16px 0 24px"}}>
    <div style={{width:72,height:72,borderRadius:20,background:`${c.green}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,margin:"0 auto",boxShadow:`0 8px 24px ${c.green}22`}}>{item.icon}</div>
    <div style={{fontSize:22,fontWeight:600,color:c.t1,marginTop:12}}>{item.name}</div>
    <div style={{fontSize:36,fontWeight:500,color:c.green,marginTop:8}}>+{sym}{item.amt.toLocaleString()}</div>
    {cur==="USD"&&<div style={{fontSize:15,color:c.t2,marginTop:4}}>≒ ¥{jpyAmt.toLocaleString()} <span style={{fontSize:11,color:c.t2}}>(@{getRate(item.date)})</span></div>}
  </div>
  {/* OOUI: Complete property display including currency */}
  <Sc header="プロパティ" c={c}>
    {[["受取方法",item.method],["カテゴリ",item.tag],["日付",item.date],["通貨",cur],
      ...(cur==="USD"?[["適用レート",`¥${getRate(item.date)} / USD`],["円換算額",`¥${jpyAmt.toLocaleString()}`]]:[])
    ].map(([l,v],i,arr)=>(
      <Rw key={i} c={c} title={l} right={v} rightColor={l==="円換算額"?c.green:c.t2} last={i===arr.length-1}/>))}
  </Sc>
  <Sc header="アクション" c={c} footer="オブジェクトを選択してからアクションを実行">
    {[["複製",c.blue],["削除",c.red]].map(([lb,cl],i)=>(
      <Rw key={i} c={c} title={lb} rightColor={cl} last={i===1} onClick={()=>{}}/>))}
  </Sc>
</div>;}

function IncNew({onBack,c}){
  const [cur,setCur]=useState("JPY");
  const [amt,setAmt]=useState("0");
  const rate=getRate("4月4日");
  const numAmt=Number(amt)||0;
  const jpyAmt=cur==="USD"?Math.round(numAmt*rate):numAmt;
  return <div style={scr}>
  <NvB title="新しい収入" onBack={onBack} c={c} rightAction={{label:"完了",action:onBack}}/>
  <div style={{textAlign:"center",padding:"8px 0 4px"}}>
    <div style={{fontSize:11,color:c.t2,marginBottom:4}}>金額をタップして入力</div>
    <div style={{fontSize:48,fontWeight:200,color:c.green}}>{cur==="USD"?"$":"¥"}{numAmt.toLocaleString()}</div>
    {cur==="USD"&&numAmt>0&&<div style={{fontSize:15,color:c.t2,marginTop:2}}>≒ ¥{jpyAmt.toLocaleString()} <span style={{fontSize:11,color:c.t3}}>(@{rate})</span></div>}
  </div>
  <div style={{display:"flex",justifyContent:"center",gap:8,padding:"4px 0 16px"}}>
    {["JPY","USD"].map(v=>(
      <div key={v} onClick={()=>setCur(v)} style={{padding:"6px 18px",borderRadius:8,fontSize:13,fontWeight:cur===v?600:400,cursor:"pointer",background:cur===v?`${c.blue}22`:"transparent",color:cur===v?c.blue:c.t3,border:`0.5px solid ${cur===v?`${c.blue}44`:c.sep}`}}>
        {v==="JPY"?"🇯🇵 JPY":"🇺🇸 USD"}
      </div>
    ))}
  </div>
  <Sc c={c}>{[{l:"受取方法",v:"🏦 銀行振込"},{l:"カテゴリ",v:"💼 副業収入"},{l:"日付",v:"2026年4月4日"},
    ...(cur==="USD"?[{l:"適用レート",v:`¥${rate} / USD（自動取得）`}]:[]),
    {l:"メモ",v:"タップして入力"}].map((f,i,arr)=>(
    <Rw key={i} c={c} title={f.l} right={f.v} rightColor={f.l==="適用レート"?c.purple:c.t2} last={i===arr.length-1} onClick={()=>{}}/>
  ))}</Sc>
  {cur==="USD"&&<div style={{margin:"0 16px 8px",padding:"8px 12px",borderRadius:8,background:`${c.purple}11`,border:`0.5px solid ${c.purple}22`}}>
    <div style={{fontSize:11,color:c.purple}}>為替レートは入力日のレートを自動で取得します。保存後の円換算額は ¥{jpyAmt.toLocaleString()} です。</div>
  </div>}
</div>;}

// ══ Tab 2: 支出 (OOUI: Sub-objects via Segmented) ══
function ExpTab({onSelect,onAdd,onSubSelect,onLoanSelect,c}){
  const [seg,setSeg]=useState("list");
  const [ef,setEf]=useState("all");
  const total=expD.reduce((a,b)=>a+toJPY(Math.abs(b.amt),b.currency||"JPY",b.date),0);
  const subT=subsD.reduce((a,b)=>a+b.amt,0);
  const loanMonthly=loanD.reduce((a,b)=>a+calcMonthly(b.principal,b.rate,b.years),0);
  const schT=schedD.reduce((a,b)=>a+b.amt,0);
  const fd=ef==="all"?expD:ef==="fixed"?expD.filter(t=>t.type==="fixed"):expD.filter(t=>t.type==="variable");
  const hasUsd=expD.some(t=>t.currency==="USD");
  return <div style={scr}>
    <LgT title="支出" sub="2026年4月" c={c} nav={{prev:()=>{},next:()=>{}}}/>
    <div style={{display:"flex",gap:6,margin:"0 16px 12px"}}>
      <div style={{flex:1,padding:"12px 12px",borderRadius:12,background:c.heroGlass,backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",border:`0.5px solid ${c.heroBorder}`,boxShadow:c.cardShadow}}>
        <div style={{fontSize:11,color:c.red,fontWeight:500}}>今月の支出{hasUsd?" (円換算)":""}</div>
        <div style={{fontSize:20,fontWeight:500,color:c.t1,marginTop:2}}>¥{total.toLocaleString()}</div>
      </div>
      {(()=>{const lastMonth=310000;const diff=total-lastMonth;const pct=Math.round((diff/lastMonth)*100);const up=diff>0;
        return <div style={{flex:1,padding:"10px 10px",borderRadius:10,background:up?`${c.red}10`:`${c.green}10`,border:`0.5px solid ${up?`${c.red}22`:`${c.green}22`}`}}>
        <div style={{fontSize:11,color:up?c.red:c.green,fontWeight:500}}>前月比</div>
        <div style={{fontSize:18,fontWeight:300,color:c.t1,marginTop:2}}>{up?"+":""}¥{diff.toLocaleString()}</div>
        <div style={{fontSize:11,color:up?c.red:c.green,marginTop:1}}>{up?"↑":"↓"}{Math.abs(pct)}%</div>
      </div>;})()}
    </div>
    {/* Segmented: 定期 now contains subs + loans */}
    <Sg opts={[["list","一覧"],["recurring","定期"],["cards","カード"],["sched","予定"]]} active={seg} onChange={setSeg} c={c}/>

    {seg==="list"&&<>
      <div style={{display:"flex",gap:5,margin:"0 16px 12px",overflowX:"auto"}}>
        {[["all","すべて"],["fixed","固定費"],["variable","変動費"]].map(([k,lb])=>(
          <div key={k} onClick={()=>setEf(k)} style={{padding:"6px 14px",borderRadius:8,fontSize:13,fontWeight:ef===k?600:400,cursor:"pointer",background:ef===k?`${c.red}1A`:"transparent",color:ef===k?c.red:c.t3,border:`0.5px solid ${ef===k?`${c.red}33`:c.sep}`,whiteSpace:"nowrap"}}>{lb}</div>))}
      </div>
      <Sc c={c}>{fd.map((t,i)=>{const cur=t.currency||"JPY";const sym=cur==="USD"?"$":"¥";const absAmt=Math.abs(t.amt);const jpyAmt=toJPY(absAmt,cur,t.date);
        return <Rw key={t.id} c={c} icon={t.icon} iconBg={t.type==="fixed"?`${c.cyan}22`:`${c.red}15`} title={t.name}
        subtitle={`${t.method} · ${t.tag} · ${t.date}${cur==="USD"?` · ¥${jpyAmt.toLocaleString()}換算`:""}`} badge={cur==="USD"?"USD":t.type==="fixed"?"固定":null}
        badgeColor={cur==="USD"?c.purple:undefined}
        right={`${sym}${absAmt.toLocaleString()}`}
        rightSub={cur==="USD"?`@${getRate(t.date)}`:undefined}
        last={i===fd.length-1} onClick={()=>onSelect(t)}/>;})}</Sc>
    </>}

    {/* recurring: subscriptions + loans in one segment */}
    {seg==="recurring"&&<>
      {/* Combined total for the recurring segment */}
      <div style={{margin:"0 16px 12px",padding:"14px 16px",borderRadius:14,background:c.heroGlass,backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",border:`0.5px solid ${c.heroBorder}`,boxShadow:c.cardShadow}}>
        <div style={{fontSize:11,color:c.cyan,fontWeight:500,letterSpacing:0.3}}>定期支出 合計</div>
        <div style={{fontSize:24,fontWeight:500,color:c.t1,marginTop:4}}>¥{(subT+loanMonthly).toLocaleString()}<span style={{fontSize:14,color:c.t2,fontWeight:400}}>/月</span></div>
        <div style={{display:"flex",gap:12,marginTop:6}}>
          <span style={{fontSize:12,color:c.purple}}>サブスク ¥{subT.toLocaleString()}</span>
          <span style={{fontSize:12,color:c.orange}}>ローン ¥{loanMonthly.toLocaleString()}</span>
        </div>
      </div>
      <Sc header={`サブスク ${subsD.length}件 · ¥${subT.toLocaleString()}/月`} c={c}>
        {subsD.map((s,i)=>(<Rw key={s.id} c={c} icon={s.icon} iconBg={`${c.purple}22`} title={s.name}
          subtitle={`${s.card} · ${s.cycle}`} right={`¥${s.amt.toLocaleString()}`}
          rightSub={`次回 ${s.next}`}
          last={i===subsD.length-1} onClick={()=>onSubSelect(s)}/>))}
      </Sc>
      <Sc header={`ローン ${loanD.length}件 · ¥${loanMonthly.toLocaleString()}/月`} c={c}>
        {loanD.map((lo,i)=>{const mo=calcMonthly(lo.principal,lo.rate,lo.years);const tot=calcTotal(lo.principal,lo.rate,lo.years);const interest=tot-lo.principal;
          return <Rw key={lo.id} c={c} icon={lo.icon} iconBg={`${c.orange}22`} title={lo.name}
            subtitle={`${lo.bank} · ${lo.rate}% · ${lo.years}年`}
            right={`¥${mo.toLocaleString()}/月`} rightColor={c.orange}
            rightSub={`総額 ¥${Math.round(tot/10000).toLocaleString()}万`}
            badge={`金利${lo.rate}%`} badgeColor={c.orange}
            last={i===loanD.length-1} onClick={()=>onLoanSelect(lo)}/>;
        })}
      </Sc>
    </>}

    {seg==="cards"&&<>{cardsD.map(cc=>(<div key={cc.id} style={{margin:"0 16px 16px"}}>
      <div style={{background:`linear-gradient(135deg, ${cc.color}CC, ${cc.color}77)`,borderRadius:14,padding:20,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-30,right:-30,width:120,height:120,borderRadius:60,background:"rgba(255,255,255,0.07)"}}/>
        <div style={{position:"absolute",bottom:-20,left:-20,width:80,height:80,borderRadius:40,background:"rgba(255,255,255,0.04)"}}/>
        <div style={{position:"absolute",top:20,right:60,width:40,height:40,borderRadius:20,background:"rgba(255,255,255,0.03)"}}/>
        <div style={{fontSize:13,color:"#ffffffBB",marginBottom:14}}>{cc.name}</div>
        <div style={{fontSize:18,fontWeight:300,letterSpacing:4,color:"#fff",marginBottom:16}}>•••• •••• •••• {cc.last4}</div>
        <div style={{display:"flex",justifyContent:"space-between"}}>
          <div><div style={{fontSize:11,color:"#ffffff99"}}>利用額</div><div style={{fontSize:20,fontWeight:400,color:"#fff"}}>¥{cc.bal.toLocaleString()}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:11,color:"#ffffff99"}}>締日/支払日</div><div style={{fontSize:15,color:"#fff"}}>{cc.cd}日 / {cc.pd}日</div></div>
        </div>
      </div>
      <div style={{padding:"8px 4px 0"}}><div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:c.t2,marginBottom:4}}><span>利用率 {Math.round(cc.bal/cc.lim*100)}%</span><span>限度額 ¥{cc.lim.toLocaleString()}</span></div><div style={{height:6,background:c.fill,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${cc.bal/cc.lim*100}%`,background:cc.bal/cc.lim>0.7?c.red:c.green,borderRadius:3}}/></div></div>
    </div>))}</>}

    {seg==="sched"&&<>
      <div style={{margin:"0 16px 12px",padding:"10px 14px",borderRadius:12,background:c.bg2}}>
        <div style={{fontSize:11,color:c.orange,fontWeight:500}}>予定支出合計</div>
        <div style={{fontSize:20,fontWeight:300,color:c.t1,marginTop:2}}>¥{schT.toLocaleString()}</div>
      </div>
      <Sc c={c}>{schedD.map((s,i)=>{const months=Math.round(s.days/30);const badgeText=months<=1?"今月中":months<12?`${months}ヶ月後`:`${Math.round(months/12)}年後`;
        return <Rw key={s.id} c={c} icon={s.icon} iconBg={`${c.orange}22`} title={s.name}
        subtitle={`${s.date} · ${s.memo}`} right={`¥${s.amt.toLocaleString()}`} rightColor={c.orange}
        badge={badgeText} badgeColor={months<5?c.orange:c.cyan}
        last={i===schedD.length-1} onClick={()=>{}}/>;})}</Sc>
    </>}
    <FAB onClick={onAdd} color={c.red}/>
  </div>;
}

function ExpDetail({item,onBack,c}){const cur=item.currency||"JPY";const sym=cur==="USD"?"$":"¥";const absAmt=Math.abs(item.amt);const jpyAmt=toJPY(absAmt,cur,item.date);
return <div style={scr}>
  <NvB title="支出詳細" onBack={onBack} c={c} rightAction={{label:"編集",action:()=>{}}}/>
  <div style={{textAlign:"center",padding:"16px 0 24px"}}>
    <div style={{width:72,height:72,borderRadius:20,background:`${c.red}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,margin:"0 auto",boxShadow:`0 8px 24px ${c.red}18`}}>{item.icon}</div>
    <div style={{fontSize:22,fontWeight:600,color:c.t1,marginTop:12}}>{item.name}</div>
    <div style={{fontSize:36,fontWeight:500,color:c.t1,marginTop:8}}>{sym}{absAmt.toLocaleString()}</div>
    {cur==="USD"&&<div style={{fontSize:15,color:c.t2,marginTop:4}}>≒ ¥{jpyAmt.toLocaleString()} <span style={{fontSize:11,color:c.t2}}>(@{getRate(item.date)})</span></div>}
  </div>
  <Sc header="プロパティ" c={c}>{[["支払手段",item.method],["用途タグ",item.tag],["日付",item.date],["種別",item.type==="fixed"?"固定費":"変動費"],["通貨",cur],
    ...(cur==="USD"?[["適用レート",`¥${getRate(item.date)} / USD`],["円換算額",`¥${jpyAmt.toLocaleString()}`]]:[])
  ].map(([l,v],i,arr)=>(
    <Rw key={i} c={c} title={l} right={v} rightColor={l==="円換算額"?c.red:c.t2} last={i===arr.length-1}/>))}</Sc>
  <Sc header="アクション" c={c}>{[["複製",c.blue],["削除",c.red]].map(([lb,cl],i)=>(
    <Rw key={i} c={c} title={lb} rightColor={cl} last={i===1} onClick={()=>{}}/>))}</Sc>
</div>;}

// OOUI: Sub-object single view (subscription detail)
function SubDetail({item,onBack,c}){return <div style={scr}>
  <NvB title="サブスク詳細" onBack={onBack} c={c} rightAction={{label:"編集",action:()=>{}}}/>
  <div style={{textAlign:"center",padding:"12px 0 20px"}}><div style={{fontSize:48}}>{item.icon}</div><div style={{fontSize:22,fontWeight:600,color:c.t1,marginTop:8}}>{item.name}</div><div style={{fontSize:28,fontWeight:300,color:c.purple,marginTop:8}}>¥{item.amt.toLocaleString()}/{item.cycle}</div></div>
  <Sc header="プロパティ" c={c}>{[["支払カード",item.card],["課金サイクル",item.cycle],["次回支払日",item.next]].map(([l,v],i)=>(
    <Rw key={i} c={c} title={l} right={v} rightColor={c.t2} last={i===2}/>))}</Sc>
  <Sc header="アクション" c={c}>{[["一時停止",c.orange],["解約",c.red]].map(([lb,cl],i)=>(
    <Rw key={i} c={c} title={lb} rightColor={cl} last={i===1} onClick={()=>{}}/>))}</Sc>
</div>;}

// OOUI: Loan detail with monthly payment simulator
function LoanDetail({item,onBack,c}){
  const [simP,setSimP]=useState(item.principal);
  const [simR,setSimR]=useState(item.rate);
  const [simY,setSimY]=useState(item.years);
  const mo=calcMonthly(simP,simR,simY);
  const tot=calcTotal(simP,simR,simY);
  const interest=tot-simP;
  const paidMonths=12; // assume 1 year paid
  const remaining=simP-Math.round(mo*paidMonths*0.6); // simplified
  return <div style={scr}>
    <NvB title="ローン詳細" onBack={onBack} c={c} rightAction={{label:"編集",action:()=>{}}}/>
    <div style={{textAlign:"center",padding:"12px 0 16px"}}>
      <div style={{fontSize:48}}>{item.icon}</div>
      <div style={{fontSize:22,fontWeight:600,color:c.t1,marginTop:8}}>{item.name}</div>
      <div style={{fontSize:34,fontWeight:300,color:c.orange,marginTop:8}}>¥{mo.toLocaleString()}<span style={{fontSize:17,color:c.t2}}>/月</span></div>
    </div>

    <Sc header="ローン情報" c={c}>
      {[["借入先",item.bank],["借入額",`¥${item.principal.toLocaleString()}`],["金利（年）",`${item.rate}%`],["返済期間",`${item.years}年（${item.years*12}回）`],["返済開始",item.start],["総支払額",`¥${tot.toLocaleString()}`],["うち利息",`¥${interest.toLocaleString()}`]].map(([l,v],i)=>(
        <Rw key={i} c={c} title={l} right={v} rightColor={i>=5?c.orange:c.t2} last={i===6}/>
      ))}
    </Sc>

    {/* Loan simulator: adjust parameters to see monthly change */}
    <Sc header="返済シミュレーション" c={c} footer="金利・期間を変更すると毎月の支払額が即時算出されます">
      <div style={{padding:16}}>
        <div style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:13,color:c.t2}}>金利（年）</span>
            <span style={{fontSize:15,fontWeight:600,color:c.orange}}>{simR.toFixed(2)}%</span>
          </div>
          <input type="range" min="0" max="500" value={Math.round(simR*100)} onChange={e=>setSimR(Number(e.target.value)/100)}
            style={{width:"100%",accentColor:c.orange}}/>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:c.t3}}><span>0%</span><span>5%</span></div>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:13,color:c.t2}}>返済期間</span>
            <span style={{fontSize:15,fontWeight:600,color:c.orange}}>{simY}年</span>
          </div>
          <input type="range" min="1" max="50" value={simY} onChange={e=>setSimY(Number(e.target.value))}
            style={{width:"100%",accentColor:c.orange}}/>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:c.t3}}><span>1年</span><span>50年</span></div>
        </div>
        <div style={{borderTop:`0.5px solid ${c.sep}`,paddingTop:14,display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
          <div>
            <div style={{fontSize:11,color:c.t2}}>毎月の支払額</div>
            <div style={{fontSize:28,fontWeight:300,color:c.orange,marginTop:2}}>¥{mo.toLocaleString()}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:11,color:c.t2}}>総利息額</div>
            <div style={{fontSize:17,fontWeight:400,color:c.red,marginTop:2}}>¥{interest.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </Sc>

    <Sc header="アクション" c={c}>
      {[["繰上返済を記録",c.blue],["条件変更",c.orange],["削除",c.red]].map(([lb,cl],i)=>(
        <Rw key={i} c={c} title={lb} rightColor={cl} last={i===2} onClick={()=>{}}/>))}
    </Sc>
  </div>;
}

function ExpNew({onBack,c}){
  const [cur,setCur]=useState("JPY");
  const rate=getRate("4月4日");
  const sym=cur==="USD"?"$":"¥";
  return <div style={scr}>
  <NvB title="新しい支出" onBack={onBack} c={c} rightAction={{label:"完了",action:onBack}}/>
  <div style={{textAlign:"center",padding:"8px 0 4px"}}><div style={{fontSize:11,color:c.t2,marginBottom:4}}>金額をタップして入力</div><div style={{fontSize:48,fontWeight:200,color:c.red}}>{sym}0</div></div>
  <div style={{display:"flex",justifyContent:"center",gap:8,padding:"4px 0 16px"}}>
    {["JPY","USD"].map(v=>(
      <div key={v} onClick={()=>setCur(v)} style={{padding:"6px 18px",borderRadius:8,fontSize:13,fontWeight:cur===v?600:400,cursor:"pointer",background:cur===v?`${c.blue}22`:"transparent",color:cur===v?c.blue:c.t3,border:`0.5px solid ${cur===v?`${c.blue}44`:c.sep}`}}>
        {v==="JPY"?"🇯🇵 JPY":"🇺🇸 USD"}
      </div>
    ))}
  </div>
  <Sc c={c}>{[{l:"支払手段",v:"💳 三井住友カード"},{l:"用途タグ",v:"🍽 食費"},{l:"日付",v:"2026年4月4日"},
    ...(cur==="USD"?[{l:"適用レート",v:`¥${rate} / USD（自動取得）`}]:[]),
    {l:"メモ",v:"タップして入力"}].map((f,i,arr)=>(
    <Rw key={i} c={c} title={f.l} right={f.v} rightColor={f.l==="適用レート"?c.purple:c.t2} last={i===arr.length-1} onClick={()=>{}}/>))}</Sc>
  {cur==="USD"&&<div style={{margin:"0 16px 8px",padding:"8px 12px",borderRadius:8,background:`${c.purple}11`,border:`0.5px solid ${c.purple}22`}}>
    <div style={{fontSize:11,color:c.purple}}>為替レートは入力日のレートを自動で取得します。</div>
  </div>}
  <Sc header="画像で自動入力" c={c} footer="金額・日付・用途タグをAIが自動認識します">
    <div style={{display:"flex"}}>{[["📷","カメラで撮影"],["🖼","ライブラリから"]].map(([ic,lb],i)=>(
      <div key={i} style={{flex:1,padding:"14px 0",textAlign:"center",cursor:"pointer",borderRight:i===0?`0.5px solid ${c.sep}`:"none",minHeight:44}}>
        <div style={{fontSize:22}}>{ic}</div><div style={{fontSize:13,color:c.blue,marginTop:4}}>{lb}</div>
      </div>))}</div>
  </Sc>
</div>;}

// ══ Tab 3: 分析 (Advisory Board結論: 3-tier progressive disclosure) ══
function Ana({c,goSettings,onCfoChat}){
  const [expanded,setExpanded]=useState(false);
  const fNet=fcD.reduce((a,b)=>a+(b.inc-b.exp),0);
  const chartData=expanded?actD:actD.slice(-3);
  const barW=expanded?16:28;
  const tI=incD.reduce((a,b)=>a+toJPY(b.amt,b.currency||"JPY",b.date),0);
  const tE=expD.reduce((a,b)=>a+toJPY(Math.abs(b.amt),b.currency||"JPY",b.date),0);
  const net=tI-tE;const lastExp=310000;const momDiff=tE-lastExp;const momPct=Math.round((momDiff/lastExp)*100);const momUp=momDiff>0;

  return <div style={scr}><LgT title="分析" c={c}/>

  {/* Hero number: Net CF — glassmorphism card */}
  <div style={{margin:"0 16px 8px",padding:"20px 16px",borderRadius:16,background:c.heroGlass,border:`0.5px solid ${c.heroBorder}`,backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",boxShadow:c.heroShadow,textAlign:"center",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:40,background:net>=0?`${c.green}12`:`${c.red}12`}}/>
    <div style={{position:"absolute",bottom:-15,left:-15,width:60,height:60,borderRadius:30,background:net>=0?`${c.green}08`:`${c.red}08`}}/>
    <div style={{position:"relative"}}>
      <div style={{fontSize:13,color:net>=0?c.green:c.red,fontWeight:500,letterSpacing:0.5}}>今月の純キャッシュフロー</div>
      <div style={{fontSize:40,fontWeight:600,color:c.t1,marginTop:6,letterSpacing:-0.5}}>{net>=0?"+":""}¥{net.toLocaleString()}</div>
    </div>
  </div>
  {/* Sub-cards: income, expense, MoM */}
  <div style={{display:"flex",gap:6,margin:"0 16px 12px"}}>
    <div style={{flex:1,padding:"8px 10px",borderRadius:12,background:c.bg2}}>
      <div style={{fontSize:11,color:c.green,fontWeight:500}}>収入</div>
      <div style={{fontSize:16,fontWeight:300,color:c.t1,marginTop:2}}>¥{tI.toLocaleString()}</div>
    </div>
    <div style={{flex:1,padding:"8px 10px",borderRadius:12,background:c.bg2}}>
      <div style={{fontSize:11,color:c.red,fontWeight:500}}>支出</div>
      <div style={{fontSize:16,fontWeight:300,color:c.t1,marginTop:2}}>¥{tE.toLocaleString()}</div>
    </div>
    <div style={{flex:1,padding:"8px 10px",borderRadius:10,background:momUp?`${c.red}10`:`${c.green}10`,border:`0.5px solid ${momUp?`${c.red}22`:`${c.green}22`}`}}>
      <div style={{fontSize:11,color:momUp?c.red:c.green,fontWeight:500}}>前月比</div>
      <div style={{fontSize:16,fontWeight:300,color:c.t1,marginTop:2}}>{momUp?"↑":"↓"}{Math.abs(momPct)}%</div>
    </div>
  </div>

  {/* Tier 1/2: Actual chart (3mo default, expandable to 6mo) */}
  <Sc header={expanded?"過去6ヶ月の実績":"過去3ヶ月の実績"} c={c}>
    <div style={{padding:16}}>
      <Bars data={chartData} count={expanded?6:3} c={c} barW={barW}/>
      <Legend c={c}/>
      <div style={{textAlign:"center",marginTop:12}}>
        <span onClick={()=>setExpanded(!expanded)} style={{fontSize:13,color:c.blue,cursor:"pointer",display:"inline-flex",alignItems:"center",minHeight:44,padding:"0 16px"}}>
          {expanded?"3ヶ月に戻す":"過去6ヶ月を表示 →"}
        </span>
      </div>
    </div>
  </Sc>

  {/* CFO Chat entry point — glassmorphism card */}
  <div onClick={onCfoChat} style={{margin:"0 16px 12px",padding:18,borderRadius:16,background:c.heroGlass,backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",border:`0.5px solid ${c.heroBorder}`,boxShadow:c.heroShadow,cursor:"pointer",display:"flex",alignItems:"center",gap:14,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:-15,right:-15,width:60,height:60,borderRadius:30,background:`${c.purple}08`}}/>
    <div style={{width:48,height:48,borderRadius:24,background:`linear-gradient(135deg, ${c.blue}, ${c.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0,boxShadow:`0 4px 16px ${c.blue}33`}}>🧠</div>
    <div style={{flex:1,position:"relative"}}>
      <div style={{fontSize:16,fontWeight:600,color:c.t1}}>CFOに相談する</div>
      <div style={{fontSize:12,color:c.t2,marginTop:3}}>収支データからAIがアドバイス</div>
    </div>
    <div style={{fontSize:11,color:c.blue,background:`${c.blue}12`,padding:"4px 10px",borderRadius:8,fontWeight:500,border:`0.5px solid ${c.blue}22`}}>Free 30回/月</div>
  </div>

  {/* Tier 3: Forecast teaser (Pro gated) */}
  <Sc header="12ヶ月予測" c={c} footer="サブスク・予定支出を含む予測です">
    <div style={{padding:16}}>
      <Bars data={fcD.slice(0,2)} count={2} dashed c={c} barW={24}/>
      <div style={{position:"relative",marginTop:8}}>
        <div style={{opacity:0.25}}>
          <Bars data={fcD.slice(2,6)} count={4} dashed c={c} barW={16}/>
        </div>
        <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,
          background:`linear-gradient(to right, transparent 10%, ${c.bg} 85%)`,
          display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:12}}>
          <div style={{padding:"4px 10px",borderRadius:6,background:`${c.blue}15`,border:`0.5px solid ${c.blue}33`}}>
            <span style={{fontSize:11,fontWeight:500,color:c.blue}}>Pro 限定</span>
          </div>
        </div>
      </div>
      <div style={{marginTop:12,padding:"10px 12px",borderRadius:8,background:c.bg2}}>
        <div style={{fontSize:11,color:c.t3}}>12ヶ月累積CF予測</div>
        <div style={{fontSize:22,fontWeight:300,color:fNet>=0?c.green:c.red,marginTop:2}}>+¥{fNet.toLocaleString()}</div>
        <div style={{fontSize:11,color:c.t3,marginTop:4}}>⚠ 8月: 結婚式 ¥300,000</div>
      </div>
      <div onClick={goSettings} style={{marginTop:12,padding:14,borderRadius:10,background:`${c.blue}15`,border:`0.5px solid ${c.blue}33`,textAlign:"center",cursor:"pointer",minHeight:44,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{fontSize:15,fontWeight:600,color:c.blue}}>Pro で12ヶ月の予測を表示 →</span>
      </div>
    </div>
  </Sc>

  {/* Payment method breakdown */}
  <Sc header="支払手段別（今月）" c={c}>
    {[["現金",18000,c.orange],["クレカ",95000,c.blue],["電子マネー",32000,c.green],["引き落とし",45000,c.cyan],["銀行振込",15000,c.purple]].map(([m,a,cl],i)=>(
      <Rw key={i} c={c} icon={<div style={{width:10,height:10,borderRadius:3,background:cl}}/>} iconBg="transparent" title={m} right={`¥${a.toLocaleString()}`} rightColor={c.t2} last={i===4}/>))}
  </Sc>
</div>;}

// ══ Onboarding (3 steps) ══
function Onboarding({onComplete,c}){
  const [step,setStep]=useState(0);
  const [cfoName,setCfoName]=useState("マネーの番人");
  const [goalAsset,setGoalAsset]=useState("1000");
  const [goalCf,setGoalCf]=useState("10");

  if(step===0) return <div style={{...scr,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 28px",textAlign:"center",position:"relative",overflow:"hidden"}}>
    {/* Decorative floating bubbles */}
    <div style={{position:"absolute",top:40,left:-20,width:120,height:120,borderRadius:60,background:`${c.blue}08`}}/>
    <div style={{position:"absolute",top:120,right:-30,width:80,height:80,borderRadius:40,background:`${c.purple}06`}}/>
    <div style={{position:"absolute",bottom:100,left:30,width:60,height:60,borderRadius:30,background:`${c.green}06`}}/>
    <div style={{position:"absolute",bottom:60,right:20,width:100,height:100,borderRadius:50,background:`${c.blue}05`}}/>
    <div style={{position:"relative",zIndex:1}}>
      <div style={{width:88,height:88,borderRadius:28,background:`linear-gradient(135deg, ${c.blue}, ${c.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:44,margin:"0 auto 28px",boxShadow:`0 16px 48px ${c.blue}44`}}>💰</div>
      <div style={{fontSize:32,fontWeight:700,color:c.t1,marginBottom:8,letterSpacing:-0.3}}>ようこそ</div>
      <div style={{fontSize:16,color:c.t2,lineHeight:1.7,marginBottom:8}}>あなたのCFO は、あなた専用の<br/>最高財務責任者です</div>
      <div style={{fontSize:13,color:c.t2,lineHeight:1.6,marginBottom:44}}>収支データを分析し、利益向上や<br/>支出削減の提案をしてくれます</div>
      <div onClick={()=>setStep(1)} style={{width:"100%",padding:16,borderRadius:14,background:`linear-gradient(135deg, ${c.blue}, ${c.purple})`,textAlign:"center",cursor:"pointer",minHeight:48,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 8px 24px ${c.blue}33`}}><span style={{fontSize:17,fontWeight:600,color:"#fff"}}>はじめる</span></div>
    </div>
  </div>;

  if(step===1) return <div style={{...scr,padding:"50px 20px 20px"}}>
    <NvB title="あなたのCFOを設定" onBack={()=>setStep(0)} c={c}/>
    <div style={{textAlign:"center",marginBottom:24}}>
      <div style={{width:64,height:64,borderRadius:32,background:`linear-gradient(135deg, ${c.blue}, ${c.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 12px"}}>🧠</div>
      <div style={{fontSize:13,color:c.t2}}>AIアドバイザーの名前を決めてください</div>
    </div>
    <Sc header="CFOの名前" c={c} footer="いつでも設定から変更できます">
      <div style={{padding:"12px 16px"}}>
        <input value={cfoName} onChange={e=>setCfoName(e.target.value)} style={{width:"100%",background:"transparent",border:"none",fontSize:17,color:c.t1,outline:"none",fontFamily:FF}} placeholder="例: マネーの番人"/>
      </div>
    </Sc>
    <Sc header="目標設定" c={c} footer="CFOがこの目標に基づいてアドバイスします">
      <div style={{padding:"0 16px"}}>
        <div style={{display:"flex",alignItems:"center",padding:"12px 0",borderBottom:`0.5px solid ${c.sep}`}}>
          <span style={{fontSize:15,color:c.t1,flex:1}}>目標総資産</span>
          <div style={{display:"flex",alignItems:"baseline",gap:2}}>
            <input value={goalAsset} onChange={e=>setGoalAsset(e.target.value)} style={{width:60,background:"transparent",border:"none",fontSize:17,color:c.blue,textAlign:"right",outline:"none",fontFamily:FF,fontWeight:600}}/>
            <span style={{fontSize:15,color:c.t1,fontWeight:500}}>万円</span>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",padding:"12px 0"}}>
          <span style={{fontSize:15,color:c.t1,flex:1}}>月間目標CF</span>
          <div style={{display:"flex",alignItems:"baseline",gap:2}}>
            <input value={goalCf} onChange={e=>setGoalCf(e.target.value)} style={{width:60,background:"transparent",border:"none",fontSize:17,color:c.green,textAlign:"right",outline:"none",fontFamily:FF,fontWeight:600}}/>
            <span style={{fontSize:15,color:c.t1,fontWeight:500}}>万円</span>
          </div>
        </div>
      </div>
    </Sc>
    <div onClick={()=>setStep(2)} style={{margin:"16px 16px 0",padding:16,borderRadius:12,background:c.blue,textAlign:"center",cursor:"pointer",minHeight:44,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:17,fontWeight:600,color:"#fff"}}>次へ</span></div>
  </div>;

  // step===2: Completion
  return <div style={{...scr,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"60px 28px",textAlign:"center"}}>
    <div style={{width:80,height:80,borderRadius:40,background:`${c.green}22`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}>
      <svg width="40" height="40" viewBox="0 0 40 40"><path d="M10 20L17 27L30 13" stroke={c.green} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
    </div>
    <div style={{fontSize:28,fontWeight:700,color:c.t1,marginBottom:8}}>準備完了</div>
    <div style={{padding:"12px 20px",borderRadius:12,background:`linear-gradient(135deg, ${c.blue}15, ${c.purple}15)`,marginBottom:16}}>
      <div style={{fontSize:13,color:c.t2}}>あなたのCFO</div>
      <div style={{fontSize:22,fontWeight:700,color:c.t1,marginTop:4}}>「{cfoName}」</div>
    </div>
    <div style={{display:"flex",gap:16,marginBottom:32}}>
      <div style={{padding:"10px 16px",borderRadius:12,background:c.bg2}}>
        <div style={{fontSize:11,color:c.t2}}>目標総資産</div>
        <div style={{fontSize:20,fontWeight:600,color:c.blue,marginTop:2}}>{goalAsset}<span style={{fontSize:13,fontWeight:400}}>万円</span></div>
      </div>
      <div style={{padding:"10px 16px",borderRadius:12,background:c.bg2}}>
        <div style={{fontSize:11,color:c.t2}}>月間目標CF</div>
        <div style={{fontSize:20,fontWeight:600,color:c.green,marginTop:2}}>+{goalCf}<span style={{fontSize:13,fontWeight:400}}>万円</span></div>
      </div>
    </div>
    <div style={{fontSize:13,color:c.t3,lineHeight:1.6,marginBottom:32}}>分析タブから「{cfoName}」に<br/>いつでも相談できます</div>
    <div onClick={()=>onComplete({cfoName,goalAsset:Number(goalAsset),goalCf:Number(goalCf)})} style={{width:"100%",padding:16,borderRadius:12,background:c.blue,textAlign:"center",cursor:"pointer",minHeight:44,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:17,fontWeight:600,color:"#fff"}}>はじめましょう</span></div>
  </div>;
}

// ══ CFO Chat ══
function CfoChat({onBack,c,cfoProfile}){
  const name=cfoProfile?.cfoName||"マネーの番人";
  const goalA=cfoProfile?.goalAsset||1000;
  const goalCf=cfoProfile?.goalCf||10;
  const [msgs,setMsgs]=useState([
    {role:"cfo",text:`こんにちは、${name}です。\n\n現在の月間CFは +¥47,000 で、目標の +¥${goalCf}0,000 に対して${goalCf<=4.7?"達成中":"あと ¥"+(goalCf*10000-47000).toLocaleString()+" です"}。\n\nまず3つの改善提案があります。どれについて詳しく話しましょうか？`},
    {role:"cfo",text:`📊 提案1: サブスク見直し\nNetflix + Spotifyの重複を整理すると月 ¥980〜¥1,490 削減。\n\n💡 提案2: 固定費交渉\n電気代のプラン変更で月 ¥1,000〜¥2,000 の節約余地。\n\n📈 提案3: 副業収入の安定化\n月 ¥85,000 の副業収入を安定させるため、複数クライアント化を推奨。`},
  ]);
  const [input,setInput]=useState("");
  const sendMsg=()=>{
    if(!input.trim())return;
    const userMsg=input.trim();
    setInput("");
    setMsgs(prev=>[...prev,{role:"user",text:userMsg}]);
    setTimeout(()=>{
      let reply="";
      if(userMsg.includes("サブスク")||userMsg.includes("1")) reply=`サブスクの詳細分析です。\n\n現在の月額合計: ¥12,350\n├ Netflix ¥1,490\n├ Spotify ¥980\n├ iCloud+ ¥400\n├ ChatGPT Plus ¥3,000\n└ Adobe CC ¥6,480\n\n💡 推奨アクション:\n① SpotifyをFree版に → 月 ¥980 削減\n② iCloud+を50GBプランに → 月 ¥270 削減\n\n年間で約 ¥15,000 の節約になります。目標の${goalA}万円達成に向けて、この節約分を投資に回すことをお勧めします。`;
      else if(userMsg.includes("固定費")||userMsg.includes("2")) reply=`固定費の分析結果です。\n\n月間固定費: ¥98,000\n├ 家賃 ¥85,000\n├ 電気代 ¥8,500\n└ スマホ代 ¥4,800\n\n💡 推奨アクション:\n① 電力会社の切り替え → 月 ¥1,500 程度の削減\n② 格安SIMへの乗り換え → 月 ¥2,000 程度の削減\n\n合計で月 ¥3,500、年間 ¥42,000 の削減が見込めます。`;
      else if(userMsg.includes("副業")||userMsg.includes("3")) reply=`副業収入の安定化について。\n\n現在: 月 ¥85,000（単一クライアント）\n\n⚠ リスク: 1社依存は収入変動リスクが高い\n\n💡 推奨戦略:\n① 2〜3社に分散（目標: 月 ¥30,000 × 3社）\n② AIコンサルの単価見直し\n③ ストック型収入（アプリ、教材）の構築\n\n目標の月間CF +¥${goalCf}万円を安定的に達成するには、副業の月収 ¥120,000 が理想です。`;
      else reply=`ご質問ありがとうございます。\n\n現在のデータを見ると、月間収入 ¥382,200 に対して支出 ¥335,200 で、純CF +¥47,000 です。\n\n目標の +¥${goalCf}万円/${ goalA}万円に向けて、具体的にどの項目を改善したいですか？\n\n① 支出削減\n② 収入増加\n③ 投資戦略`;
      setMsgs(prev=>[...prev,{role:"cfo",text:reply}]);
    },800);
  };

  return <div style={{...scr,display:"flex",flexDirection:"column",paddingBottom:0}}>
    <NvB title={name} onBack={onBack} c={c} rightAction={{label:"目標",action:()=>{}}}/>
    {/* Goal summary bar */}
    <div style={{display:"flex",gap:8,margin:"0 16px 8px"}}>
      <div style={{flex:1,padding:"6px 10px",borderRadius:8,background:c.bg2,display:"flex",alignItems:"center",gap:6}}>
        <span style={{fontSize:11,color:c.t3}}>目標資産</span>
        <span style={{fontSize:13,fontWeight:600,color:c.blue}}>{goalA}万</span>
      </div>
      <div style={{flex:1,padding:"6px 10px",borderRadius:8,background:c.bg2,display:"flex",alignItems:"center",gap:6}}>
        <span style={{fontSize:11,color:c.t3}}>月間CF</span>
        <span style={{fontSize:13,fontWeight:600,color:c.green}}>+{goalCf}万</span>
      </div>
    </div>
    {/* Messages */}
    <div style={{flex:1,overflowY:"auto",padding:"8px 16px 8px",display:"flex",flexDirection:"column",gap:10}}>
      {msgs.map((m,i)=>m.role==="cfo"?(
        <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
          <div style={{width:30,height:30,borderRadius:15,background:`linear-gradient(135deg, ${c.blue}, ${c.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>🧠</div>
          <div style={{background:c.bg2,borderRadius:"4px 14px 14px 14px",padding:"10px 14px",maxWidth:"82%",fontSize:13,color:c.t1,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{m.text}</div>
        </div>
      ):(
        <div key={i} style={{display:"flex",justifyContent:"flex-end"}}>
          <div style={{background:c.blue,borderRadius:"14px 4px 14px 14px",padding:"10px 14px",maxWidth:"78%",fontSize:13,color:"#fff",lineHeight:1.6,whiteSpace:"pre-wrap"}}>{m.text}</div>
        </div>
      ))}
    </div>
    {/* Quick suggestions */}
    <div style={{display:"flex",gap:6,padding:"4px 16px",overflowX:"auto",flexShrink:0}}>
      {["サブスクを見直したい","固定費を下げたい","副業を安定させたい"].map((q,i)=>(
        <div key={i} onClick={()=>{setInput(q);setTimeout(()=>{setMsgs(prev=>[...prev,{role:"user",text:q}]);setInput("");setTimeout(()=>{let reply="";if(q.includes("サブスク"))reply=`サブスクの詳細分析です。\n\n現在の月額合計: ¥12,350\n├ Netflix ¥1,490\n├ Spotify ¥980\n├ iCloud+ ¥400\n├ ChatGPT Plus ¥3,000\n└ Adobe CC ¥6,480\n\n💡 推奨アクション:\n① SpotifyをFree版に → 月 ¥980 削減\n② iCloud+を50GBプランに → 月 ¥270 削減\n\n年間で約 ¥15,000 の節約になります。`;else if(q.includes("固定費"))reply=`固定費の分析結果です。\n\n月間固定費: ¥98,000\n├ 家賃 ¥85,000\n├ 電気代 ¥8,500\n└ スマホ代 ¥4,800\n\n💡 推奨アクション:\n① 電力会社の切り替え → 月 ¥1,500 程度の削減\n② 格安SIMへの乗り換え → 月 ¥2,000 程度の削減`;else reply=`副業収入の安定化について。\n\n現在: 月 ¥85,000（単一クライアント）\n\n💡 推奨戦略:\n① 2〜3社に分散\n② AIコンサルの単価見直し\n③ ストック型収入の構築`;setMsgs(prev=>[...prev,{role:"cfo",text:reply}]);},800);},50);}} style={{padding:"6px 12px",borderRadius:16,border:`0.5px solid ${c.sep}`,fontSize:11,color:c.blue,whiteSpace:"nowrap",cursor:"pointer",flexShrink:0}}>{q}</div>
      ))}
    </div>
    {/* Input bar */}
    <div style={{display:"flex",gap:8,padding:"8px 16px 28px",borderTop:`0.5px solid ${c.sep}`,background:c.bg,flexShrink:0}}>
      <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} placeholder={`${name}に質問する...`} style={{flex:1,padding:"10px 14px",borderRadius:20,background:c.bg2,border:`0.5px solid ${c.sep}`,fontSize:14,color:c.t1,outline:"none",fontFamily:FF}}/>
      <div onClick={sendMsg} style={{width:36,height:36,borderRadius:18,background:input.trim()?c.blue:`${c.blue}33`,display:"flex",alignItems:"center",justifyContent:"center",cursor:input.trim()?"pointer":"default",flexShrink:0,alignSelf:"center"}}>
        <svg width="16" height="16" viewBox="0 0 16 16"><path d="M2 8L14 8M14 8L9 3M14 8L9 13" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
      </div>
    </div>
  </div>;
}

// ══ Tab 4: 設定 ══
function Stg({c,ap,setAp}){return <div style={scr}>
  <LgT title="設定" c={c}/>
  <Sc c={c}><div style={{display:"flex",alignItems:"center",padding:"12px 16px",minHeight:60,cursor:"pointer"}}>
    <div style={{width:50,height:50,borderRadius:25,background:`linear-gradient(135deg, ${c.blue}, ${c.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:600,color:"#fff",marginRight:14,flexShrink:0,boxShadow:`0 4px 12px ${c.blue}33`}}>M</div>
    <div style={{flex:1}}><div style={{fontSize:17,fontWeight:600,color:c.t1}}>MASASHI</div><div style={{fontSize:13,color:c.t2}}>masashi@example.com</div></div>
    <div style={{textAlign:"right",marginRight:6}}><span style={{fontSize:13,color:c.t2}}>Free</span></div>
    <svg width="8" height="14" viewBox="0 0 8 14" fill="none"><path d="M1 1L7 7L1 13" stroke={c.t3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  </div></Sc>
  <div style={{margin:"0 16px 16px",padding:18,borderRadius:16,background:`linear-gradient(135deg, ${c.blue}12, ${c.purple}08)`,border:`0.5px solid ${c.blue}33`,boxShadow:c.cardShadow,position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:40,background:`${c.blue}08`}}/>
    <div style={{position:"relative"}}>
      <div style={{fontSize:18,fontWeight:600,color:c.t1,marginBottom:6}}>Pro にアップグレード</div>
      <div style={{fontSize:13,color:c.t2,lineHeight:1.6,marginBottom:16}}>CFOチャット100回/月・12ヶ月予測・OCR無制限・広告非表示</div>
      <div style={{display:"flex",gap:8}}>
        <div style={{flex:1,padding:14,borderRadius:12,background:c.heroGlass,backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",border:`0.5px solid ${c.heroBorder}`,textAlign:"center",cursor:"pointer",minHeight:48,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:17,fontWeight:600,color:c.blue}}>¥300/月</span></div>
        <div style={{flex:1,padding:14,borderRadius:12,background:`linear-gradient(135deg, ${c.blue}, ${c.purple})`,textAlign:"center",cursor:"pointer",minHeight:48,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 16px ${c.blue}33`}}><span style={{fontSize:17,fontWeight:600,color:"#fff"}}>¥3,000/年</span><span style={{fontSize:11,color:"rgba(255,255,255,0.7)",marginTop:2}}>2ヶ月分お得</span></div>
      </div>
    </div>
  </div>
  {/* CFO settings section — edit onboarding values */}
  <Sc header="CFO設定" c={c}>
    <Rw c={c} icon="🧠" iconBg={`${c.purple}22`} title="CFO名" right="マネーの番人" rightColor={c.t2} onClick={()=>{}}/>
    <Rw c={c} icon="🎯" iconBg={`${c.blue}22`} title="目標総資産" right="1,000万円" rightColor={c.blue} onClick={()=>{}}/>
    <Rw c={c} icon="📈" iconBg={`${c.green}22`} title="月間目標CF" right="+10万円" rightColor={c.green} last onClick={()=>{}}/>
  </Sc>
  <Sc header="一般" c={c}>
    <Rw c={c} icon="💴" iconBg={`${c.orange}22`} title="通貨" right="JPY（日本円）" rightColor={c.t2} onClick={()=>{}}/>
    <Rw c={c} icon="🌐" iconBg={`${c.blue}22`} title="言語" right="日本語" rightColor={c.t2} last onClick={()=>{}}/>
  </Sc>
  <Sc header="外観モード" c={c}>
    {[["light","ライト","☀️"],["dark","ダーク","🌙"],["system","システムと同じ","📱"]].map(([k,lb,ic],i)=>(
      <div key={k} onClick={()=>setAp(k)} style={{display:"flex",alignItems:"center",padding:"0 16px",minHeight:44,cursor:"pointer",borderBottom:i<2?`0.5px solid ${c.sep}`:"none"}}>
        <div style={{width:30,height:30,borderRadius:7,background:`${c.purple}22`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,marginRight:12}}>{ic}</div>
        <span style={{flex:1,fontSize:17,color:c.t1}}>{lb}</span>
        {ap===k&&<svg width="16" height="16" viewBox="0 0 16 16"><path d="M3 8L6.5 11.5L13 4.5" stroke={c.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>}
      </div>))}
  </Sc>
  <Sc header="データ" c={c}>
    <Rw c={c} icon="☁️" iconBg={`${c.cyan}22`} title="クラウド同期" right="有効" rightColor={c.green} onClick={()=>{}}/>
    <Rw c={c} icon="📤" iconBg={`${c.green}22`} title="データエクスポート" right="将来実装" rightColor={c.t3} last/>
  </Sc>
  <Sc header="サポート" c={c}>
    <Rw c={c} icon="📄" iconBg={`${c.t3}22`} title="プライバシーポリシー" onClick={()=>{}}/>
    <Rw c={c} icon="📋" iconBg={`${c.t3}22`} title="利用規約" onClick={()=>{}}/>
    <Rw c={c} icon="💬" iconBg={`${c.blue}22`} title="お問い合わせ" onClick={()=>{}}/>
    <Rw c={c} icon="ℹ️" iconBg={`${c.t3}22`} title="バージョン" right="1.0.0" rightColor={c.t3} last/>
  </Sc>
  <Sc c={c}><div style={{minHeight:44,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><span style={{fontSize:17,color:c.red}}>ログアウト</span></div></Sc>
  <div style={{textAlign:"center",padding:"8px 0 20px"}}><div style={{fontSize:13,color:c.t3}}>あなたのCFO v1.0.0</div></div>
</div>;}

// ── Main ──
const tabIds=["onboarding","login","income","expense","analysis","cfo_chat","settings"];
const tabLbs=["初期設定","ログイン","収入","支出","分析","CFOチャット","設定"];

export default function App(){
  const [tab,setTab]=useState("analysis");
  const [det,setDet]=useState(null);
  const [subDet,setSubDet]=useState(null);
  const [loanDet,setLoanDet]=useState(null);
  const [add,setAdd]=useState(false);
  const [ap,setAp]=useState("light");
  const [sd,setSd]=useState(false);
  const [cfoProfile,setCfoProfile]=useState(null);
  const [onboarded,setOnboarded]=useState(false);
  const [loggedIn,setLoggedIn]=useState(false);

  useEffect(()=>{const mq=window.matchMedia("(prefers-color-scheme: dark)");setSd(mq.matches);const h=e=>setSd(e.matches);mq.addEventListener("change",h);return()=>mq.removeEventListener("change",h);},[]);

  const dk=ap==="dark"||(ap==="system"&&sd);
  const c=dk?DK_C:LT_C;

  function ct(){
    // Flow: Onboarding(3steps) → Login → Analysis(default)
    if(tab==="onboarding")return <Onboarding onComplete={(profile)=>{setCfoProfile(profile);setOnboarded(true);setTab("login");}} c={c}/>;
    if(tab==="login")return <Login go={()=>{setLoggedIn(true);setTab("analysis");}} c={c}/>;
    if(tab==="income"){
      if(add)return <IncNew onBack={()=>setAdd(false)} c={c}/>;
      if(det)return <IncDetail item={det} onBack={()=>setDet(null)} c={c}/>;
      return <IncList onSelect={setDet} onAdd={()=>setAdd(true)} c={c}/>;
    }
    if(tab==="expense"){
      if(add)return <ExpNew onBack={()=>setAdd(false)} c={c}/>;
      if(loanDet)return <LoanDetail item={loanDet} onBack={()=>setLoanDet(null)} c={c}/>;
      if(subDet)return <SubDetail item={subDet} onBack={()=>setSubDet(null)} c={c}/>;
      if(det)return <ExpDetail item={det} onBack={()=>setDet(null)} c={c}/>;
      return <ExpTab onSelect={setDet} onAdd={()=>setAdd(true)} onSubSelect={setSubDet} onLoanSelect={setLoanDet} c={c}/>;
    }
    if(tab==="analysis")return <Ana c={c} goSettings={()=>{setTab("settings");setDet(null);setAdd(false);setSubDet(null);setLoanDet(null);}} onCfoChat={()=>go("cfo_chat")}/>;
    if(tab==="cfo_chat")return <CfoChat onBack={()=>go("analysis")} c={c} cfoProfile={cfoProfile}/>;
    if(tab==="settings")return <Stg c={c} ap={ap} setAp={setAp}/>;
  }
  const go=t=>{setTab(t);setDet(null);setAdd(false);setSubDet(null);setLoanDet(null);};

  return <div style={{minHeight:"100vh",background:dk?"#111":"#E5E5EA",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 20px",fontFamily:FF,transition:"background 0.3s"}}>
    <div style={{display:"flex",gap:5,marginBottom:24,flexWrap:"wrap",justifyContent:"center"}}>
      {tabIds.map((id,i)=><button key={id} onClick={()=>go(id)} style={{padding:"8px 16px",borderRadius:8,border:tab===id?`1px solid ${c.blue}`:`1px solid ${c.sep}`,cursor:"pointer",fontSize:13,fontWeight:tab===id?600:400,background:tab===id?`${c.blue}22`:dk?"transparent":"#fff",color:tab===id?(dk?"#fff":c.blue):c.t2,fontFamily:FF,minHeight:36,transition:"all 0.3s"}}>{tabLbs[i]}</button>)}
    </div>
    <div style={{width:375,height:812,borderRadius:44,background:c.bg,position:"relative",overflow:"hidden",boxShadow:c.shadow,fontFamily:FF,color:c.t1,WebkitFontSmoothing:"antialiased",transition:"background 0.3s,box-shadow 0.3s"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,backgroundImage:c.meshBg,pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"relative",zIndex:1}}><SB c={c}/>{ct()}</div>{tab!=="login"&&tab!=="onboarding"&&tab!=="cfo_chat"&&<TBar active={tab} go={go} c={c}/>}
    </div>
    <div style={{marginTop:20,fontSize:13,color:dk?"#666":"#999",transition:"color 0.3s"}}>あなたのCFO — OOUI + HIG · {ap==="light"?"ライトモード":ap==="dark"?"ダークモード":"システム"}</div>
  </div>;
}
