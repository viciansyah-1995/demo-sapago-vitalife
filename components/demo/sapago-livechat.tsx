'use client';

import Script from 'next/script';
import {useEffect} from 'react';

const WIDGET_SELECTOR = 'iframe[title="Sapago Live Chat"]';

export function focusSapagoLiveChat(){
  const iframe=document.querySelector<HTMLIFrameElement>(WIDGET_SELECTOR);
  if(!iframe)return false;
  iframe.focus();
  document.body.classList.remove('sapago-livechat-attention');
  requestAnimationFrame(()=>document.body.classList.add('sapago-livechat-attention'));
  window.setTimeout(()=>document.body.classList.remove('sapago-livechat-attention'),1000);
  return true;
}

export function SapagoWebsiteLiveChat({active}:{active:boolean}){
  useEffect(()=>{
    document.body.classList.toggle('sapago-livechat-enabled',active);
    return()=>document.body.classList.remove('sapago-livechat-enabled');
  },[active]);

  return <Script
    id="sapago-livechat-widget"
    src="https://sapago.id/livechat/widget.js"
    strategy="afterInteractive"
    data-api-key="lc_pk_F7xT11ShyHs4ZfQhNz3vDqPkVs_wl9iE"
    data-api-url="https://api.talky.id/v1/public/livechat"
    data-widget-url="https://sapago.id/livechat/widget"
  />;
}
