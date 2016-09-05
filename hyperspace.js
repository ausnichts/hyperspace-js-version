/*--------------------------------------------------------------------------*
 *
 *  Copyright (c) 2016 IMUZA.com http://www.imuza.com
 *  Released under the MIT license
 *  
 *  Includes SmoothScroll JavaScript Library V2
 *  MIT-style license. 
 *  2007-2011 Kazuma Nishihata 
 *  http://www.to-r.net
 *  
 *--------------------------------------------------------------------------*/

function SmoothScroll(a){
  if(document.getElementById(a.rel.replace(/.*\#/,""))){
    var e = document.getElementById(a.rel.replace(/.*\#/,"")).getBoundingClientRect();
  }else{
    return;
  }

  var m = window.getComputedStyle(document.getElementById('container'), '').paddingTop.match(/\d+/);

  //Move point
  var end = e.top  + window.pageYOffset - m;
  var docHeight = document.documentElement.scrollHeight;
  var winHeight = window.innerHeight || document.documentElement.clientHeight
  if(docHeight-winHeight<end){
    var end = docHeight-winHeight;
  }

  //Current Point
  var start=window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

  var flag=(end<start)?"up":"down";

  function scrollMe(start,end,flag) {
    setTimeout(
      function(){
        if(flag=="up" && start >= end){
          start=start-(start-end)/20-1;
          window.scrollTo(0,start)
          scrollMe(start,end,flag);
        }else if(flag=="down" && start <= end){
          start=start+(end-start)/20+1;
          window.scrollTo(0,start)
          scrollMe(start,end,flag);
        }else{
          scrollTo(0,end);
        }
        return ;
      }
      ,10
    );

  }

  scrollMe(start,end,flag);

  Array.prototype.forEach.call(document.getElementById('panel-inner').querySelectorAll('li'), function(element){element.classList.remove('active')});
  a.parentNode.classList.add('active');
  toggleNavPanel();
}

function toggleNavPanel() {
  document.getElementById('bottom-editarea').classList.toggle('visible');
}

function setPrevUrl(){
  var prevUrl = sessionStorage.getItem('prevUrl'),
    arr = new Array();
  if (prevUrl !== null) arr = JSON.parse(prevUrl);
  arr.unshift(window.location.href);
  sessionStorage.setItem('prevUrl', JSON.stringify( arr ));
  location.href = document.getElementById('pager-next').getAttribute('rel');
}

function getPrevUrl() {
  var prevUrl = sessionStorage.getItem('prevUrl'),
    arr = new Array();
  arr = JSON.parse(prevUrl);
  var href = arr.shift();
  (arr.length === 0) ? sessionStorage.removeItem('prevUrl') : sessionStorage.setItem('prevUrl', JSON.stringify( arr ));
  location.href = href;
}


// start
(function(){

  var ua = window.navigator.userAgent,
    browser = '';
  if(document.uniqueID && !window.matchMedia){
    browser = 'IE9';
  } else if (/Android/.test(ua) && /Linux; U;/.test(ua) && !/Chrome/.test(ua)) {
    browser = 'android';
  } else if(/Macintosh/.test(ua) && /Version/.test(ua)) {
    if(ua.match(/^.+Version\/(\d+).+$/)[1] < 7) browser = 'oldMac';
  } else if((/iPhone/.test(ua) || /iPad/.test(ua)) && /Version/.test(ua)) {
    if(ua.match(/^.+Version\/(\d+).+$/)[1] < 8) browser = 'oldiOS';
  }

  var page = document.body.className,
    navPanel = document.getElementById('panel-inner'),
    fragment = document.createDocumentFragment(),
    tmplDiv = document.createElement('Div'),
    tmplLi = document.createElement('li'),
    tmplSpan = document.createElement('span'),
    tmplAnchor = document.createElement('a'),
    flgStorage = window.localStorage ? true : false;
  tmplAnchor.setAttribute('href', 'javascript:void(0)');

  switch (browser){
    case 'IE9':
    case 'oldMac':
      var elementUl = document.createElement('ul'),
        elementLi = tmplLi.cloneNode(true),
        elementAnchor = tmplAnchor.cloneNode(true);
      elementAnchor.setAttribute('href', 'http://' + document.domain);
      elementAnchor.textContent = 'HOME';
      elementLi.appendChild(elementAnchor);
      fragment.appendChild(elementLi);

      var elementLi = tmplLi.cloneNode(true),
        elementAnchor = tmplAnchor.cloneNode(true);
      elementAnchor.setAttribute('rel', '#container');
      elementAnchor.addEventListener('click', function(){SmoothScroll(this)}, false);
      elementAnchor.textContent = 'PAGE TOP';
      elementLi.appendChild(elementAnchor);
      fragment.appendChild(elementLi);

      if(document.getElementById('box2').querySelector('.hatena-module') !== null) {
        var elementLi = tmplLi.cloneNode(true),
          elementAnchor = tmplAnchor.cloneNode(true);
        elementAnchor.setAttribute('rel', '#box2');
        elementAnchor.addEventListener('click', function(){SmoothScroll(this)}, false);
        elementAnchor.textContent = 'SIDEBAR';
        elementLi.appendChild(elementAnchor);
        fragment.appendChild(elementLi);
      }

      var elementLi = tmplLi.cloneNode(true);
      elementLi.textContent = '当サイトはChrome,Firefox,Safari最新版,IE11以上推奨です';
      elementLi.style.whiteSpace = 'normal';
      elementLi.style.paddingTop = '20px';
      elementLi.style.paddingBottom = '10px';
      elementLi.style.color = '#fff';
      fragment.appendChild(elementLi);
      elementUl.appendChild(fragment);
      navPanel.appendChild(elementUl);
      break;

    case 'android':
    case 'oldiOS':
      document.getElementById('trigger').style.display = 'none';
      break;
    default:

      var elementDiv = tmplDiv.cloneNode(true),
        elementSpan = tmplSpan.cloneNode(true),
        elementAnchor = tmplAnchor.cloneNode(true);
      
      elementAnchor.setAttribute('href', 'http://' + document.domain);
      elementSpan.classList.add('pager-prev');
      elementSpan.appendChild(elementAnchor);
      elementDiv.appendChild(elementSpan);

      var elementSpan = tmplSpan.cloneNode(true),
        elementAnchor = tmplAnchor.cloneNode(true);
      elementAnchor.setAttribute('rel', '#header-container');
      elementAnchor.addEventListener('click', function(){SmoothScroll(this)}, false);
      elementSpan.classList.add('pager-next');
      elementSpan.appendChild(elementAnchor);
      elementDiv.classList.add('pager-top');
      elementDiv.appendChild(elementSpan);

      fragment.appendChild(elementDiv);

      if (page.indexOf('page-index') !== -1) {

        var elementDiv = tmplDiv.cloneNode(true);
        elementDiv.textContent = '最新記事';
        elementDiv.classList.add('hatena-module-title');
        fragment.appendChild(elementDiv);

        var elementUl = document.createElement('ul'),
          entries = document.querySelectorAll('.entry');

        Array.prototype.forEach.call(entries, function(entry) {
          var elementAnchor = tmplAnchor.cloneNode(true),
            elementLi = tmplLi.cloneNode(true);
          elementAnchor.textContent = entry.getElementsByTagName('h1')[0].textContent;
          elementAnchor.setAttribute('rel', '#' + entry.id);
          elementAnchor.addEventListener('click',function(){SmoothScroll(this)}, false); 
          elementLi.appendChild(elementAnchor);
          elementUl.appendChild(elementLi);
        });
        fragment.appendChild(elementUl);

        var elementDiv = tmplDiv.cloneNode(true);
        elementDiv.classList.add('pager-page');
        if (flgStorage && sessionStorage.getItem('prevUrl')) {
          var elementSpan = tmplSpan.cloneNode(true),
            elementAnchor = tmplAnchor.cloneNode(true);
          elementAnchor.textContent = '前のページ';
          elementAnchor.addEventListener('click', getPrevUrl, false);
          elementSpan.classList.add('pager-prev');
          elementSpan.appendChild(elementAnchor);
          elementDiv.appendChild(elementSpan);
        }
        if (document.querySelector('.autopagerize_insert_before') !== null) {
          var elementSpan = document.querySelector('.autopagerize_insert_before .pager-next').cloneNode(true);
          if (flgStorage){
            var elementAnchor = elementSpan.getElementsByTagName('a')[0];
            elementAnchor.setAttribute('rel', elementAnchor.getAttribute('href'));
            elementAnchor.setAttribute('href', 'javascript:void(0)');
            elementAnchor.addEventListener('click', setPrevUrl, false);
            elementAnchor.id = 'pager-next';
          }
          elementDiv.appendChild(elementSpan);
        }
        fragment.appendChild(elementDiv);

        // Socialボタン削除
//        Array.prototype.forEach.call(document.querySelectorAll('.entry-footer'), function(node) {
//            node.parentNode.removeChild(node);
//        });

      } else if (page.indexOf('page-entry') !== -1) {

        var related = document.querySelector('.hatena-module-related-entries');
        if(related !== null) {
          fragment.appendChild(related.getElementsByClassName('hatena-module-title')[0].cloneNode(true));

          var elementUl = document.createElement('ul'),
            entries = document.querySelectorAll('.related-entries-title');

          Array.prototype.forEach.call(entries, function(entry) {
            var elementLi = tmplLi.cloneNode(true);
            elementLi.appendChild(entry.cloneNode(true));
            elementUl.appendChild(elementLi);
          });
          fragment.appendChild(elementUl);

        }

      } else if (page.indexOf('page-archive-category') !== -1) {

        var category = document.querySelector('.hatena-module-category');
        if(category !== null) {
          fragment.appendChild(category.getElementsByClassName('hatena-module-title')[0].cloneNode(true));
          var elementUl = category.getElementsByTagName('ul')[0].cloneNode(true);
          elementUl.classList.remove('hatena-urllist');
          var elementLi = elementUl.children;
          var matches = location.href.match(/^.*\/(.*)$/),
            activeCategory = decodeURI(matches[1]);
          for(var i=0; i<elementLi.length; i++) {
            if(elementLi[i].textContent.indexOf(activeCategory) !== -1) elementLi[i].classList.add('active');
          }
          fragment.appendChild(elementUl);
        }

      } else if (page.indexOf('page-archive') !== -1 || page.indexOf('page-entries-year-month-day') !== -1) {

        var elementDiv = tmplDiv.cloneNode(true),
          elementAnchor = tmplAnchor.cloneNode(true);
        elementAnchor.setAttribute('href', 'http://' + document.domain + '/archive');
        elementAnchor.textContent = '月間アーカイブ';
        elementDiv.classList.add('hatena-module-title');
        elementDiv.appendChild(elementAnchor);
        fragment.appendChild(elementDiv);

        var elementDiv = tmplDiv.cloneNode(true),
          elementDivBody =tmplDiv.cloneNode(true);
        elementDivBody.classList.add('hatena-module-body');
        elementDiv.classList.add('hatena-module-archive');
        elementDiv.setAttribute('data-archive-type', 'calendar');
        elementDiv.appendChild(elementDivBody);
        fragment.appendChild(elementDiv);

      } else if (page.indexOf('page-about') !== -1) {

        var links = document.querySelector('.hatena-module-links');
        if(links !== null) {
          fragment.appendChild(links.getElementsByClassName('hatena-module-title')[0].cloneNode(true));
          var elementUl = links.getElementsByTagName('ul')[0].cloneNode(true);
          elementUl.classList.remove('hatena-urllist');
          fragment.appendChild(elementUl);
        }

      }

      if(document.getElementById('box2').querySelector('.hatena-module') !== null) {
        var elementDiv = tmplDiv.cloneNode(true),
          elementSpan = tmplSpan.cloneNode(true),
          elementAnchor = tmplAnchor.cloneNode(true);
        elementAnchor.setAttribute('rel', '#box2');
        elementAnchor.addEventListener('click', function(){SmoothScroll(this)}, false);
        elementSpan.classList.add('pager-next');
        elementSpan.appendChild(elementAnchor);
        elementDiv.classList.add('pager-box2');
        elementDiv.appendChild(elementSpan);

        fragment.appendChild(elementDiv);
      }
      navPanel.appendChild(fragment);

      document.getElementById('trigger').addEventListener('click', toggleNavPanel, false);
      break;
  }

})();
