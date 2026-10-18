// Versioned same-origin photos. Only nearby slides are fetched; originals stay in provenance.
const PhotoLoader={
 markup(photo,index){
  const asset=IMAGE_ASSETS[photo.src];
  const attrs=asset?`src="${asset.placeholder}" data-photo-src="${asset.variants.at(-1).src}" data-photo-srcset="${asset.variants.map(v=>v.src+' '+v.width+'w').join(', ')}" sizes="(max-width: 600px) calc(100vw - 32px), 800px" width="${asset.variants.at(-1).width}" height="${asset.variants.at(-1).height}"`:`data-photo-src="${esc(photo.src)}"`;
  return `<img ${attrs} class="progressive-photo" alt="${esc(photo.caption)}" decoding="async" data-slide="${index}">`;
 },
 load(img){
  if(!img||img.dataset.started)return;
  img.dataset.started='true';img.classList.add('photo-loading');
  const fallback=img.parentElement.querySelector('.photo-error');
  img.onload=()=>{if(img.currentSrc.startsWith('data:'))return;img.classList.remove('photo-loading');img.dataset.loaded='true';if(fallback)fallback.hidden=true;};
  img.onerror=()=>{img.classList.remove('photo-loading');img.dataset.loaded='error';if(fallback)fallback.hidden=false;};
  if(img.dataset.photoSrcset)img.srcset=img.dataset.photoSrcset;
  img.src=img.dataset.photoSrc;
  if(fallback)fallback.querySelector('button').onclick=()=>{fallback.hidden=true;delete img.dataset.started;PhotoLoader.load(img);};
 },
 near(track,index){const imgs=track.querySelectorAll('img[data-photo-src]'),current=imgs[index];PhotoLoader.load(current);const ahead=()=>[index+1,index-1].forEach(i=>PhotoLoader.load(imgs[i]));if(current?.dataset.loaded==='true')ahead();else if(current&&!current.dataset.prefetch){current.dataset.prefetch='true';current.addEventListener('load',()=>{if(current.dataset.loaded==='true')ahead();},{once:true});}},
 observe(root){
  const imgs=root.querySelectorAll('img[data-photo-src]');
  if(!('IntersectionObserver' in window)){imgs.forEach(img=>PhotoLoader.load(img));return;}
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){PhotoLoader.load(entry.target);observer.unobserve(entry.target);}});},{root:root.classList?.contains('reader-scroll')?root:null,rootMargin:'180px'});
  imgs.forEach(img=>observer.observe(img));return observer;
 }
};
PhotoLoader.observe(document);
