// ==UserScript==
// @name           rzscript
// @namespace      rzscript
// @description    Optimized version of original MZScript
// @include        http://*managerzone.*
// @grant          none
// @version        0.1
// @copyright      GNU/GPL v3
// @authors        rhonaldomaster
// @credits        MZScript por c_c (c_c@managerzone.com) | serbocapo (serbocapo@managerzone.com)
// ==/UserScript==
var rzscript = (function () {
  var sports = ['','soccer','hockey'];
  var init = function () {
    // general
    styling();
    forumQuickLinks();
    quickLinks();
    linkify();
    renderSignatureDiv();

    //addons
    linkToSeniorLeague();

    //training
    visualTrainingBalls();

    //forum
    forumPagination();
    renderCCBar();
    renderPostQuicklinks();

    //matches
    previewResults();
    getCountryAndDiv();
    addComparators();
    renderTaxCalculationButton();
    setTimeout(function () {
      playersMatchValue();
    },500);

    //events
    $(document).on('click','.training_report_header',visualTrainingBalls);
  };

  var styling = function () {
    var css = '#pt-wrapper{bottom:52px;filter:alpha(opacity=50);opacity:0.5;}#notifications-wrapper{bottom:-2px;}.quicklink{background-color:#4A4A4A;border:0;border-radius:4px;box-shadow:0 0 1px 0 #000;color:#FFF;cursor:pointer;display:inline-block;margin-left:4px;padding:2px 4px;text-decoration:none;transition:0.2s ease-in-out all;}.quicklink:hover{background-color:#000000;box-shadow:0 0 2px 0 #000000;color:#FFFFFF;transform:scale(1.1);text-decoration:none;}.quicklinks{padding:0 4px 8px;text-align:center;}#fluid-menu-opener > div.sport-line,#top-wrapper-sport-line{background:#5d5b5f none repeat scroll 0 0;}';
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
    createButtonLinks('.','js-forum-buttons .quicklinks',document.querySelector('#notifications-wrapper'),links,false);
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
      {text: 'MZ Plus', title:'Skiller MZ Plus',url:'http://mzplus.info/p'},
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
    if (ajaxSport == 'soccer') {
      var teamsDiv = document.querySelectorAll('.team-table');
      var links;

      if (teamsDiv) {
        for (var i = 0; i < teamsDiv.length; i++) {
          links = teamsDiv[i].querySelectorAll('a');
          renderTeamValue(links[0].href.split('&')[1].split('=')[1], i);
        }
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
          html = '[image url=http://mzplus.info/imgdin_liga?user=' + data + ']';
        }
        else {
          html = '[image url=http://mzplus.info/imgdin_liga?user=&idla=' + data + ']'
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
    if (url[1] == 'sub=topics' || url[1] == 'sub=topic') {
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
      var titles = ['Ir al GB', 'Posts recientes del usuario', 'Invitar amistoso'],
        texts = ['Guestbook','Posts','Amistosos'];

      for (var i = 0; i < posts.length; i++) {
        author = posts[i].querySelector('.post-author');
        authorContainer = author.querySelector('a');
        authorId = authorContainer.href.split('&')[1].replace('uid=','');
        authorName = authorContainer.innerHTML;
        badgeContainer = posts[i].querySelector('.forum-post-badges');
        authorTeamId = badgeContainer.querySelector('img').src.split('=')[1].replace('&sport','');

        html = '<a class="quicklink" href="/?p=guestbook&uid='+authorId+'" title="'+titles[0]+'">'+texts[0]+'</a>'
          +'<a class="quicklink" href="?p=forum&sub=search&search_keywords=&search_keyword_type=any&search_author='+authorName+'&search_forum='+forum+'&search_range=7&search_sort_by=post_date&search_sort_order=desc" title="'+titles[1]+'">'+texts[1]+'</a>'
          +'<a class="quicklink" href="?p=team&sub=challenge&tid='+authorTeamId+'" title="'+titles[2]+'">'+texts[2]+'</a>';

        author.insertAdjacentHTML('beforeend',html);
      }
    }
  };

  var previewResults = function () {
    var url = window.location.href.split('&');

    if (url[1]=='sub=scheduled') {
      var container = document.querySelector('#results-fixtures-header');
      var html = '<div class="js-preview-results" style="float:right;cursor:pointer;border:2px solid #2A4CB0;width:20px;height:20px;padding:4px 0 0 4px;">'
        +'<img src="http://i915.photobucket.com/albums/ac355/ccc_vader/tmp_btn/fill-180_zps881d90f2.png" title="Ver resultados" alt="Ver resultados"/>'
      +'</div>';

      container.insertAdjacentHTML('afterbegin',html);
      $(document).on('click','.js-preview-results',getResults);
    }
  };

  var getResults = function (ev) {
    var matches = document.querySelectorAll('#fixtures-results-list > dd');
    var isPlaying = false, matchId, links, ajax, teamId;

    for (var i = 0; i < matches.length; i++) {
      links = matches[i].querySelectorAll('dl.action-panel a');
      isPlaying = links.length > 1;

      if (isPlaying) {
        matchId = links[0].href.split('&')[3].split('=')[1];
        ajax = $.ajax({
          url: '/xml/match_info.php',
          type: 'GET',
          data: {sport_id: sports.indexOf(ajaxSport), match_id: matchId}
        });
        (function (matchBlock) {
          ajax.done(function (data) {
            var score = {local: data.getElementsByTagName('Team')[0].getAttribute('goals'), visitor: data.getElementsByTagName('Team')[1].getAttribute('goals')};
            var matchScore = matchBlock.querySelector('.score-cell-wrapper > a');
            var myTeamId = matchScore.href.split('&')[2].split('=')[1];

            matchScore.innerHTML = score.local+' - '+score.visitor;

            if (score.local == score.visitor) {
              matchScore.className = 'yellow';
            }
            else if (myTeamId == data.getElementsByTagName('Team')[0].getAttribute('id')) {
              if (score.local > score.visitor) {
                matchScore.className = 'green';
              }
              else {
                matchScore.className = 'red';
              }
            }
            else if (myTeamId == data.getElementsByTagName('Team')[1].getAttribute('id')) {
              if (score.local < score.visitor) {
                matchScore.className = 'green';
              }
              else {
                matchScore.className = 'red';
              }
            }
          });
        })(matches[i]);
      }
    }
  };

  var getCountryAndDiv = function () {
    var url = window.location.href.split('=');
    var cups = ['private_cup&sub','cup&sub'],
      extraLeagues = ['u18','u21','u23','world','u18_world'],
      friendlyLeagues = ['friendlyseries&sub'];
    var containerSelector, clickedElementSelector;

    if (cups.indexOf(url[1]) > -1 || friendlyLeagues.indexOf(url[1]) > -1) {
      if (cups.indexOf(url[1]) > -1) {
        containerSelector = '#cup-div', clickedElementSelector = '#ui-id-4';
      }
      else if (friendlyLeagues.indexOf(url[1]) > -1) {
        containerSelector = '#friendly-series-div', clickedElementSelector = '#ui-id-2';
        if (url[2] == 'standings&fsid') {
          setTimeout(function () {
            renderDivAndCountryButton();
          },1000);
        }
      }

      $(document).on('click','.js-view-div-country',function () {
        if (cups.indexOf(url[1]) > -1) {
          renderDivAndCountry('#group-stages');
        }
        else if (friendlyLeagues.indexOf(url[1]) > -1) {
          renderDivAndCountry('#ui-tabs-2');
        }
      });

      $(containerSelector).on('click',clickedElementSelector,function () {
        setTimeout(function () {
          renderDivAndCountryButton();
        },1000);
      });
    }
  };

  var renderDivAndCountryButton = function () {
    var tableHeader = document.querySelectorAll('.nice_table thead tr.seriesHeader')[0];
    var firstCell = tableHeader.cells[0];

    firstCell.innerHTML = '<img class="js-view-div-country" src="http://i915.photobucket.com/albums/ac355/ccc_vader/bot/property-blue_zps058ec638.png" title="Ver divisi&oacute;n y pa&iacute;s" style="cursor:pointer;">';
  };

  var renderDivAndCountry = function (containerSelector) {
    var container = document.querySelector(containerSelector);
    var row, link, teamId, ajax;

    if (container) {
      var rows = container.querySelectorAll('.nice_table tbody > tr');

      for (var i = 0; i < rows.length; i++) {
        row = rows[i];
        link = row.querySelectorAll('a')[0];
        teamId = link.href.split('&')[1].replace('tid=', '');
        ajax = $.ajax({
          url: '/xml/manager_data.php',
          type: 'GET',
          data: {sport_id: sports.indexOf(ajaxSport), team_id: teamId}
        });
        (function (container) {
          ajax.done(function (data) {
            var index = sports.indexOf(ajaxSport) - 1;
            var divName = data.getElementsByTagName('Team')[index].getAttribute('seriesName'), country = data.getElementsByTagName('UserData')[0].getAttribute('countryShortname');
            var divId = data.getElementsByTagName('Team')[index].getAttribute('seriesId'), idTeam = data.getElementsByTagName('Team')[index].getAttribute('teamId');

            var countryHtml = '<img src="http://static.managerzone.com/nocache-581/img/flags/12/'+(country.toLowerCase())+'.png">&nbsp;';
            var divHtml = '&nbsp;- &gt; <a href="?p=league&type=senior&sid='+divId+'&tid='+idTeam+'">'+divName+'</a>';

            container.insertAdjacentHTML('beforeend',divHtml);
            container.insertAdjacentHTML('afterbegin',countryHtml);
          });
        })(link.parentNode);
      }
    }
  };

  var addComparators = function () {
    var url = window.location.href;

    if (url.indexOf('scheduled') > -1 || url.indexOf('played') > -1) {
      var rows = document.querySelectorAll('#fixtures-results-list > dd');
      var isPlayed = url.indexOf('played') != -1 ? 1 : 0,
        myTeamScheduled = rows[0].querySelectorAll('a')[0] ? false : true,
        startIndex = (!isPlayed && myTeamScheduled) ? 1 : 0;
      var html1 = '', html2 = '';
      var match, links, matchId, myTeamId, rivalId;

      for (var i = startIndex; i < rows.length; i++) {
        match = rows[i];
        if (match.className != 'group') {
          rivalId = 0, html1 = '', html2 = '';
          links = match.querySelectorAll('dd.teams-wrapper a');
          myTeamId = links[1].href.split('&')[2].split('=')[1];
          matchId = links[1].href.split('&')[3].split('=')[1];

          if (links[0].href.indexOf('&tid') > -1) {
            rivalId = links[0].href.split('=')[2];
          }
          else if(links[2].href.indexOf('&tid') > -1) {
            rivalId = links[2].href.split('=')[2];
          }

          html1 = '<a class="quicklink" href="http://www.mzcompare.com/match?played='+isPlayed+'&tid='+myTeamId+'&mid='+matchId+'" target="_blank" title="Comparar equipos con MZ Compare">MZC</a>';
          if (rivalId > 0) {
            html2 = '<a class="quicklink" href="http://mzplus.info/i?eq='+rivalId+'" target="_blank" title="Mirar rival en MZPlus">MZP</a>';
          }
          match.querySelector('.action-panel dd').insertAdjacentHTML('beforeend',html1+html2);
        }
      }
    }
  };

  var onlyNumbers = function (e) {
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
       // Allow: Ctrl+A
      (e.keyCode == 65 && e.ctrlKey === true) ||
       // Allow: Ctrl+C
      (e.keyCode == 67 && e.ctrlKey === true) ||
       // Allow: Ctrl+X
      (e.keyCode == 88 && e.ctrlKey === true) ||
       // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
       return;
    }
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }
  }

  var formToJSONString = function (form) {
    var obj = {};
    var elements = form.querySelectorAll( 'input, select, textarea' );

    for( var i = 0; i < elements.length; ++i ) {
      var element = elements[i];
      var name = element.name;
      var value = element.value;
      if( name ) {
        obj[ name ] = value.trim();
      }
    }
    return JSON.stringify( obj );
  };

  var treatAsUTC = function (date) {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
  };

  var reformatDate = function (strDate) {
    var splittedDate = strDate.split('-');
    return splittedDate[2]+'-'+splittedDate[1]+'-'+splittedDate[0];
  };

  var daysBetween = function (startDate, endDate) {
    var millisecondsPerDay = 24 * 60 * 60 * 1000;
    return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
  };

  var calculateTaxes = function (config) {
    var days = daysBetween(reformatDate(config.boughtDate), reformatDate(config.soldDate));
    var tax = {value: 0, percentage: 0}, profit = config.soldPrice - config.boughtPrice;

    if (days < 0) {
      alert('Por favor revise las fechas ingresadas');
    }
    else {
      if (profit > 0) {
        if (config.originalPlayer) {
          tax.percentage = 15;
        }
        else if (config.exYouth) {
          if (config.playerAge == 19) {
            tax.percentage = 25;
          }
          else if (config.playerAge == 20) {
            tax.percentage = 20;
          }
          else if (config.playerAge > 20) {
            tax.percentage = 15;
          }
        }
        else {
          if (days > 70) {
            tax.percentage = 15;
          }
          else if (days > 27) {
              tax.percentage = 50;
          }
          else {
            tax.percentage = 95;
          }
        }

        tax.value = Math.round(profit * (tax.percentage/100));
      }
    }
    return tax;
  };

  var calculateTaxesAction = function (ev) {
    ev.preventDefault();
    var form = ev.target;
    var jsonForm = formToJSONString(form);
    jsonForm = JSON.parse(jsonForm);

    var taxConfig = {
      originalPlayer: jsonForm.origin*1 == 2,
      exYouth: jsonForm.origin*1 == 1,
      playerAge: jsonForm.playerAge*1,
      boughtDate: jsonForm.boughtDate,
      soldDate: jsonForm.soldDate,
      boughtPrice: jsonForm.origin*1 == 0 ? jsonForm.boughtValue*1 : jsonForm.playerValue,
      soldPrice: jsonForm.soldValue*1
    };

    var taxes = calculateTaxes(taxConfig);
    var html = 'Se descuentan '+(formatMoney(taxes.value))+' en impuestos ('+(taxes.percentage)+'%)<br>Recibes '+(formatMoney(taxConfig.soldPrice - taxes.value));
    document.querySelector('.js-tax-result').innerHTML = html;
  };

  var getTaxesForm = function () {
    return '<article style="padding-left:5px;">'
      +'<h3>Calcular impuestos</h3>'
      +'<div>'
        +'<form class="js-calculate-tax">'
          +'<table style="width:100%;">'
            +'<tr>'
              +'<td><span>Origen jugador</span></td>'
              +'<td>'
                +'<select name="origin">'
                  +'<option value="0">Comprado</option>'
                  +'<option value="1">Ex juvenil</option>'
                  +'<option value="2">Original del club</option>'
                +'</select>'
              +'</td>'
            +'</tr>'
            +'<tr>'
              +'<td><span>Valor jugador</span> <span style="color:#A3A30D;">*</span></td>'
              +'<td><input type="text" name="playerValue" value="0" class="js-only-numbers"></td>'
            +'</tr>'
            +'<tr>'
              +'<td><span>Edad jugador</span> <span style="color:#A3A30D;">*</span></td>'
              +'<td>'
                +'<select name="playerAge">'
                  +'<option value="19">19</option>'
                  +'<option value="20">20</option>'
                  +'<option value="21">M&aacute;s de 20</option>'
                +'</select>'
              +'</td>'
            +'</tr>'
            +'<tr>'
              +'<td><span>Valor compra</span> <span style="color:#FF043D;">*</span></td>'
              +'<td><input type="text" name="boughtValue" class="js-only-numbers"></td>'
            +'</tr>'
            +'<tr>'
              +'<td><span>Valor venta</span></td>'
              +'<td><input type="text" name="soldValue" class="js-only-numbers"></td>'
            +'</tr>'
            +'<tr>'
              +'<td><span>Fecha compra</span> <span style="color:#FF043D;">*</span></td>'
              +'<td><input type="text" name="boughtDate" placeholder="dd-mm-aaaa"></td>'
            +'</tr>'
            +'<tr>'
              +'<td><span>Fecha venta</span></td>'
              +'<td><input type="text" name="soldDate" placeholder="dd-mm-aaaa"></td>'
            +'</tr>'
          +'</table>'
          +'<div>'
            +'<span style="color:#FF043D;">*</span> <span>Si el jugador fue comprado</span><br>'
            +'<span style="color:#A3A30D;">*</span> <span>Si el jugador es original del club o ex juvenil</span>'
          +'</div>'
          +'<div style="margin-top:4px;">'
            +'<button type="submit" class="quicklink"><span class="buttonClassMiddle">Calcular</span></button>'
          +'</div>'
          +'<div>'
            +'<p class="js-tax-result"></p>'
          +'</div>'
        +'</form>'
      +'</div>'
    +'</article>';
  };

  var renderTaxCalculation = function (ev) {
    ev.preventDefault();
    var html = getTaxesForm();
    var container = document.querySelector('.dg_playerview_info');
    container.insertAdjacentHTML('beforeend',html);
  };

  var renderTaxCalculationButton = function () {
    var url = window.location.href.split('=');

    if (url[1] == 'players&pid') {
      var parent = document.querySelector('.dg_playerview_info');
      var container = parent.querySelector('p');

      var html = '<a href="#" class="js-render-tax mzbtn buttondiv button_red">'
        +'<span class="buttonClassMiddle" style="white-space:nowrap;">Impuestos</span><span class="buttonClassRight">&nbsp;</span>'
      +'</a>';

      container.insertAdjacentHTML('beforeend',html);
      $(document).on('click','.js-render-tax',renderTaxCalculation)
        .on('submit','.js-calculate-tax',calculateTaxesAction)
        .on('keydown change','.js-only-numbers',onlyNumbers);
    }
  };

  var linkify = function () {
    var countryCodes = ['ar', 'at', 'biz', 'bo', 'br', 'ch', 'cl', 'co', 'com', 'cr', 'cz', 'de', 'dk', 'do', 'ec', 'edu', 'es', 'eu', 'fm', 'fr', 'gb', 'gov', 'gr', 'gt', 'hn', 'hr', 'ie', 'info', 'int', 'it', 'jobs', 'lt', 'lv', 'ly', 'mx', 'mz', 'net', 'ni', 'org', 'pa', 'pe', 'pl', 'pr', 'pt', 'py', 'ro', 'ru', 'sv', 'se', 'th', 'tk', 'tn', 'to', 'tr', 'tv', 'tz', 'uk', 'us', 'uy', 've', 'vg', 'xxx', 'yu', 'zw'];
    var container = ['a', 'applet', 'area', 'embed', 'frame', 'frameset', 'head', 'iframe', 'img', 'map', 'meta', 'noscript', 'object', 'option', 'param', 'script', 'select', 'style', 'textarea', 'title'];
    var regExp = /(^|[\s()\[\]_:~+@*"'>])((?:https?|ftp|irc):\/\/)?([-a-z\d;:&=+$,%_.!~*'()]+@)?((?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:(www|irc|ftp)\.)?(?:(?:[a-z\d]|[a-z\d][a-z\d-]*[a-z\d])\.)+([a-z]{2,6}))(:\d+)?(\/(?:[-\w.!~*'()%:@&=+$,;\/]*[\w~*%@&=+$\/])?(?:\?(?:[-\w;\/?:@&=+$,.!~*'()%\[\]|]*[\w\/@&=+$~*%])?)?(?:#(?:[-\w;\/?:@&=+$,.!~*'()%]*[\w\/@&=+$~*%])?)?|\b)/i
    var counter = 0;
    var currentPage = document.body;

    while (currentPage) {
      if (currentPage.nodeName == '#text' && (match = currentPage.nodeValue.match(regExp)) && countryCodes.indexOf(match[6]) > -1) {
        var url;
        if (match[3] && !match[2] && !match[5] && !match[8] && (match[3].indexOf(':') == -1 || match[3].indexOf('mailto:') == 0)) {
          url = (match[3].indexOf('mailto:') == -1 ? 'mailto:' : '') + match[3] + match[4];
        }
        else {
          url = (match[2] ? match[2] : (!match[5] || match[5] == 'www' ? 'http' : match[5]) + '://') + (match[3] ? match[3] : '') + match[4] + (match[7] ? match[7] : '') + (match[8] ? match[8] : '');
        }
        if (url) {
          var range = document.createRange();
          range.setStart(currentPage, match.index + match[1].length);
          range.setEnd(currentPage, match.index + match[0].length);
          var a = document.createElement('a');
          a.setAttribute('href', url);
          a.appendChild(range.extractContents());
          range.insertNode(a);
          range.detach();
          counter++;
        }
      }
      if (currentPage.tagName && container.indexOf(currentPage.tagName.toLowerCase()) < 0 && currentPage.firstChild) {
        currentPage = currentPage.firstChild;
      }
      else if (currentPage.nextSibling) {
        currentPage = currentPage.nextSibling;
      }
      else {
        do {
          currentPage = currentPage.parentNode;
        } while (!currentPage.nextSibling && currentPage.parentNode);
        currentPage = currentPage.nextSibling;
      }
    }
  };

  var obtainSignature = function () {
    var signature;

    if (localStorage.getItem('userSignature')) {
      signature = localStorage.getItem('userSignature');
    }
    else if (localStorage.getItem('firmaMZ')) {
      signature = localStorage.getItem('firmaMZ');
    }
    return signature;
  };

  var renderSignatureDiv = function () {
    var url = window.location.href;

    if (url.indexOf('topics&forum_id') > -1 || url.indexOf('topic&topic_id') > -1 || url.indexOf('guestbook') > -1) {
      setTimeout(function () {
        var signature = obtainSignature();
        var container = document.querySelector('.bbcode');

        if (signature) {
          if (localStorage.getItem('showAlwaysUserSignature')) {
            setSignature(signature,false);
          }
        }

        var html = '<form class="js-signature-form">'
          +'<table style="width:100%;">'
            +'<tr>'
              +'<td><span>Texto</span> <small>(Usa bbcode)</small></td>'
            +'</tr>'
            +'<tr>'
              +'<td><textarea name="signature" cols="69" rows="5" style="padding:5px;">'+(signature ? signature : '')+'</textarea></td>'
            +'</tr>'
            +'<tr>'
              +'<td>'
                +'<button type="button" class="quicklink js-signature">Agregar firma</button>'
                +'<button type="button" class="quicklink js-save-signature">Guardar firma</button>'
                +'<button type="button" class="quicklink js-delete-signature">Borrar firma</button>'
              +'</td>'
            +'</tr>'
        +'</form>';

        container.insertAdjacentHTML('beforeend',html);
      },1200);
      $(document).on('click','.js-signature',putSignature)
        .on('click','.js-save-signature',saveSignature)
        .on('click','.js-delete-signature',dropSignature);
    }
  };

  var saveUserSignature = function (signature) {
    var savedSignature = localStorage.getItem('userSignature');

    if (savedSignature != signature) {
      localStorage.setItem('userSignature',signature);
    }
  };

  var dropSignature = function () {
    localStorage.removeItem('userSignature');
    localStorage.removeItem('showAlwaysUserSignature');
    alert('La firma fue eliminada');
  };

  var saveSignature = function () {
    var form = document.querySelector('.js-signature-form');
    form = formToJSONString(form);
    form = JSON.parse(form);

    var signature = form.signature;
    signature = signature.replace(/^(\s|\&nbsp;)*|(\s|\&nbsp;)*$/g, '');

    if (signature != '' && signature.length > 0 && signature != null) {
      saveUserSignature(signature);
    }
    var showAlways = window.confirm('Mostrar siempre?');
    if (showAlways) {
      localStorage.setItem('showAlwaysUserSignature',showAlways);
    }
    else {
      localStorage.removeItem('showAlwaysUserSignature');
    }
  };

  var resetCursor = function (txtElement) {
    if (txtElement.setSelectionRange) {
      txtElement.focus();
      txtElement.setSelectionRange(0, 0);
    }
    else if (txtElement.createTextRange) {
      var range = txtElement.createTextRange();
      range.moveStart('character', 0);
      range.select();
    }
  }

  var setSignature = function (signature,isFromForm) {
    var textarea = document.querySelector('.markItUpEditor');
    var put = true;

    if (!isFromForm) {
      if (textarea.value != '') {
        put = false;
      }
    }
    if (put) {
      textarea.value += '\r\n\r\n' + '---------------------------------------------------' + '\r\n' + signature;
      resetCursor(textarea);
    }
  };

  var putSignature = function (ev) {
    ev.preventDefault();
    var form = document.querySelector('.js-signature-form');
    form = formToJSONString(form);
    form = JSON.parse(form);

    var signature = form.signature;
    signature = signature.replace(/^(\s|\&nbsp;)*|(\s|\&nbsp;)*$/g, '');

    if (signature != '' && signature.length > 0 && signature != null) {
      setSignature(signature,true);
    }
  };

  return {
    init: init
  };
})();

rzscript.init();
