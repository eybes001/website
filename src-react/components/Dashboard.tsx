import {useMemo,useState} from 'react';
const data={
 cafe:{name:'Neighborhood café',orders:2575,aov:23.8,cost:.56,weights:[81,94,88,111,117,105,133,143,138,158,172,186]},
 retail:{name:'Independent store',orders:1650,aov:62.4,cost:.64,weights:[92,101,98,116,122,135,129,152,149,178,188,203]},
 service:{name:'Local services',orders:680,aov:145,cost:.39,weights:[120,117,139,136,164,153,172,181,166,195,208,226]}
};
type Business=keyof typeof data;
const money=(n:number)=>'$'+Math.round(n).toLocaleString('en-US');
export default function Dashboard(){
 const [business,setBusiness]=useState<Business>('cafe');const [period,setPeriod]=useState(12);const [discount,setDiscount]=useState(8);
 const d=data[business];const m=useMemo(()=>{
  const weights=d.weights.slice(-period),sum=d.weights.reduce((a,b)=>a+b,0),rev=d.orders*d.aov*weights.reduce((a,b)=>a+b,0)/sum;
  const peak=Math.max(...weights)*1.17;const pts=weights.map((v,i)=>[36+i*597/Math.max(1,period-1),193-v/peak*156]);
  return {rev,orders:rev/d.aov,pts,path:pts.map((p,i)=>(i?'L':'M')+p.map(n=>n.toFixed(2)).join(' ')).join(' ')};
 },[d,period]);
 const offer=discount/100,profit=(d.aov*(1-offer)-d.aov*d.cost)*d.orders*(1+1.25*offer),baseline=(d.aov-d.aov*d.cost)*d.orders;
 return <div className="react-dash"><div className="react-controls"><label>Sample business<select value={business} onChange={e=>setBusiness(e.target.value as Business)}><option value="cafe">Neighborhood café</option><option value="retail">Independent store</option><option value="service">Local services</option></select></label><label>Reporting period<select value={period} onChange={e=>setPeriod(Number(e.target.value))}><option value="12">12 months</option><option value="6">6 months</option><option value="3">3 months</option></select></label></div><div className="react-kpis"><div><small>EST. REVENUE</small><strong>{money(m.rev)}</strong></div><div><small>ORDERS</small><strong>{Math.round(m.orders).toLocaleString()}</strong></div><div><small>GROSS MARGIN</small><strong>{((1-d.cost)*100).toFixed(1)}%</strong></div></div><svg className="react-chart" viewBox="0 0 670 236" aria-label="Fictional revenue trend"><g>{[34,84,134,193].map(y=><line key={y} x1="36" x2="633" y1={y} y2={y} stroke="#8995ad" strokeOpacity=".26" strokeDasharray="4 7"/>)}</g><path d={m.path+' L'+m.pts.at(-1)?.[0]+' 200 L36 200Z'} fill="#e7b880" fillOpacity=".13"/><path d={m.path} fill="none" stroke="#e7b880" strokeWidth="4" strokeLinecap="round"/>{m.pts.map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="4" fill="#f8d4a8"/>)}</svg><div className="react-offer"><label>Offer discount <strong>{discount}%</strong><input type="range" min="0" max="25" value={discount} onChange={e=>setDiscount(Number(e.target.value))}/></label><div><small>Estimated contribution</small><strong>{money(profit)}</strong></div><div><small>Difference from baseline</small><strong style={{color:profit>=baseline?'#91d2af':'#eb9b91'}}>{profit>=baseline?'+':'−'}{money(Math.abs(profit-baseline))}</strong></div></div><small className="data-warning">All figures are independent synthetic demonstrations. Demand elasticity is an assumption, not a prediction.</small></div>
}
