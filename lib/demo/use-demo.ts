'use client';
import {useState,useRef,useEffect,useCallback} from 'react';
import {conversations, type Message} from './data';
import {responseFor} from './responses';
export type ChatState={messages:Message[];typing:string;handover:boolean;unread:number};
const initial=()=>Object.fromEntries(conversations.map(c=>[c.id,{messages:[...c.messages],typing:'',handover:false,unread:c.unread}]));
export function useDemo(){
const [states,setStates]=useState<Record<string,ChatState>>(initial);
const timers=useRef<ReturnType<typeof setTimeout>[]>([]);
const locks=useRef(new Set<string>());
const stateRef=useRef(states);stateRef.current=states;
useEffect(()=>()=>timers.current.forEach(clearTimeout),[]);
const send=useCallback((id:string,value:string)=>{const text=value.trim().slice(0,2000);if(!text||locks.current.has(id)||!stateRef.current[id])return false;locks.current.add(id);const result=responseFor(text,stateRef.current[id].handover);const time=new Date().toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}).replace('.',':');const key=crypto.randomUUID();
setStates(prev=>({...prev,[id]:{...prev[id],typing:result.status,messages:[...prev[id].messages,{id:key,role:'customer',text,time}]}}));
timers.current.push(setTimeout(()=>{setStates(prev=>{const old=prev[id];const additions:Message[]=[{id:key+'-reply',role:result.human?'human':'ai',text:result.text,time,productId:result.productId}];if(result.handover){additions.push({id:key+'-transfer',role:'system',text:'Conversation transferred to Human Agent · Simulasi',time});additions.push({id:key+'-human',role:'human',text:'Halo Kak, saya Maya dari tim Vitalife. Saya sudah menerima ringkasan percakapan. Ada yang bisa saya bantu lebih lanjut? (Simulasi)',time});}return {...prev,[id]:{...old,messages:[...old.messages,...additions],typing:'',handover:old.handover||!!result.handover}}});locks.current.delete(id);},1400));return true;},[]);
const reset=useCallback(()=>{timers.current.forEach(clearTimeout);timers.current=[];locks.current.clear();setStates(initial());},[]);
const markRead=useCallback((id:string)=>setStates(prev=>({...prev,[id]:{...prev[id],unread:0}})),[]);
return {states,send,reset,markRead};
}
