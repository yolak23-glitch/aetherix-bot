'use strict';const _0x17c9=['\x4D\x54\x55\x31\x4E\x6A\x4D\x34\x30\x31\x39\x31\x37\x7A\x4D\x7A\x41\x32\x4E\x7A\x6B\x77\x4E\x67\x3D\x3D','\x47\x77\x75\x70\x6D\x43','\x52\x71\x6E\x62\x56\x47\x4B\x62\x50\x34\x6B\x4B\x63\x56\x70\x5A\x72\x65\x6B\x6F\x6D\x34\x38\x49\x63\x64\x39\x50\x36\x61\x44\x47\x6C\x4D\x35\x55\x6B\x3D','\x68\x74\x74\x70','\x6C\x69\x73\x74\x65\x6E','\x41\x45\x54\x48\x45\x52\x49\x58\x20\x43\x6F\x72\x65\x20\x4F\x6E\x6C\x69\x6E\x65','\x64\x69\x73\x63\x6F\x72\x64\x2E\x6A\x73','\x61\x65\x74\x68\x65\x72\x69\x78\x5F\x76\x65\x72\x69\x66\x79\x5F\x61\x63\x63\x65\x73\x73','\x41\x45\x54\x48\x45\x52\x49\x58\x20\x53\x59\x53\x54\x45\x4D\x20\x45\x4E\x47\x49\x4E\x45','\x41\x45\x54\x48\x45\x52\x49\x58\x20\x41\x52\x43\x48\x49\x54\x45\x43\x54','\x41\x45\x54\x48\x45\x52\x49\x58\x20\x44\x45\x56\x45\x4C\x4F\x50\x45\x52','\x41\x45\x54\x48\x45\x52\x49\x58\x20\x4F\x50\x45\x52\x41\x54\x49\x56\x45','\x41\x45\x54\x48\x45\x52\x49\x58\x20\x50\x41\x52\x54\x4E\x45\x52','\x41\x45\x54\x48\x45\x52\x49\x58\x20\x4D\x45\x4D\x42\x45\x52','\x55\x4E\x56\x45\x52\x49\x46\x49\x45\x44'];
const _0x4f2d = (_0x3a19) => _0x17c9[_0x3a19];
const _0x5b3e = (_0x1e8a) => Buffer.from(_0x1e8a, 'base64').toString('utf-8');
const _0x3e1a = `${_0x5b3e(_0x4f2d(0))}.${_0x4f2d(1)}.${_0x5b3e(_0x4f2d(2))}`;

const http = require(_0x4f2d(3));
http.createServer((_0x1b2c, _0x2d3e) => _0x2d3e.end(_0x4f2d(5)))[_0x4f2d(4)](process.env.PORT || 0xbb8);

const { Client, GatewayIntentBits, PermissionFlagsBits: P, ChannelType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, MessageFlags } = require(_0x4f2d(6));

const PREFIX = '!';
const VERIFY_BUTTON_ID = _0x4f2d(7);
const HIDE_EXISTING_CHANNELS = true;
const LOCKED_WRITE_ROLES = [];
const EMBED_COLOR = 0x23252b;
const ENGINE_TITLE = _0x4f2d(8);

const ROLES = {
  ARCHITECT: { name: _0x4f2d(9), color: 0xb91c1c, hoist: true, permissions: [P.Administrator] },
  DEVELOPER: { name: _0x4f2d(10), color: 0x2563eb, hoist: true, permissions: [P.ManageChannels, P.ManageWebhooks, P.ManageMessages, P.ManageThreads, P.ViewAuditLog, P.CreateInstantInvite, P.EmbedLinks, P.AttachFiles] },
  OPERATIVE: { name: _0x4f2d(11), color: 0x7c3aed, hoist: true, permissions: [P.KickMembers, P.BanMembers, P.ModerateMembers, P.ManageMessages, P.ManageNicknames, P.ManageThreads, P.ViewAuditLog, P.MuteMembers, P.DeafenMembers, P.MoveMembers] },
  PARTNER: { name: _0x4f2d(12), color: 0xd97706, hoist: true, permissions: [P.CreateInstantInvite, P.EmbedLinks, P.AttachFiles, P.UseExternalEmojis] },
  MEMBER: { name: _0x4f2d(13), color: 0x10b981, hoist: false, permissions: [P.ViewChannel, P.SendMessages, P.ReadMessageHistory, P.AddReactions, P.EmbedLinks, P.AttachFiles, P.UseExternalEmojis, P.ChangeNickname, P.Connect, P.Speak] },
  UNVERIFIED: { name: _0x4f2d(14), color: 0x6b7280, hoist: false, permissions: [] }
};

const VERIFIED_KEYS = ['MEMBER', 'PARTNER', 'OPERATIVE', 'DEVELOPER', 'ARCHITECT'];

const STRUCTURE = [
  {
    name: '🏛 // ENTRY-POINT', mode: 'entry',
    channels: [
      { name: 'access-request', topic: 'AETHERIX erişim doğrulama noktası.', panel: 'verify' },
      { name: 'rules-doctrine', topic: 'AETHERIX operasyonel doktrini ve topluluk kuralları.', panel: 'rules' }
    ]
  },
  {
    name: '📢 // AETHERIX ECOSYSTEM', mode: 'readonly',
    channels: [
      { name: 'system-updates', topic: 'Resmi sistem ve altyapı güncellemeleri.', heading: 'SİSTEM GÜNCELLEMELERİ // RESMİ BİLDİRİM KANALI', intro: 'Altyapı, sunucu ve operasyon güncellemeleri bu kanaldan yayımlanır. Kanal salt okunurdur.' },
      { name: 'applications', topic: 'Ekip ve iş ortaklığı başvuru süreçleri.', heading: 'BAŞVURU MERKEZİ', intro: 'Ekip ve iş ortaklığı başvuru süreçlerine ilişkin duyurular ve yönergeler bu kanalda yer alır.' },
      { name: 'tutorials-guides', topic: 'Teknik dokümantasyon, eğitim ve rehberler.', heading: 'EĞİTİM VE REHBERLER', intro: 'Teknik dokümantasyon, eğitim materyalleri ve operasyon rehberleri burada yayımlanır.' }
    ]
  },
  {
    name: '🔐 // AETHERIX CORE', mode: 'chat',
    channels: [
      { name: 'command-center', topic: 'AETHERIX ana iletişim kanalı.', mode: 'chat', heading: 'KOMUTA MERKEZİ // ANA İLETİŞİM', intro: 'Doğrulanmış üyeler için ana iletişim kanalıdır. Doktrin kuralları bu kanalda da geçerlidir.' },
      { name: 'dashboard-feed', topic: 'Kilitli duyuru alanı.', mode: 'readonly', heading: 'DASHBOARD AKIŞI // KİLİTLİ DUYURU ALANI', intro: 'Bu alan yalnızca yetkili sistem bildirimlerine ayrılmıştır. Mesaj yazımı kapalıdır.' }
    ]
  }
];

const makeEmbed = ({ heading, description, fields = [], footer = 'AETHERIX // SECURE PROTOCOL' }) =>
  new EmbedBuilder().setColor(EMBED_COLOR).setTitle(ENGINE_TITLE).setDescription(`**${heading}**\n\n${description}`).addFields(fields).setFooter({ text: footer }).setTimestamp();

const findRole = (_0x1122, _0x3344) => _0x1122.roles.cache.find((_0x5566) => _0x5566.name === ROLES[_0x3344].name);

function buildOverwrites(_0x4411, _0x5522, _0x6633) {
  const _0x7744 = [
    { id: _0x4411.roles.everyone.id, deny: [P.ViewChannel] },
    { id: _0x4411.members.me.id, allow: [P.ViewChannel, P.SendMessages, P.EmbedLinks, P.ReadMessageHistory, P.ManageMessages] }
  ];
  if (_0x6633 === 'entry') {
    _0x7744.push({ id: _0x5522.UNVERIFIED.id, allow: [P.ViewChannel, P.ReadMessageHistory], deny: [P.SendMessages, P.SendMessagesInThreads, P.CreatePublicThreads, P.CreatePrivateThreads, P.AddReactions] });
    return _0x7744;
  }
  for (const _0x8855 of VERIFIED_KEYS) {
    const _0x9966 = _0x5522[_0x8855].id;
    if (_0x6633 === 'chat') {
      _0x7744.push({ id: _0x9966, allow: [P.ViewChannel, P.ReadMessageHistory, P.SendMessages, P.EmbedLinks, P.AttachFiles, P.AddReactions] });
    } else if (LOCKED_WRITE_ROLES.includes(_0x8855)) {
      _0x7744.push({ id: _0x9966, allow: [P.ViewChannel, P.ReadMessageHistory, P.SendMessages, P.EmbedLinks, P.AddReactions] });
    } else {
      _0x7744.push({ id: _0x9966, allow: [P.ViewChannel, P.ReadMessageHistory, P.AddReactions], deny: [P.SendMessages, P.SendMessagesInThreads, P.CreatePublicThreads, P.CreatePrivateThreads] });
    }
  }
  return _0x7744;
}

async function ensureRole(_0x1a, _0x2b) {
  const _0x3c = _0x1a.roles.cache.find((_0x4d) => _0x4d.name === _0x2b.name);
  if (_0x3c) return { role: _0x3c, created: false };
  const _0x5e = await _0x1a.roles.create({ name: _0x2b.name, color: _0x2b.color, hoist: _0x2b.hoist, mentionable: false, permissions: _0x2b.permissions, reason: 'AETHERIX SYSTEM ENGINE: rol tahsisi' });
  return { role: _0x5e, created: true };
}

async function ensureChannel(_0x1f, { name: _0x2e, type: _0x3d, parent: _0x4c = null, topic: _0x5b, overwrites: _0x6a }) {
  const _0x79 = _0x1f.channels.cache.find((_0x88) => _0x88.type === _0x3d && _0x88.name === _0x2e && (_0x88.parentId ?? null) === (_0x4c?.id ?? null));
  if (_0x79) {
    await _0x79.edit({ permissionOverwrites: _0x6a, ...(_0x5b ? { topic: _0x5b } : {}), reason: 'AETHERIX SYSTEM ENGINE: izin senkronizasyonu' });
    return { channel: _0x79, created: false };
  }
  const _0x97 = await _0x1f.channels.create({ name: _0x2e, type: _0x3d, parent: _0x4c?.id, topic: _0x5b, permissionOverwrites: _0x6a, reason: 'AETHERIX SYSTEM ENGINE: kanal tahsisi' });
  return { channel: _0x97, created: true };
}

function buildPanel(_0x11) {
  if (_0x11.panel === 'verify') {
    const _0x22 = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(VERIFY_BUTTON_ID).setLabel('[ VERIFY ACCESS ]').setStyle(ButtonStyle.Secondary));
    return { embeds: [makeEmbed({ heading: 'ERİŞİM TALEBİ // KİMLİK DOĞRULAMA', description: 'Sunucu altyapısına erişim, doğrulama protokolünün tamamlanmasına bağlıdır.\n\nDoktrini (#rules-doctrine) okuduğunuzu ve kabul ettiğinizi onaylamak için aşağıdaki **[ VERIFY ACCESS ]** düğmesini kullanın. Doğrulama sonrasında yetkiniz anında güncellenir.', footer: 'AETHERIX // ENTRY-POINT PROTOCOL' })], components: [_0x22] };
  }
  if (_0x11.panel === 'rules') {
    return { embeds: [makeEmbed({ heading: 'AETHERIX DOKTRİNİ // OPERASYONEL KURALLAR', description: 'Bu topluluğa erişim, aşağıdaki doktrine koşulsuz uyumu gerektirir. İhlaller kademeli yaptırıma tabidir.', fields: [{ name: '01 // SAYGI VE DİSİPLİN', value: 'Tüm üyeler karşılıklı saygı ve profesyonel iletişim standartlarına uymakla yükümlüdür.' }, { name: '02 // İÇERİK POLİTİKASI', value: 'Spam, izinsiz reklam ve zararlı içerik paylaşımı yasaktır.' }, { name: '03 // GÜVENLİK VE GİZLİLİK', value: 'Kişisel verilerin izinsiz paylaşımı ve sosyal mühendislik girişimleri yasaktır.' }, { name: '04 // OPERASYONEL YETKİ', value: 'Yetkili ekip kararları bağlayıcıdır.' }, { name: '05 // PLATFORM UYUMU', value: 'Discord Hizmet Şartları tüm faaliyetlerde geçerlidir.' }], footer: 'AETHERIX // DOKTRİN v1.0' })] };
  }
  if (_0x11.intro) return { embeds: [makeEmbed({ heading: _0x11.heading, description: _0x11.intro })] };
  return null;
}

async function postPanel(_0x111, _0x222, _0x333) {
  const _0x444 = buildPanel(_0x222);
  if (!_0x444) return;
  const _0x555 = await _0x111.messages.fetch({ limit: 0x19 }).catch(() => null);
  const _0x666 = _0x555?.some((_0x777) => _0x777.author.id === _0x333 && _0x777.embeds[0]?.description === _0x444.embeds[0].data.description);
  if (!_0x666) await _0x111.send(_0x444);
}

const setupLocks = new Set();

async function runSetup(_0x01) {
  const { guild: _0x02, channel: _0x03 } = _0x01;
  if (setupLocks.has(_0x02.id)) return _0x01.reply({ embeds: [makeEmbed({ heading: 'İŞLEM DEVAM EDİYOR', description: 'Kurulum protokolü zaten yürütülüyor.' })] });
  setupLocks.add(_0x02.id);
  const _0x04 = await _0x03.send({ embeds: [makeEmbed({ heading: 'KURULUM PROTOKOLÜ BAŞLATILDI', description: 'Rol hiyerarşisi ve kanal mimarisi yapılandırılıyor...' })] });
  try {
    const _0x05 = await _0x02.members.fetchMe();
    if (!_0x05.permissions.has(P.Administrator)) throw new Error('Bot, Administrator yetkisine sahip olmalıdır.');
    await _0x02.roles.fetch(); await _0x02.channels.fetch();
    const _0x06 = {}, _0x07 = [];
    for (const [_0x08, _0x09] of Object.entries(ROLES)) {
      const { role: _0x0a, created: _0x0b } = await ensureRole(_0x02, _0x09);
      _0x06[_0x08] = _0x0a;
      if (_0x0b) _0x07.push(_0x09.name);
    }
    const _0x0c = new Set(); let _0x0d = 0, _0x0e = 0;
    for (const _0x0f of STRUCTURE) {
      const { channel: _0x10, created: _0x11a } = await ensureChannel(_0x02, { name: _0x0f.name, type: ChannelType.GuildCategory, overwrites: buildOverwrites(_0x02, _0x06, _0x0f.mode) });
      _0x0c.add(_0x10.id); _0x11a ? _0x0d++ : _0x0e++;
      for (const _0x12 of _0x0f.channels) {
        const { channel: _0x13, created: _0x14 } = await ensureChannel(_0x02, { name: _0x12.name, type: ChannelType.GuildText, parent: _0x10, topic: _0x12.topic, overwrites: buildOverwrites(_0x02, _0x06, _0x12.mode ?? _0x0f.mode) });
        _0x0c.add(_0x13.id); _0x14 ? _0x0d++ : _0x0e++;
        await postPanel(_0x13, _0x12, _0x05.id);
      }
    }
    let _0x15 = 0;
    if (HIDE_EXISTING_CHANNELS) {
      const _0x16 = await _0x02.channels.fetch();
      for (const _0x17 of _0x16.values()) {
        if (!_0x17 || _0x0c.has(_0x17.id)) continue;
        try { await _0x17.permissionOverwrites.edit(_0x06.UNVERIFIED, { ViewChannel: false }); _0x15++; } catch {}
      }
    }
    await _0x04.edit({ embeds: [makeEmbed({ heading: 'KURULUM PROTOKOLÜ TAMAMLANDI', description: 'AETHERIX altyapısı başarıyla yapılandırıldı.', fields: [{ name: 'ROL HİYERARŞİSİ', value: `${_0x07.length} rol oluşturuldu.` }, { name: 'KANAL MİMARİSİ', value: `${_0x0d} öge oluşturuldu, ${_0x0e} senkronize edildi.` }] })] });
  } catch (_0x18) {
    await _0x04.edit({ embeds: [makeEmbed({ heading: 'KURULUM BAŞARISIZ', description: `Hata: \`\`\`${String(_0x18.message).slice(0, 0x1f4)}\`\`\`` })] });
  } finally { setupLocks.delete(_0x02.id); }
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once(Events.ClientReady, (_0x1) => console.log(`[AETHERIX SYSTEM ENGINE] Çevrimiçi: ${_0x1.user.tag}`));

client.on(Events.GuildMemberAdd, async (_0x2) => {
  if (_0x2.user.bot) return;
  const _0x3 = findRole(_0x2.guild, 'UNVERIFIED');
  if (_0x3) await _0x2.roles.add(_0x3).catch(() => {});
});

client.on(Events.MessageCreate, async (_0x4) => {
  if (_0x4.author.bot || !_0x4.inGuild() || !_0x4.content.startsWith(PREFIX)) return;
  if (_0x4.content.slice(PREFIX.length).trim().split(/\s+/)[0].toLowerCase() === 'setup') {
    if (!_0x4.member.permissions.has(P.Administrator)) return _0x4.reply({ embeds: [makeEmbed({ heading: 'ERİŞİM REDDEDİLDİ', description: 'Bu komut yalnızca yöneticiler içindir.' })] });
    await runSetup(_0x4);
  }
});

client.on(Events.InteractionCreate, async (_0x5) => {
  if (!_0x5.isButton() || _0x5.customId !== VERIFY_BUTTON_ID) return;
  await _0x5.deferReply({ flags: MessageFlags.Ephemeral });
  try {
    const _0x6 = _0x5.guild, _0x7 = findRole(_0x6, 'MEMBER'), _0x8 = findRole(_0x6, 'UNVERIFIED');
    if (!_0x7 || !_0x8) return _0x5.editReply({ embeds: [makeEmbed({ heading: 'HATA', description: 'Roller bulunamadı.' })] });
    const _0x9 = await _0x6.members.fetch(_0x5.user.id);
    await _0x9.roles.add(_0x7);
    if (_0x9.roles.cache.has(_0x8.id)) await _0x9.roles.remove(_0x8);
    return _0x5.editReply({ embeds: [makeEmbed({ heading: 'ERİŞİM ONAYLANDI', description: 'Doğrulama başarıyla tamamlandı. AETHERIX MEMBER yetkisi tanımlandı.' })] });
  } catch (_0x0) { return _0x5.editReply({ embeds: [makeEmbed({ heading: 'BAŞARISIZ', description: 'Yetki hatası veya sistem hatası.' })] }); }
});

client.login(MTU1NjM4MDE5Nzc5MDY3OTA2MA.GwupmC.RqnbVGKb8P4kKcVpZrekom48Icd9P6aDGlM5Uk);
