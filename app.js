// ==UserScript==
// @name           rzxtension
// @namespace      rzxtension
// @description    Adiciones al sitio
// @include        http://*managerzone.*
// @grant          none
// @version        0.1
// @copyright      GNU/GPL v3
// @authors        rhonaldomaster
// @credits        c_c (c_c@managerzone.com) | serbocapo (serbocapo@managerzone.com)
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
      var h1 = wrapper.querySelector('h1');
      var text = h1.innerHTML;
      var i18nLeague = ['Liga','League'];
      if (i18nLeague.indexOf(text) > -1) {
        h1.innerHTML = '<a href="/?p=league&type=senior">'+text+'</a>';
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
    var target = '';
    var html = '<div '+(selectorType=='.' ? 'class':'id')+'="'+selector+'">';

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
      {text: 'MZ Plus', title:'Skiller MZ Plus',url:'http://www.mzplus.com.ar/p'},
      {text: 'Imgur', title:'Ir a Imgur',url:'http://imgur.com/'}
    ];
    createButtonLinks('.','quicklinks',document.querySelector('#contentDiv'),links,true);
  };

  var visualTrainingBalls = function () {
    setTimeout(function () {
      var container = document.querySelector('#training_report');
      if (container) {
        var table = container.childNodes[2];
        var tbody = table.querySelector('tbody');
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
    var toSEK = 1 / currencies[currency];
    var locale = 0;
    var cCurrency = localStorage.getItem('moneda');

    if (cCurrency) {
      locale = Math.round( (1 / currencies[cMoneda]) * (value / toSEK) );
    }
    else {
      locale = Math.round( (1 / currencies['USD']) * (value / toSEK) );
    }
    return locale;
  };

  var formatMoney = function (value) {
    var result = '';
    var number = value.toString();

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
        var link;
        var firstRow = teamTable.rows[0];
        var tableBody = teamTable.querySelector('tbody');
        var playerData = null, playerId = 0, playing11Value = 0, playing11 = 0;
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
              var playerValue = toLocaleCurrency(playerData.getAttribute('value'),currency);
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

  return {
    init: init
  };
})();

rxtension.init();
