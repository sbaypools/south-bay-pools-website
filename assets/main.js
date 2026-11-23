(function(){
  var header = document.getElementById('siteHeader');
  var burger = document.getElementById('burger');
  function onScroll(){ if(header) header.classList.toggle('scrolled', window.scrollY > 40 || header.classList.contains('open')); }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();
  if(burger){
    burger.addEventListener('click', function(){
      var open = header.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.textContent = open ? '\u2715' : '\u2630';
      onScroll();
    });
    document.querySelectorAll('#mobileMenu a').forEach(function(a){
      a.addEventListener('click', function(){ header.classList.remove('open'); burger.textContent='\u2630'; });
    });
  }
  var revealEls = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduce && 'IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold:.05, rootMargin:'0px 0px 240px 0px'});
    revealEls.forEach(function(el){ io.observe(el); });
    setTimeout(function(){ revealEls.forEach(function(el){ el.classList.add('in'); }); }, 1600);
  } else {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  }
  var lb = document.getElementById('lightbox');
  if(lb){
    var lbImg = document.getElementById('lbImg'), lbCap = document.getElementById('lbCap');
    document.querySelectorAll('.gal-item').forEach(function(btn){
      btn.addEventListener('click', function(){
        lbImg.src = btn.getAttribute('data-full');
        lbImg.alt = btn.querySelector('img').alt;
        lbCap.textContent = btn.getAttribute('data-cap');
        lb.classList.add('open');
      });
    });
    function closeLb(){ lb.classList.remove('open'); lbImg.removeAttribute('src'); }
    document.getElementById('lbClose').addEventListener('click', closeLb);
    lb.addEventListener('click', function(e){ if(e.target === lb) closeLb(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeLb(); });
  }
  var form = document.getElementById('bookForm');
  if(form){
    var msg = document.getElementById('formMsg');
    function collect(){
      return {
        name: document.getElementById('fName').value.trim(),
        phone: document.getElementById('fPhone').value.trim(),
        service: document.getElementById('fService').value,
        city: document.getElementById('fCity').value.trim(),
        extra: document.getElementById('fMsg').value.trim()
      };
    }
    function buildText(d){
      var lines = ['Hi South Bay Pools! I\'d like a free estimate.','', 'Name: ' + d.name, 'Phone: ' + d.phone, 'Service: ' + d.service];
      if(d.city) lines.push('Area: ' + d.city);
      if(d.extra) lines.push('Details: ' + d.extra);
      return lines.join('\n');
    }
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var d = collect();
      if(!d.name || !d.phone){ msg.style.display='block'; msg.textContent='Please add your name and phone number so we can reach you.'; return; }
      msg.style.display='block'; msg.textContent='Opening WhatsApp with your estimate request\u2026';
      window.open('https://wa.me/17864951610?text=' + encodeURIComponent(buildText(d)), '_blank');
    });
    document.getElementById('emailBtn').addEventListener('click', function(){
      var d = collect();
      if(!d.name || !d.phone){ msg.style.display='block'; msg.textContent='Please add your name and phone number so we can reach you.'; return; }
      window.location.href = 'mailto:sbaypoolsmiami@gmail.com?subject=' + encodeURIComponent('Free estimate request \u2014 ' + d.service) + '&body=' + encodeURIComponent(buildText(d));
    });
  }
  /* free-estimate popup: show once per visitor, 10s after load */
  try{
    if(!localStorage.getItem('sbp_pop_seen')){
      setTimeout(function(){
        if(localStorage.getItem('sbp_pop_seen')) return;
        var pop = document.createElement('div');
        pop.className = 'sbp-pop';
        pop.setAttribute('role','dialog');
        pop.setAttribute('aria-label','Free estimate');
        pop.innerHTML = '<div class="sbp-pop-card"><button class="sbp-pop-x" type="button" aria-label="Close">\u2715</button><h2>Is your pool green, cloudy, or stained?</h2><p>Get a free estimate \u2014 message us and we\'ll take a look.</p><a class="sbp-pop-btn" href="https://wa.me/17864951610?text=' + encodeURIComponent("Hi South Bay Pools! I'd like a free estimate.") + '">Get my free estimate</a><small>Serving Miami-Dade \u00b7 No obligation</small></div>';
        document.body.appendChild(pop);
        function closePop(){ pop.classList.remove('open'); localStorage.setItem('sbp_pop_seen','1'); }
        pop.querySelector('.sbp-pop-x').addEventListener('click', closePop);
        pop.addEventListener('click', function(e){ if(e.target === pop) closePop(); });
        document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && pop.classList.contains('open')) closePop(); });
        pop.classList.add('open');
      }, 10000);
    }
  }catch(err){}
})();
