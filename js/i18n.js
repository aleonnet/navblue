/* NavBlue i18n vanilla: PT-BR canônico no HTML + dicionário duplo via data-i18n.
   Persistência em localStorage; primeira visita segue navigator.language;
   ?lang=pt|en é hook de teste/link compartilhável.
   O script inline do installer consome window.NB_I18N.t() (literais de UI). */

const KEY = 'navblue.lang';

const STRINGS = {
  pt: {
    'meta.title.landing': 'NavBlue — Navegação para Motociclistas',
    'meta.title.install': 'NavBlue — Instalador Web do Device',
    'meta.title.demo': 'NavBlue · Simulação de Navegação',

    'nav.skip': 'Pular para o conteúdo',
    'nav.menu': 'Abrir menu',
    'nav.how': 'Como funciona',
    'nav.demo': 'Demo',
    'nav.install': 'Instalar firmware',
    'nav.cta': 'Baixar o app',

    'hero.title1': 'O caminho à frente.',
    'hero.title2': 'O celular guardado.',
    'hero.sub': 'NavBlue é o HUD de navegação para motociclistas: instruções curva a curva num display dedicado — e o seu celular protegido, longe da chuva, da vibração e dos olhares.',
    'hero.apple.small': 'Baixar na',
    'hero.gplay.small': 'Disponível no',
    'hero.demo': 'Ver demo da engine',
    'hero.hint': 'role para descobrir',

    'problem.kicker': 'O problema',
    'problem.title': 'Seu celular <b>não pertence</b> ao guidão',
    'problem.lead': 'Suporte no guidão significa tela na chuva, câmera destruída pela vibração e um convite ao furto em cada semáforo. A navegação que você precisa não exige sacrificar o aparelho que você carrega.',
    'problem.b1': 'A vibração da moto danifica a estabilização da câmera do celular',
    'problem.b2': 'Chuva e sol direto castigam a tela — e a bateria',
    'problem.b3': 'Celular exposto é alvo: no NavBlue ele fica no bolso, conectado por Bluetooth',
    'problem.aria': 'Animação: celular no guidão vibrando e caindo, sob chuva e sendo furtado',
    'problem.cap1': 'Vibração <b>destrói</b> a câmera',
    'problem.cap2': 'Chuva e sol <b>castigam</b> a tela',
    'problem.cap3': 'Exposto, <b>vira alvo</b>',

    'device.kicker': 'O hardware',
    'device.title': 'Um display feito <b>para a estrada</b>',
    'device.lead': 'AMOLED circular de 1.75″ — preto absoluto de noite, legível sob sol — mostrando exatamente o que importa: a próxima curva, a distância e a sua velocidade.',
    'device.spec3k': 'conexão com o app',
    'device.spec4v': 'Bateria',
    'device.spec4k': 'USB-C para recarga',

    'how.kicker': 'Como funciona',
    'how.title': 'Três passos e <b>boa estrada</b>',
    'how.s1.title': 'Baixe e configure',
    'how.s1.body': 'Instale o app e siga o guia de boas-vindas: localização, Bluetooth e notificações — pronto em poucos minutos.',
    'how.s1.alt': 'Guia de boas-vindas do app NavBlue',
    'how.s2.title': 'Conecte por Bluetooth',
    'how.s2.body': 'Uma varredura encontra o seu NAV HUD e o app passa a transmitir navegação, rota e mapa por BLE. O celular vai para o bolso.',
    'how.s2.alt': 'Pareamento Bluetooth com o NAV HUD no app',
    'how.s3.title': 'Trace a rota e siga o HUD',
    'how.s3.body': 'Pesquise endereços via Mapbox ou Google, monte paradas e vá: setas, distância e velocidade no guidão até o destino.',
    'how.s3.alt': 'Device NavBlue exibindo rota, manobra e velocidade',

    'demo.kicker': 'Demo interativa',
    'demo.title': 'Veja a engine <b>em ação</b>',
    'demo.lead': 'Um replay cinematográfico gerado pela engine usada na navegação do NavBlue: câmera de perseguição, do alto, da rota e telemetria.',
    'demo.aria': 'Abrir demo interativa',
    'demo.alt': 'Demo cinematográfica da navegação NavBlue no Rio de Janeiro',

    'mapa.kicker': 'Mapa do Brasil',
    'mapa.title': 'Mapas, <b>no seu device</b>',
    'mapa.lead': 'Com a assinatura Mapa do Brasil, o app transmite os mapas vetoriais para o device NavBlue — as vias aparecem no HUD — e libera a busca de endereços pelo Google.',
    'mapa.per': ' /mês',
    'mapa.note': 'Assinatura opcional, direto no app. A navegação básica é gratuita.',
    'mapa.alt': 'Rota do Local Atual até a Praia do Leblon via Shopping RioSul no app NavBlue',

    'installs.kicker': 'Para quem já tem o device',
    'installs.title': 'Atualize o firmware <b>pelo navegador</b>',
    'installs.lead': 'Conecte o NavBlue via USB e instale a versão mais recente do firmware sem instalar nada no computador — direto pelo Chrome ou Edge, via Web Serial.',
    'installs.btn': '⚡ Abrir instalador web',
    'installs.note': 'Requer Chrome ou Edge no desktop · devices VIEWE SmartRing-Plus e Waveshare AMOLED 1.75C / 2.16',

    'download.title': 'Pronto para <b>rodar</b>?',
    'download.lead': 'Baixe o app, conecte seu device e deixe o celular onde ele deve estar.',

    'foot.demo': 'Demo',
    'foot.installer': 'Instalador',
    'foot.fineprint': 'NavBlue · Navegação para motociclistas. Apple e o logotipo da App Store são marcas da Apple Inc. Google Play e o logotipo do Google Play são marcas da Google LLC.',

    /* ---------- installer (install.html) ---------- */
    'inst.back': 'Voltar à página inicial',
    'inst.subtitle': 'Instalador Web do Device',
    'inst.target': 'Device',
    'inst.chip': 'Chip',
    'inst.firmware': 'Firmware',
    'inst.connect': 'Conectar device',
    'inst.eraseNote': 'A primeira instalação apaga o device. Conecte via USB-C.',
    'inst.syncClock': 'Sincronizar relógio',
    'inst.readyText': 'Device detectado e pronto.',
    'inst.installFw': 'Instalar firmware',
    'inst.reprogramNote': 'Isso apaga e regrava o device.',
    'inst.doneTitle': 'Instalação concluída',
    'inst.doneText': 'O device vai reiniciar automaticamente.',
    'inst.flashAgain': 'Gravar de novo',
    'inst.tryAgain': 'Tentar de novo',
    'inst.cancel': 'Cancelar',
    'inst.unsupportedTitle': 'Navegador não suportado',
    'inst.unsupportedText': 'A API Web Serial é necessária. Use Google Chrome ou Microsoft Edge no desktop.',
    'inst.noport.title': 'Nenhuma porta selecionada',
    'inst.noport.intro': 'Se você não selecionou uma porta porque o seu device não apareceu na lista, tente os passos abaixo:',
    'inst.noport.s1': 'Confira se o device está conectado a este computador (o que roda o navegador com esta página).',
    'inst.noport.s2': 'A maioria dos devices tem um LED aceso quando ligado. Se o seu tiver, confira se está aceso.',
    'inst.noport.s3': 'Confira se o cabo USB transmite dados — não é um cabo só de energia.',
    'inst.noport.linux1': 'No Linux, garanta que o seu usuário está no grupo ',
    'inst.noport.linux2': ' para ter permissão de acesso ao device.',
    'inst.noport.linux3': 'Pode ser preciso sair e entrar de novo (ou reiniciar) para ativar o novo grupo.',
    'inst.noport.drivers': 'Confira se os drivers corretos estão instalados. Abaixo, os drivers dos chips mais comuns em devices ESP:',
    'inst.noport.winmac': 'Windows e Mac',
    'inst.noport.cloudnote': '(baixe pelo ícone de nuvem azul na página do fabricante)',
    'inst.footer': 'Conecte seu device VIEWE ou Waveshare via USB-C · Chrome ou Edge',

    /* literais escritos pelo script (via NB_I18N.t) */
    'inst.js.ready': 'Pronto para instalar',
    'inst.js.unsupported': 'Não suportado',
    'inst.js.noPort': 'Nenhuma porta selecionada',
    'inst.js.connecting': 'Conectando...',
    'inst.js.connectingText': 'Conectando ao device...',
    'inst.js.detecting': 'Detectando o chip...',
    'inst.js.detected': '{chip} detectado',
    'inst.js.downloading': 'Baixando...',
    'inst.js.downloadingText': 'Baixando o firmware...',
    'inst.js.flashing': 'Gravando...',
    'inst.js.erasing': 'Apagando a memória flash...',
    'inst.js.writing': 'Gravando o firmware...',
    'inst.js.resetting': 'Reiniciando o device...',
    'inst.js.complete': 'Instalação concluída',
    'inst.js.error': 'Erro',
    'inst.js.autoDetected': 'Auto-detectado: {name}. Device errado? Escolha abaixo.',
    'inst.js.ambiguous': 'Este hardware corresponde a: {names} — escolha o seu abaixo.',
    'inst.js.noDetect': 'Não foi possível auto-detectar — selecione o device abaixo antes de instalar.',
    'inst.js.errConnection': 'Falha na conexão',
    'inst.js.errConnectionDetail': 'Confira a conexão USB e tente de novo.',
    'inst.js.errPortSel': 'Falha na seleção da porta',
    'inst.js.errIncompatible': 'Device incompatível',
    'inst.js.errIncompatibleDetail': 'Detectado {chip}. Esperado: {expected}.',
    'inst.js.errNoDevice': 'Nenhum device conectado',
    'inst.js.errNoDeviceDetail': 'Conecte um device primeiro.',
    'inst.js.errNoSelection': 'Nenhum device selecionado',
    'inst.js.errNoSelectionDetail': 'Escolha o device (VIEWE ou Waveshare) antes de instalar.',
    'inst.js.errInstall': 'Falha na instalação',
    'inst.js.errFwNotFound': 'Arquivo de firmware não encontrado: {path}',
    'inst.js.clockSetting': 'Acertando o relógio do device…',
    'inst.js.clockSet': 'Relógio do device acertado: {time}',
    'inst.js.clockNotSet': 'Relógio não acertado: {err}',
    'inst.js.clockSyncing': 'Sincronizando o relógio…',
    'inst.js.clockNoResponse': 'Sem resposta — o device precisa de firmware com suporte a relógio (216 ≥ 1.2.0).',
    'inst.js.clockFailed': 'Falha ao sincronizar o relógio: {err}',
    'inst.js.clockNotSetNoFw': 'Relógio não acertado (firmware sem suporte a relógio) — a instalação está completa.',
    'inst.js.clockSynced': 'Relógio sincronizado',
    'inst.js.showLog': 'Mostrar log',
    'inst.js.hideLog': 'Ocultar log',

    /* ---------- demo (demo.html, mínimo) ---------- */
    'dm.back': 'Voltar à página inicial',
    'dm.skip': 'Clique ou aperte espaço para pular',
  },

  en: {
    'meta.title.landing': 'NavBlue — Navigation for Motorcyclists',
    'meta.title.install': 'NavBlue — Device Web Installer',
    'meta.title.demo': 'NavBlue · Guidance Simulation',

    'nav.skip': 'Skip to content',
    'nav.menu': 'Open menu',
    'nav.how': 'How it works',
    'nav.demo': 'Demo',
    'nav.install': 'Install firmware',
    'nav.cta': 'Get the app',

    'hero.title1': 'The road ahead.',
    'hero.title2': 'The phone put away.',
    'hero.sub': 'NavBlue is the navigation HUD for motorcyclists: turn-by-turn instructions on a dedicated display — with your phone protected from rain, vibration and prying eyes.',
    'hero.apple.small': 'Download on the',
    'hero.gplay.small': 'Get it on',
    'hero.demo': 'See the engine demo',
    'hero.hint': 'scroll to discover',

    'problem.kicker': 'The problem',
    'problem.title': 'Your phone <b>doesn’t belong</b> on the handlebar',
    'problem.lead': 'A handlebar mount means a screen in the rain, a camera wrecked by vibration and an invitation to theft at every red light. The navigation you need shouldn’t sacrifice the device you carry.',
    'problem.b1': 'Motorcycle vibration damages your phone’s camera stabilization',
    'problem.b2': 'Rain and direct sun punish the screen — and the battery',
    'problem.b3': 'An exposed phone is a target: with NavBlue it stays in your pocket, connected over Bluetooth',
    'problem.aria': 'Animation: phone on a handlebar shaking and falling, in the rain and being stolen',
    'problem.cap1': 'Vibration <b>destroys</b> the camera',
    'problem.cap2': 'Rain and sun <b>punish</b> the screen',
    'problem.cap3': 'Exposed, <b>it becomes a target</b>',

    'device.kicker': 'The hardware',
    'device.title': 'A display built <b>for the road</b>',
    'device.lead': 'A 1.75″ circular AMOLED — absolute black at night, readable in sunlight — showing exactly what matters: the next turn, the distance and your speed.',
    'device.spec3k': 'connects to the app',
    'device.spec4v': 'Battery',
    'device.spec4k': 'USB-C recharge',

    'how.kicker': 'How it works',
    'how.title': 'Three steps and <b>ride on</b>',
    'how.s1.title': 'Download and set up',
    'how.s1.body': 'Install the app and follow the welcome guide: location, Bluetooth and notifications — ready in minutes.',
    'how.s1.alt': 'NavBlue app welcome guide',
    'how.s2.title': 'Connect over Bluetooth',
    'how.s2.body': 'A scan finds your NAV HUD and the app starts streaming navigation, route and map over BLE. The phone goes in your pocket.',
    'how.s2.alt': 'Bluetooth pairing with the NAV HUD in the app',
    'how.s3.title': 'Set the route, follow the HUD',
    'how.s3.body': 'Search addresses via Mapbox or Google, add stops and go: arrows, distance and speed on the handlebar all the way.',
    'how.s3.alt': 'NavBlue device showing route, maneuver and speed',

    'demo.kicker': 'Interactive demo',
    'demo.title': 'See the engine <b>in action</b>',
    'demo.lead': 'A cinematic replay generated by the engine that powers NavBlue navigation: chase, top-down and route cameras plus telemetry.',
    'demo.aria': 'Open interactive demo',
    'demo.alt': 'Cinematic demo of NavBlue navigation in Rio de Janeiro',

    'mapa.kicker': 'Brazil Map',
    'mapa.title': 'Maps, <b>on your device</b>',
    'mapa.lead': 'With the Brazil Map subscription, the app streams vector maps to the NavBlue device — streets appear on the HUD — and unlocks Google address search.',
    'mapa.per': ' /month',
    'mapa.note': 'Optional subscription, right in the app. Basic navigation is free.',
    'mapa.alt': 'Route from Current Location to Leblon Beach via RioSul mall in the NavBlue app',

    'installs.kicker': 'Already have the device?',
    'installs.title': 'Update the firmware <b>from your browser</b>',
    'installs.lead': 'Connect your NavBlue over USB and install the latest firmware without installing anything on your computer — straight from Chrome or Edge, via Web Serial.',
    'installs.btn': '⚡ Open web installer',
    'installs.note': 'Requires Chrome or Edge on desktop · VIEWE SmartRing-Plus and Waveshare AMOLED 1.75C / 2.16 devices',

    'download.title': 'Ready to <b>ride</b>?',
    'download.lead': 'Get the app, connect your device and leave the phone where it belongs.',

    'foot.demo': 'Demo',
    'foot.installer': 'Installer',
    'foot.fineprint': 'NavBlue · Navigation for motorcyclists. Apple and the App Store logo are trademarks of Apple Inc. Google Play and the Google Play logo are trademarks of Google LLC.',

    /* ---------- installer ---------- */
    'inst.back': 'Back to home page',
    'inst.subtitle': 'Device Web Installer',
    'inst.target': 'Target',
    'inst.chip': 'Chip',
    'inst.firmware': 'Firmware',
    'inst.connect': 'Connect Device',
    'inst.eraseNote': 'First install will erase the device. Connect via USB-C.',
    'inst.syncClock': 'Sync device clock',
    'inst.readyText': 'Device detected and ready.',
    'inst.installFw': 'Install Firmware',
    'inst.reprogramNote': 'This will erase and reprogram the device.',
    'inst.doneTitle': 'Installation complete',
    'inst.doneText': 'Device will restart automatically.',
    'inst.flashAgain': 'Flash Again',
    'inst.tryAgain': 'Try Again',
    'inst.cancel': 'Cancel',
    'inst.unsupportedTitle': 'Browser not supported',
    'inst.unsupportedText': 'Web Serial API is required. Use Google Chrome or Microsoft Edge on desktop.',
    'inst.noport.title': 'No port selected',
    'inst.noport.intro': 'If you didn’t select a port because you didn’t see your device listed, try the following steps:',
    'inst.noport.s1': 'Make sure that the device is connected to this computer (the one that runs the browser that shows this website).',
    'inst.noport.s2': 'Most devices have a tiny light when they are powered on. If yours has one, make sure it is on.',
    'inst.noport.s3': 'Make sure that the USB cable you use can be used for data and is not a power-only cable.',
    'inst.noport.linux1': 'If you are using a Linux flavor, make sure that your user is part of the ',
    'inst.noport.linux2': ' group so it has permission to access the device.',
    'inst.noport.linux3': 'You may need to log out & back in or reboot to activate the new group access.',
    'inst.noport.drivers': 'Make sure you have the right drivers installed. Below are the drivers for common chips used in ESP devices:',
    'inst.noport.winmac': 'Windows & Mac',
    'inst.noport.cloudnote': '(download via the blue cloud icon on the vendor page)',
    'inst.footer': 'Connect your VIEWE or Waveshare device via USB-C · Chrome or Edge required',

    'inst.js.ready': 'Ready to install',
    'inst.js.unsupported': 'Unsupported',
    'inst.js.noPort': 'No port selected',
    'inst.js.connecting': 'Connecting...',
    'inst.js.connectingText': 'Connecting to device...',
    'inst.js.detecting': 'Detecting chip...',
    'inst.js.detected': '{chip} detected',
    'inst.js.downloading': 'Downloading...',
    'inst.js.downloadingText': 'Downloading firmware...',
    'inst.js.flashing': 'Flashing...',
    'inst.js.erasing': 'Erasing flash memory...',
    'inst.js.writing': 'Writing firmware...',
    'inst.js.resetting': 'Resetting device...',
    'inst.js.complete': 'Installation complete',
    'inst.js.error': 'Error',
    'inst.js.autoDetected': 'Auto-detected: {name}. Wrong device? Pick it below.',
    'inst.js.ambiguous': 'This hardware matches: {names} — pick yours below.',
    'inst.js.noDetect': 'Could not auto-detect this device — select it below before installing.',
    'inst.js.errConnection': 'Connection failed',
    'inst.js.errConnectionDetail': 'Check USB connection and try again.',
    'inst.js.errPortSel': 'Port selection failed',
    'inst.js.errIncompatible': 'Incompatible device',
    'inst.js.errIncompatibleDetail': 'Detected {chip}. Expected: {expected}.',
    'inst.js.errNoDevice': 'No device connected',
    'inst.js.errNoDeviceDetail': 'Please connect a device first.',
    'inst.js.errNoSelection': 'No device selected',
    'inst.js.errNoSelectionDetail': 'Pick the device (VIEWE or Waveshare) before installing.',
    'inst.js.errInstall': 'Installation failed',
    'inst.js.errFwNotFound': 'Firmware file not found: {path}',
    'inst.js.clockSetting': 'Setting device clock…',
    'inst.js.clockSet': 'Device clock set: {time}',
    'inst.js.clockNotSet': 'Clock not set: {err}',
    'inst.js.clockSyncing': 'Syncing clock…',
    'inst.js.clockNoResponse': 'No response — device needs firmware with clock support (216 ≥ 1.2.0).',
    'inst.js.clockFailed': 'Clock sync failed: {err}',
    'inst.js.clockNotSetNoFw': 'Clock not set (firmware without clock support) — install is complete.',
    'inst.js.clockSynced': 'Clock synced',
    'inst.js.showLog': 'Show log',
    'inst.js.hideLog': 'Hide log',

    /* ---------- demo ---------- */
    'dm.back': 'Back to home page',
    'dm.skip': 'Click or press space to skip',
  },
};

let lang = 'pt';

export function currentLang(){ return lang; }

export function t(key, vars){
  let s = (STRINGS[lang] && STRINGS[lang][key]) ?? STRINGS.pt[key] ?? key;
  if (vars) for (const k of Object.keys(vars)) s = s.replaceAll('{' + k + '}', vars[k]);
  return s;
}

export function applyLang(next){
  lang = next === 'en' ? 'en' : 'pt';
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  // Strings 100% nossas com markup embutido (<b>, <code>) — nunca input externo
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    el.dataset.i18nAttr.split(';').forEach(pair => {
      const [attr, key] = pair.split(':');
      if (attr && key) el.setAttribute(attr.trim(), t(key.trim()));
    });
  });

  const page = document.documentElement.dataset.page || 'landing';
  document.title = t('meta.title.' + page);

  const langBtn = document.getElementById('lang-toggle');
  if (langBtn){
    langBtn.textContent = lang === 'pt' ? 'EN' : 'PT';
    langBtn.setAttribute('aria-pressed', String(lang === 'en'));
    langBtn.title = lang === 'pt' ? 'English' : 'Português (Brasil)';
  }

  // conteúdo renderizado por JS (installer, HUD) escuta e se re-renderiza
  document.dispatchEvent(new CustomEvent('navblue:lang', {detail: lang}));
}

export function initI18n(){
  const q = new URLSearchParams(location.search).get('lang');
  if (q === 'pt' || q === 'en') localStorage.setItem(KEY, q);
  const saved = localStorage.getItem(KEY);
  const first = saved || ((navigator.language || '').toLowerCase().startsWith('pt') ? 'pt' : 'en');
  applyLang(first);

  document.getElementById('lang-toggle')?.addEventListener('click', () => {
    const next = lang === 'pt' ? 'en' : 'pt';
    localStorage.setItem(KEY, next);
    applyLang(next);
  });
}

/* ponte para o script inline do installer (não-módulo) */
window.NB_I18N = { t, currentLang, applyLang };

initI18n();
