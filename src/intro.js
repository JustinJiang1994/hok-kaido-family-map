// Independent reader: does not change map state, zoom or place details.
(() => {
 const dialog=document.createElement('dialog');dialog.id='topicReader';dialog.setAttribute('aria-labelledby','readerTitle');
 dialog.innerHTML='<div class="reader-bar"><button type="button" id="readerClose">← 返回主题</button><span>北海道读本</span></div><div class="reader-scroll"><h2 id="readerTitle"></h2><div id="readerContent"></div></div>';
 document.body.append(dialog);
 let opener,photoObserver;
 const close=()=>dialog.close();
 dialog.querySelector('#readerClose').addEventListener('click',close);
 dialog.addEventListener('click',event=>{if(event.target===dialog||event.target.closest('.reading-back-bottom'))close();});
 dialog.addEventListener('close',()=>{photoObserver?.disconnect();document.body.classList.remove('reading-open');opener?.focus({preventScroll:true});});
 document.querySelectorAll('[data-topic]').forEach(button=>button.addEventListener('click',()=>{
  const template=document.getElementById('reading-'+button.dataset.topic);
  opener=button;dialog.querySelector('#readerTitle').textContent=template.dataset.title;
  dialog.querySelector('#readerContent').replaceChildren(template.content.cloneNode(true));
  document.body.classList.add('reading-open');dialog.showModal();dialog.querySelector('.reader-scroll').scrollTop=0;photoObserver?.disconnect();photoObserver=PhotoLoader.observe(dialog.querySelector('.reader-scroll'));
 }));
})();
