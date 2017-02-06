// ==UserScript==
// @name           rzxtension
// @namespace      rzxtension
// @description    Adiciones al sitio
// @include        http://*managerzone.*
// @grant          none
// @version        0.1
// @copyright      GNU/GPL v3
// @authors        rhonaldomaster
// @credits        MZScript por c_c (c_c@managerzone.com) | serbocapo (serbocapo@managerzone.com)
// ==/UserScript==
var rxtension = (function () {
  var sports = ['','soccer','hockey'];
  var init = function () {
    styling();
    forumQuickLinks();
    quickLinks();
    linkToSeniorLeague();
    fixLogoEditor();
    visualTrainingBalls();
    forumPagination();
    renderCCBar();
    renderPostQuicklinks();
    previewResults();

    setTimeout(function () {
      playersMatchValue();
    },500);

    $(document).on('click','.training_report_header',visualTrainingBalls);
  };

  var styling = function () {
    var css = '#notifications-wrapper{bottom:-2px;}.quicklink{background-color:#4A4A4A;border-radius:4px;box-shadow:0 0 1px 0 #000;color:#FFF;display:inline-block;margin-left:4px;padding:2px 4px;text-decoration:none;transition:0.5s ease all;}.quicklink:hover{background-color:#000000;box-shadow:0 0 2px 0 #000000;color:#FFFFFF;transform:scale(1.1);text-decoration:none;}.quicklinks{padding:0 4px 8px;text-align:center;}';
    if (typeof GM_addStyle != 'undefined') {
      GM_addStyle(css);
    }
    else if (typeof PRO_addStyle != 'undefined') {
      PRO_addStyle(css);
    }
    else if (typeof addStyle != 'undefined') {
      addStyle(css);
    }
    else {
      var heads = document.querySelectorAll('head');
      if (heads.length > 0) {
        var node = document.createElement('style');
        node.type = 'text/css';
        node.appendChild(document.createTextNode(css));
        heads[0].appendChild(node);
      }
    }
  };

  var linkToSeniorLeague = function () {
    var wrapper = document.querySelector('#match-info-wrapper');

    if (wrapper) {
      var h1 = wrapper.querySelector('h1'), text = h1.innerHTML, i18nLeague = ['Liga','League'];
      if (i18nLeague.indexOf(text) > -1) {
        h1.innerHTML = '<a href="?p=league&type=senior">'+text+'</a>';
      }
    }
  };

  var fixLogoEditor = function () {
    var url = window.location.href.split('=');

    if (url[1].indexOf('team') > -1 && url[2].indexOf('alter') > -1) {
      $(document).on('click','#ui-id-2',function (ev) {
        setTimeout(function () {
          var container = document.querySelector('#logo_editor embed');
          container.width = '100%';
        },2000);
      });
    }
  };

  var createButtonLinks = function (selectorType,selector,wrapper,links,prepend) {
    var container = document.querySelector(selectorType+selector);
    var target = '', html = '<div '+(selectorType=='.' ? 'class':'id')+'="'+selector+'">';

    for (var i = 0; i < links.length; i++) {
      target = links[i].url.indexOf('?p=')<0 ? ' target="_blank"':'';
      html += '<a class="quicklink" href="'+(links[i].url)+'"'+(target)+' title="'+(links[i].title)+'">'+(links[i].text)+'</a>';
    }
    html += '</div>';
    if (!container) {
      var where = prepend ? 'afterbegin' : 'beforeend';
      wrapper.insertAdjacentHTML(where,html);
    }
  };

  var forumQuickLinks = function () {
    var links = [
      {text: 'MER', title: 'Mercado(Transfers)', url: '?p=forum&sub=topics&forum_id=254&sport=soccer'},
      {text: 'AMI', title: 'Amistosos', url: '?p=forum&sub=topics&forum_id=249&sport=soccer'},
      {text: 'MZH', title: 'MZ Habla', url: '?p=forum&sub=topics&forum_id=253&sport=soccer'},
      {text: 'PYR', title: 'Preguntas y Respuestas', url: '?p=forum&sub=topics&forum_id=255&sport=soccer'},
      {text: 'DA', title: 'Discusi&oacute;n Abierta', url: '?p=forum&sub=topics&forum_id=250&sport=soccer'},
      {text: 'FED', title: 'Federaciones', url: '?p=forum&sub=topics&forum_id=251&sport=soccer'},
      {text: 'HDC', title: 'Hablemos de copas', url: '?p=forum&sub=topics&forum_id=252&sport=soccer'}
    ];
    createButtonLinks('.','js-forum-buttons',document.querySelector('#notifications-wrapper'),links,false);
  };

  var quickLinks = function () {
    var links = [
      {text: 'Monitoreo', title:'Monitoreo',url:'?p=transfer&sub=yourplayers'},
      {text: 'Vista Alternativa', title:'Ver Vista Alternativa',url:'?p=players&sub=alt'},
      {text: 'Seguimiento', title:'Ir a Seguimiento',url:'?p=shortlist'},
      {text: 'Finanzas', title:'Ver Finanzas',url:'?p=economy'},
      {text: 'Mercado', title:'Ver Mercado',url:'?p=transfer'},
      {text: 'Jugados', title:'Ver los Partidos Jugados',url:'?p=match&sub=played'},
      {text: 'Pr&oacute;ximos', title:'Ver los Pr&oacute;ximos Partidos',url:'?p=match&sub=scheduled'},
      {text: 'T&aacute;cticas', title:'Ir a T&aacute;cticas',url:'?p=tactics'},
      {text: 'Lesiones/Sanciones', title:'Ver Lesionados/Sancionados',url:'?p=players&sub=unavailable'},
      {text: 'Reporte entr.', title:'Ver el Reporte de Entrenamiento',url:'?p=training_report'},
      {text: 'Entrenamiento', title:'Ir al Entrenamiento General',url:'?p=training'},
      {text: 'MZ Plus', title:'Skiller MZ Plus',url:'http://mzplus.startlogic.com/p'},
      {text: 'Imgur', title:'Ir a Imgur',url:'http://imgur.com/'}
    ];
    createButtonLinks('.','quicklinks',document.querySelector('#contentDiv'),links,true);
  };

  var visualTrainingBalls = function () {
    setTimeout(function () {
      var container = document.querySelector('#training_report');
      if (container) {
        var table = container.childNodes[2], tbody = table.querySelector('tbody');
        var cell, balls = 0;

        for (var i = 0; i < tbody.rows.length; i++) {
          cell = tbody.rows[i].cells[4];
          balls = cell.querySelectorAll('img').length;
          cell.querySelector('div').innerHTML += '<b>('+balls+')</b>';
        }
      }
    },1500);
  };

  var toLocaleCurrency = function (value,currency) {
    var currencies = {
      'USD': 7.4234,
      'EUR': 9.1775,
      'SEK': 1,
      'MM': 1,
      'UYU': 0.256963,
      'R$': 2.62589,
      'GBP': 13.35247,
      'DKK': 1.23522,
      'NOK': 1.07245,
      'CHF': 5.86737,
      'CAD': 5.70899,
      'AUD': 5.66999,
      'ILS': 1.6953,
      'MXN': 0.68576,
      'ARS': 2.64445,
      'BOB': 0.939,
      'PYG': 0.001309,
      'RUB': 0.26313,
      'PLN': 1.95278,
      'ISK': 0.10433,
      'BGL': 4.70738,
      'BGN': 4.70738,
      'ZAR': 1.23733,
      'US$': 7.4234,
      'THB': 0.17079,
      'SIT': 0.03896,
      'SKK': 0.24946,
      'JPY': 0.06,
      'INR': 0.17,
      'MZ': 1
    };
    var locale = 0, toSEK = 1 / currencies[currency], cCurrency = localStorage.getItem('moneda');

    if (cCurrency) {
      locale = Math.round( (1 / currencies[cMoneda]) * (value / toSEK) );
    }
    else {
      locale = Math.round( (1 / currencies['USD']) * (value / toSEK) );
    }
    return locale;
  };

  var formatMoney = function (value) {
    var result = '', number = value.toString();

    while (number.length > 3) {
      result = '.' + number.substr(number.length - 3) + result;
      number = number.substring(0, number.length - 3);
    }
    result = number + result;
    return result;
  };

  var playersMatchValue = function () {
    var teamsDiv = document.querySelectorAll('.team-table');
    var links;

    if (teamsDiv) {
      for (var i = 0; i < teamsDiv.length; i++) {
        links = teamsDiv[i].querySelectorAll('a');
        renderTeamValue(links[0].href.split('&')[1].split('=')[1], i);
      }
    }
  };

  var renderTeamValue = function (teamId, teamOrder) {
    var teamTable = document.querySelectorAll('#match-statistics .hitlist_wrapper_background table')[teamOrder];

    if (teamTable) {
      var ajax = $.ajax({
        url: '/xml/team_playerlist.php',
        type: 'GET',
        data: {sport_id: sports.indexOf(ajaxSport), team_id: teamId}
      });
      ajax.done(function (data) {
        var link, playerData = null, playerId = 0, playing11Value = 0, playing11 = 0, playerValue = 0;

        var firstRow = teamTable.rows[0];
        var tableBody = teamTable.querySelector('tbody');
        var currency = data.getElementsByTagName('TeamPlayers')[0].getAttribute('teamCurrency');
        var tableFoot = teamTable.querySelector('tfoot');
        var totalsRow = tableFoot.rows[1];

        firstRow.innerHTML = '<td>Valor</td>' + firstRow.innerHTML;
        for (var i = 0; i < tableBody.rows.length; i++) {
          if (tableBody.rows[i].querySelector('img')) {
            tableBody.rows[i].cells[0].colSpan = '13';
          }
          else {
            link = tableBody.rows[i].querySelector('a');
            playerId = link.href.split('&')[1].split('=')[1];
            playerData = getPlayerData(data,playerId);
            if (playerData) {
              playing11 += 1;
              playerValue = toLocaleCurrency(playerData.getAttribute('value'),currency);
              tableBody.rows[i].innerHTML = '<td style="width:62px;text-align:right;padding-right:15px">'+(formatMoney(playerValue))+'</td>' + tableBody.rows[i].innerHTML;
              if (playing11<12) {
                playing11Value += playerValue;
              }
            }
          }
        }

        totalsRow.innerHTML = '<td style="width:62px;text-align:right;padding-right:15px">'+(formatMoney(playing11Value))+'</td>' + totalsRow.innerHTML;
        tableFoot.rows[3].cells[0].colSpan = '13';
      });
    }
  };

  var getPlayerData = function (teamXML,playerId) {
    var player = null;
    var players = teamXML.getElementsByTagName('Player');

    for (var i = 0; i < players.length; i++) {
      if (playerId == players[i].getAttribute('id')) {
        player = players[i];
      }
    }
    return player;
  };

  var forumPagination = function () {
    var url = window.location.href.split('&');

    if (url[1] == 'sub=topics') {
      var link, counterDiv, text, messageCount, pageQuantity, html, limit;
      var posts = document.querySelectorAll('#topics-list > dd');

      for (var i = 0; i < posts.length; i++) {
        link = posts[i].querySelector('.topics-col-title').querySelector('a').getAttribute('href');
        counterDiv = posts[i].querySelector('.topics-col-counter');
        text = (counterDiv.innerText || counterDiv.textContent).split(' / ');
        messageCount = parseInt(text[1]);
        pageQuantity = Math.floor(parseInt(messageCount) / 50);

        if (pageQuantity > 0 && messageCount > 50) {
          html = '';
          limit = pageQuantity > 5 ? 5 : (pageQuantity + 1);
          for (var j = 2; j < limit; j++) {
            html += '<a href="'+(link)+'&offset='+((j-1)*50)+'" title="Ir a p&aacute;gina '+(j)+'">'+(j)+'</a>&#160;';
          }
          if (pageQuantity > 4) {
            html += '<a href="'+(link)+'&offset='+(messageCount%50 == 0? messageCount-50:pageQuantity*50)+'" title="Ir a &uacute;ltima p&aacute;gina">&#187;</a>&#160;';
          }
          if (pageQuantity > 1) {
            html = '['+(html)+']';
          }
          counterDiv.insertAdjacentHTML('beforeend',html);
        }
      }
    }
  };

  var getCCButtons = function () {
    var html =
      '<div>'
        +'<div class="mzbtn buttondiv button_account" title="Insertar Tabla LA-liga">'
          +'<span class="buttonClassMiddle" style="white-space: nowrap" id="btnTabla">Tabla LA/liga</span><span class="buttonClassRight">&nbsp;</span>'
        +'</div>'
        + '<div class="mzbtn buttondiv button_account" title="Subir im&aacute;genes a ImgUr">'
          +'<span class="buttonClassMiddle" style="white-space: nowrap" id="upImg">ImgUr</span><span class="buttonClassRight">&nbsp;</span>'
        +'</div>'
        + '<div class="mzbtn buttondiv button_account" title="Borrar texto del area de mensaje">'
          +'<span class="buttonClassMiddle js-empty-post-textarea" style="white-space: nowrap">Vaciar</span><span class="buttonClassRight">&nbsp;</span>'
        +'</div>'
        + '<div class="js-icons-container">'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/icon_arrow.gif" alt=">"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/22-good.gif" title="(y)" alt="(y)"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/23-bad.gif" title="(n)" alt="(n)"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/wtf.gif" height="20px" title="wtf" alt="wtf"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/fail2.gif" height="20px" title="fail" alt="fail"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/repost.gif" height="20px" title="repost" alt="repost"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/cricri.gif" title="cri" alt="cri"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/nelson.gif" title="ha-ha" alt="ha-ha"/>'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/icon_smile.gif" title=":)" alt=":)"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/ya.gif" title=":D" alt=":D"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/jao.gif" title="D" alt="D"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/icon_xd.gif" title="xD" alt="xD"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/bu.gif" title=":/" alt=":/"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/sad.gif" title=":(" alt=":("/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/icon_crying.gif" title=":*(" alt=":*("/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/07-icon_confused.gif" title=":S" alt=":S"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/thshifty.gif" title="erm" alt="erm"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/08-icon_rolleyes.gif" title="8-)" alt="8-)"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/09-.png" title="¬¬" alt="¬¬"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/porfi.png" title="porfi" alt="porfi"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/icon_eek.gif" title="O.O" alt="O.O"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/uhm.gif" title="_hm" alt="_hm"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/wooh.gif" title="evil" alt="evil"/><br />'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/icon_evil.gif" title=">:(" alt=">:("/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/icon_twisted.gif" title=">:)" alt=">:)"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/winky.gif" title="flirt" alt="flirt"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/tong.gif" title=":P" alt=":P"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/stare.gif" title="|-(" alt="|-("/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/icon_wink.gif" title=";)" alt=";)"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/icon_cool.gif" title="(h)" alt="(h)"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/19-uu.png" title="u.u" alt="u.u"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/shh.gif" title="shh" alt="shh"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/nu.gif" title="nana" alt="nana"/>'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/24-rock.gif" height="23px" title="rock" alt="rock"/>'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/protest.gif" title="grr" alt="grr"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/jaja.gif" height="23px" title="jaja" alt="jaja"/>'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/eeh.gif" title="eah" alt="eah"/>'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/clap.gif" title="clap" alt="clap"/>'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/bla.gif" title="bla" alt="bla"/>'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/ele.gif" title="l" alt="l"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/mad.gif" title="grr" alt="grr"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/angel.gif" title="angel" alt="angel"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/devil.gif" title="diablo" alt="diablo"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/baba.gif" title="baba" alt="baba"/>'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/fool.gif" height="23px" title="x)" alt="x)"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/plz.gif" title="plz" alt="plz"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/umm.gif" title="umm" alt="umm"/>'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/facepalm.gif" title="facepalm" alt="facepalm"/>&nbsp;'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/sleep.gif" title="zzz" alt="zzz"/>'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/36-omm.gif" title="om" alt="om"/>'
          + '<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/iconos/uh.gif" title="uh" alt="uh"/>'
        + '</div>'
        + '<div id="contenedor" style="border: 5px solid green;font-weight:bold;display:none;width:430px; padding:5px;margin:auto">'
          + 'Arrastre su imagen a este espacio <button id="btnUpImg">O clickee ac&aacute; para elegirla</button> <input style="visibility: collapse; width: 0px;" id="subidor" type="file">'
          + '<p id="error" style="font-weight:bold;color:red">Error. El archivo seleccionado no es una imagen.</p><p id="pe">Cargando imagen <img src="http://managerzone.se/img/loading.gif"> &nbsp;espere por favor.</p><p id="link"></p>'
        +'</div>'
      +'</div>';
    return html;
  };

  var cancelEvent = function (ev) {
    ev.preventDefault();
  };

  var upload = function (file) {
    var link = document.querySelector('#link');
    var error = document.querySelector('#error');
    var pe = document.querySelector('#pe');
    if (!file || !file.type.match(/image.*/)) {
      link.style.display = 'none';
      pe.style.display = 'none';
      error.style.display = 'block';
    }
    else {
      link.style.display = 'none';
      pe.style.display = 'block';
      error.style.display = 'none';

      var formData = new FormData();
      formData.append('image', file);
      var ajax = $.ajax({
        type: 'post',
        url: 'https://api.imgur.com/3/upload.json',
        data: formData,
        headers: {
          "authorization": "Client-ID 4306d20a28c0e7a"
        }
      });
      ajax.done(function (data) {
        link.style.display = 'block';
        pe.style.display = 'none';
        error.style.display = 'none';

        var json = JSON.parse(data);
        var url = json.data.link;
        link.innerHTML = '<a href="'+(url)+'">'+(url)+'</a>';
      });
    }
  };

  var uploadFile = function (ev) {
    ev.preventDefault();
    upload(event.dataTransfer.files[0]);
  };

  var handleUploadClick = function (ev) {
    ev.preventDefault();
    document.querySelector('#subidor').click();
  };

  var postItem = function (html) {
    var textarea = document.querySelector('#forum_form_message');
    var scrollTop = textarea.scrollTop;
    var selectionStart = textarea.selectionStart;
    var selectionEnd = textarea.selectionEnd;

    textarea.value = textarea.value.substr(0, selectionStart) + html + textarea.value.substr(selectionEnd, textarea.value.length);
    textarea.scrollTop = scrollTop;
  };

  var postSmiley = function (ev) {
    var img = ev.target;
    var url = img.getAttribute('src');
    var html = '[image url='+url+']';
    postItem(html);
  };

  var postTable = function (ev) {
    var html = '';
    var data = prompt('Ingrese el usuario para la liga oficial o el ID de la liga amistosa');
    if (data) {
      if (data == '') {
        alert('No ha ingresado correctamente el usuario/id. Vuelva a intentarlo, por favor.');
      }
      else {
        if (isNaN(data)) {
          html = '[image url=http://mzplus.startlogic.com/imgdin_liga?user=' + data + ']';
        }
        else {
          html = '[image url=http://mzplus.startlogic.com/imgdin_liga?user=&idla=' + data + ']'
        }
        postItem(html);
      }
    }
  };

  var emptyPostTextarea = function (ev) {
    var textarea = document.querySelector('#forum_form_message');
    textarea.value = '';
  };

  var toggleUploadForm = function (ev) {
    var container = document.querySelector('#contenedor');
    if (container.style.display == 'none') {
      if (window.opera) {
        container.innerHTML = '<span style="color:red;padding:3px"> Opera no soporta la posibilidad de subir imágenes directamente. <br /><span style="color:green">&nbsp;Firefox s&iacute;, apoya una web libre! <a href="https://affiliates.mozilla.org/link/banner/12520/3/18"><img src="http://affiliates-cdn.mozilla.org/media/uploads/banners/download-small-blue-ES.png" class="cursor" /></a></span></span>';
      }
      container.style.display = 'block';
    }
    else {
      container.style.display = 'none';
    }
  };

  var setCCBarEvents = function () {
    $(document).on('click','#btnUpImg',handleUploadClick)
      .on('click','.js-icons-container img',postSmiley)
      .on('click','#btnTabla',postTable)
      .on('click','#upImg',toggleUploadForm)
      .on('click','.js-empty-post-textarea',emptyPostTextarea)
      .on('dragover','#contenedor',cancelEvent)
      .on('drop','#contenedor',uploadFile)
      .on('change','#subidor',function () {
        upload(this.files[0]);
      });
  };

  var renderCCBar = function () {
    var url = window.location.href.split('&');
    if (url[1] == 'sub=topics') {
      setTimeout(function () {
        var container = document.querySelector('.bbcode');
        if (container) {
          var html = getCCButtons();
          container.insertAdjacentHTML('afterbegin',html);
          setCCBarEvents();
        }
      },1000);
    }
  };

  var renderPostQuicklinks = function () {
    var url = window.location.href.split('&');
    if (url[1] == 'sub=topic') {
      var posts = document.querySelectorAll('.forum_body');
      var forum = url[3].replace('forum_id=', '');
      var author, authorContainer, authorId, authorName, authorTeamId, badgeContainer, html = '';
      var titles = ['Ir al GB', 'Posts recientes', 'Invitar amistoso'];

      for (var i = 0; i < posts.length; i++) {
        author = posts[i].querySelector('.post-author');
        authorContainer = author.querySelector('a');
        authorId = authorContainer.href.split('&')[1].replace('uid=','');
        authorName = authorContainer.innerHTML;
        badgeContainer = posts[i].querySelector('.forum-post-badges');
        authorTeamId = badgeContainer.querySelector('img').src.split('=')[1].replace('&sport','');

        html = '<a class="quicklink" href="/?p=guestbook&uid='+authorId+'" title="'+titles[0]+'">Guestbook</a>'
          +'<a class="quicklink" href="?p=forum&sub=search&search_keywords=&search_keyword_type=any&search_author='+authorName+'&search_forum='+forum+'&search_range=7&search_sort_by=post_date&search_sort_order=desc" title="'+titles[1]+'">Posts</a>'
          +'<a class="quicklink" href="?p=team&sub=challenge&tid='+authorTeamId+'" title="'+titles[2]+'">Amistosos</a>';

        author.insertAdjacentHTML('beforeend',html);
      }
    }
  };

  return {
    init: init
  };
})();

rxtension.init();
