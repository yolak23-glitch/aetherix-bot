/**
 * ═══════════════════════════════════════════════════════════════
 *  AETHERIX SYSTEM ENGINE  —  Discord.js v14 (önerilen: ^14.16)
 * ═══════════════════════════════════════════════════════════════
 *  KURULUM
 *   1) npm i discord.js
 *   2) Developer Portal > Bot > Privileged Gateway Intents:
 *        - SERVER MEMBERS INTENT   (açık olmalı)
 *        - MESSAGE CONTENT INTENT  (açık olmalı)
 *   3) Botu "bot" scope + "Administrator" yetkisiyle sunucuya ekleyin.
 *   4) Çalıştırma:  DISCORD_TOKEN=xxxxx node index.js
 *   5) Sunucuda bir yönetici olarak  !setup  yazın.
 *
 *  NOT: Botun kendi rolü, AETHERIX rollerinin ÜSTÜNDE olmalıdır.
 * ═══════════════════════════════════════════════════════════════
 */
'use strict';

const {
  Client,
  GatewayIntentBits,
  PermissionFlagsBits: P,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Events,
  MessageFlags,
} = require('discord.js');

/* ─────────────────────────── YAPILANDIRMA ─────────────────────────── */

const TOKEN = 'MTU1NjM4MDE5Nzc5MDY3OTA2MA.GwupmC.RqnbVGKb8P4kKcVpZrekom48Icd9P6aDGlM5Uk';
const PREFIX = '!';
const VERIFY_BUTTON_ID = 'aetherix_verify_access';

// true: !setup sırasında, AETHERIX yapısı dışındaki mevcut tüm kanallar UNVERIFIED'dan gizlenir.
const HIDE_EXISTING_CHANNELS = true;

// Kilitli (salt okunur) kanallarda yazma izni verilecek roller. Örn: ['DEVELOPER', 'OPERATIVE']
// Varsayılan boş: Mesaj yazma yalnızca Administrator yetkisi olanlar (ARCHITECT) ve bot için açıktır.
const LOCKED_WRITE_ROLES = [];

const EMBED_COLOR = 0x23252b; // mat / koyu grafit
const ENGINE_TITLE = 'AETHERIX SYSTEM ENGINE';

/* ───────────────────────────── ROLLER ─────────────────────────────
 * Sıra önemlidir: Discord yeni rolü en alta eklediği için yukarıdan
 * aşağıya oluşturulduğunda hiyerarşi birebir bu sırada olur.
 */
const ROLES = {
  ARCHITECT: {
    name: 'AETHERIX ARCHITECT',
    color: 0xb91c1c,
    hoist: true,
    permissions: [P.Administrator],
  },
  DEVELOPER: {
    name: 'AETHERIX DEVELOPER',
    color: 0x2563eb,
    hoist: true,
    permissions: [
      P.ManageChannels, P.ManageWebhooks, P.ManageMessages, P.ManageThreads,
      P.ViewAuditLog, P.CreateInstantInvite, P.EmbedLinks, P.AttachFiles,
    ],
  },
  OPERATIVE: {
    name: 'AETHERIX OPERATIVE',
    color: 0x7c3aed,
    hoist: true,
    permissions: [
      P.KickMembers, P.BanMembers, P.ModerateMembers, P.ManageMessages,
      P.ManageNicknames, P.ManageThreads, P.ViewAuditLog, P.MuteMembers,
      P.DeafenMembers, P.MoveMembers,
    ],
  },
  PARTNER: {
    name: 'AETHERIX PARTNER',
    color: 0xd97706,
    hoist: true,
    permissions: [P.CreateInstantInvite, P.EmbedLinks, P.AttachFiles, P.UseExternalEmojis],
  },
  MEMBER: {
    name: 'AETHERIX MEMBER',
    color: 0x10b981,
    hoist: false,
    permissions: [
      P.ViewChannel, P.SendMessages, P.ReadMessageHistory, P.AddReactions,
      P.EmbedLinks, P.AttachFiles, P.UseExternalEmojis, P.ChangeNickname,
      P.Connect, P.Speak,
    ],
  },
  UNVERIFIED: {
    name: 'UNVERIFIED',
    color: 0x6b7280,
    hoist: false,
    permissions: [],
  },
};

// "MEMBER ve üstü" roller
const VERIFIED_KEYS = ['MEMBER', 'PARTNER', 'OPERATIVE', 'DEVELOPER', 'ARCHITECT'];

/* ──────────────────────── KANAL YAPISI (!setup) ────────────────────────
 * mode: 'entry'    → yalnızca UNVERIFIED görür, yazamaz
 *       'readonly' → MEMBER+ görür, yazamaz
 *       'chat'     → MEMBER+ görür ve yazabilir
 */
const STRUCTURE = [
  {
    name: '🏛 // ENTRY-POINT',
    mode: 'entry',
    channels: [
      {
        name: 'access-request',
        topic: 'AETHERIX erişim doğrulama noktası.',
        panel: 'verify',
      },
      {
        name: 'rules-doctrine',
        topic: 'AETHERIX operasyonel doktrini ve topluluk kuralları.',
        panel: 'rules',
      },
    ],
  },
  {
    name: '📢 // AETHERIX ECOSYSTEM',
    mode: 'readonly',
    channels: [
      {
        name: 'system-updates',
        topic: 'Resmi sistem ve altyapı güncellemeleri.',
        heading: 'SİSTEM GÜNCELLEMELERİ // RESMİ BİLDİRİM KANALI',
        intro: 'Altyapı, sunucu ve operasyon güncellemeleri bu kanaldan yayımlanır. Kanal salt okunurdur.',
      },
      {
        name: 'applications',
        topic: 'Ekip ve iş ortaklığı başvuru süreçleri.',
        heading: 'BAŞVURU MERKEZİ',
        intro: 'Ekip ve iş ortaklığı başvuru süreçlerine ilişkin duyurular ve yönergeler bu kanalda yer alır.',
      },
      {
        name: 'tutorials-guides',
        topic: 'Teknik dokümantasyon, eğitim ve rehberler.',
        heading: 'EĞİTİM VE REHBERLER',
        intro: 'Teknik dokümantasyon, eğitim materyalleri ve operasyon rehberleri burada yayımlanır.',
      },
    ],
  },
  {
    name: '🔐 // AETHERIX CORE',
    mode: 'chat',
    channels: [
      {
        name: 'command-center',
        topic: 'AETHERIX ana iletişim kanalı.',
        mode: 'chat',
        heading: 'KOMUTA MERKEZİ // ANA İLETİŞİM',
        intro: 'Doğrulanmış üyeler için ana iletişim kanalıdır. Doktrin kuralları bu kanalda da geçerlidir.',
      },
      {
        name: 'dashboard-feed',
        topic: 'Kilitli duyuru alanı.',
        mode: 'readonly',
        heading: 'DASHBOARD AKIŞI // KİLİTLİ DUYURU ALANI',
        intro: 'Bu alan yalnızca yetkili sistem bildirimlerine ayrılmıştır. Mesaj yazımı kapalıdır.',
      },
    ],
  },
];

/* ───────────────────────────── YARDIMCILAR ───────────────────────────── */

const makeEmbed = ({ heading, description, fields = [], footer = 'AETHERIX // SECURE PROTOCOL' }) =>
  new EmbedBuilder()
    .setColor(EMBED_COLOR)
    .setTitle(ENGINE_TITLE)
    .setDescription(`**${heading}**\n\n${description}`)
    .addFields(fields)
    .setFooter({ text: footer })
    .setTimestamp();

const findRole = (guild, key) => guild.roles.cache.find((r) => r.name === ROLES[key].name);

/** Kanal tipine göre izin (permission overwrite) listesi üretir. */
function buildOverwrites(guild, roles, mode) {
  const overwrites = [
    { id: guild.roles.everyone.id, deny: [P.ViewChannel] },
    {
      id: guild.members.me.id,
      allow: [P.ViewChannel, P.SendMessages, P.EmbedLinks, P.ReadMessageHistory, P.ManageMessages],
    },
  ];

  if (mode === 'entry') {
    overwrites.push({
      id: roles.UNVERIFIED.id,
      allow: [P.ViewChannel, P.ReadMessageHistory],
      deny: [
        P.SendMessages, P.SendMessagesInThreads, P.CreatePublicThreads,
        P.CreatePrivateThreads, P.AddReactions,
      ],
    });
    return overwrites;
  }

  for (const key of VERIFIED_KEYS) {
    const id = roles[key].id;
    if (mode === 'chat') {
      overwrites.push({
        id,
        allow: [P.ViewChannel, P.ReadMessageHistory, P.SendMessages, P.EmbedLinks, P.AttachFiles, P.AddReactions],
      });
    } else if (LOCKED_WRITE_ROLES.includes(key)) {
      overwrites.push({
        id,
        allow: [P.ViewChannel, P.ReadMessageHistory, P.SendMessages, P.EmbedLinks, P.AddReactions],
      });
    } else {
      overwrites.push({
        id,
        allow: [P.ViewChannel, P.ReadMessageHistory, P.AddReactions],
        deny: [P.SendMessages, P.SendMessagesInThreads, P.CreatePublicThreads, P.CreatePrivateThreads],
      });
    }
  }
  return overwrites;
}

async function ensureRole(guild, def) {
  const existing = guild.roles.cache.find((r) => r.name === def.name);
  if (existing) return { role: existing, created: false };
  const role = await guild.roles.create({
    name: def.name,
    color: def.color,
    hoist: def.hoist,
    mentionable: false,
    permissions: def.permissions,
    reason: 'AETHERIX SYSTEM ENGINE: rol tahsisi',
  });
  return { role, created: true };
}

async function ensureChannel(guild, { name, type, parent = null, topic, overwrites }) {
  const existing = guild.channels.cache.find(
    (c) => c.type === type && c.name === name && (c.parentId ?? null) === (parent?.id ?? null),
  );
  if (existing) {
    await existing.edit({
      permissionOverwrites: overwrites,
      ...(topic ? { topic } : {}),
      reason: 'AETHERIX SYSTEM ENGINE: izin senkronizasyonu',
    });
    return { channel: existing, created: false };
  }
  const channel = await guild.channels.create({
    name,
    type,
    parent: parent?.id,
    topic,
    permissionOverwrites: overwrites,
    reason: 'AETHERIX SYSTEM ENGINE: kanal tahsisi',
  });
  return { channel, created: true };
}

/* ───────────────────────────── PANEL MESAJLARI ───────────────────────────── */

function buildPanel(spec) {
  if (spec.panel === 'verify') {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(VERIFY_BUTTON_ID)
        .setLabel('[ VERIFY ACCESS ]')
        .setStyle(ButtonStyle.Secondary),
    );
    return {
      embeds: [
        makeEmbed({
          heading: 'ERİŞİM TALEBİ // KİMLİK DOĞRULAMA',
          description:
            'Sunucu altyapısına erişim, doğrulama protokolünün tamamlanmasına bağlıdır.\n\n' +
            'Doktrini (#rules-doctrine) okuduğunuzu ve kabul ettiğinizi onaylamak için aşağıdaki ' +
            '**[ VERIFY ACCESS ]** düğmesini kullanın. Doğrulama sonrasında yetkiniz anında güncellenir.',
          footer: 'AETHERIX // ENTRY-POINT PROTOCOL',
        }),
      ],
      components: [row],
    };
  }

  if (spec.panel === 'rules') {
    return {
      embeds: [
        makeEmbed({
          heading: 'AETHERIX DOKTRİNİ // OPERASYONEL KURALLAR',
          description:
            'Bu topluluğa erişim, aşağıdaki doktrine koşulsuz uyumu gerektirir. ' +
            'İhlaller kademeli yaptırıma tabidir.',
          fields: [
            {
              name: '01 // SAYGI VE DİSİPLİN',
              value: 'Tüm üyeler karşılıklı saygı ve profesyonel iletişim standartlarına uymakla yükümlüdür. Taciz, hakaret ve ayrımcılık kesinlikle yasaktır.',
            },
            {
              name: '02 // İÇERİK POLİTİKASI',
              value: 'Spam, izinsiz reklam ile yasa dışı, müstehcen veya zararlı içerik paylaşımı yasaktır.',
            },
            {
              name: '03 // GÜVENLİK VE GİZLİLİK',
              value: 'Kişisel verilerin izinsiz paylaşımı, sosyal mühendislik ve kimlik avı girişimleri yasaktır. Şüpheli durumlar OPERATIVE ekibine bildirilmelidir.',
            },
            {
              name: '04 // OPERASYONEL YETKİ',
              value: 'Yetkili ekip kararları bağlayıcıdır. İtirazlar yalnızca resmi kanallar üzerinden iletilir.',
            },
            {
              name: '05 // PLATFORM UYUMU',
              value: 'Discord Hizmet Şartları ve Topluluk Yönergeleri tüm faaliyetlerde geçerlidir.',
            },
          ],
          footer: 'AETHERIX // DOKTRİN v1.0',
        }),
      ],
    };
  }

  if (spec.intro) {
    return { embeds: [makeEmbed({ heading: spec.heading, description: spec.intro })] };
  }
  return null;
}

/** Aynı paneli tekrar göndermemek için son mesajlara bakar. */
async function postPanel(channel, spec, botId) {
  const payload = buildPanel(spec);
  if (!payload) return;
  const recent = await channel.messages.fetch({ limit: 25 }).catch(() => null);
  const exists = recent?.some(
    (m) => m.author.id === botId && m.embeds[0]?.description === payload.embeds[0].data.description,
  );
  if (!exists) await channel.send(payload);
}

/* ───────────────────────────── !SETUP ───────────────────────────── */

const setupLocks = new Set();

async function runSetup(message) {
  const { guild, channel } = message;

  if (setupLocks.has(guild.id)) {
    return message.reply({
      embeds: [makeEmbed({ heading: 'İŞLEM DEVAM EDİYOR', description: 'Kurulum protokolü zaten yürütülüyor. Lütfen tamamlanmasını bekleyin.' })],
    });
  }
  setupLocks.add(guild.id);

  const status = await channel.send({
    embeds: [makeEmbed({ heading: 'KURULUM PROTOKOLÜ BAŞLATILDI', description: 'Rol hiyerarşisi ve kanal mimarisi yapılandırılıyor. Lütfen bekleyin...' })],
  });

  try {
    const me = await guild.members.fetchMe();
    if (!me.permissions.has(P.Administrator)) {
      throw new Error('Bot, kurulum için Administrator yetkisine sahip olmalıdır.');
    }
    await guild.roles.fetch();
    await guild.channels.fetch();

    // 1) Roller
    const roles = {};
    const createdRoles = [];
    for (const [key, def] of Object.entries(ROLES)) {
      const { role, created } = await ensureRole(guild, def);
      roles[key] = role;
      if (created) createdRoles.push(def.name);
    }
    const misplaced = Object.values(roles).filter((r) => me.roles.highest.comparePositionTo(r) <= 0);

    // 2) Kategoriler ve kanallar
    const managedIds = new Set();
    let createdChannels = 0;
    let syncedChannels = 0;

    for (const cat of STRUCTURE) {
      const { channel: category, created: catCreated } = await ensureChannel(guild, {
        name: cat.name,
        type: ChannelType.GuildCategory,
        overwrites: buildOverwrites(guild, roles, cat.mode),
      });
      managedIds.add(category.id);
      catCreated ? createdChannels++ : syncedChannels++;

      for (const spec of cat.channels) {
        const { channel: ch, created } = await ensureChannel(guild, {
          name: spec.name,
          type: ChannelType.GuildText,
          parent: category,
          topic: spec.topic,
          overwrites: buildOverwrites(guild, roles, spec.mode ?? cat.mode),
        });
        managedIds.add(ch.id);
        created ? createdChannels++ : syncedChannels++;
        await postPanel(ch, spec, me.id);
      }
    }

    // 3) Diğer tüm kanalları UNVERIFIED'dan gizle
    let hidden = 0;
    let hideFailed = 0;
    if (HIDE_EXISTING_CHANNELS) {
      const all = await guild.channels.fetch();
      for (const ch of all.values()) {
        if (!ch || managedIds.has(ch.id)) continue;
        try {
          await ch.permissionOverwrites.edit(
            roles.UNVERIFIED,
            { ViewChannel: false },
            { reason: 'AETHERIX SYSTEM ENGINE: erişim kısıtlaması' },
          );
          hidden++;
        } catch {
          hideFailed++;
        }
      }
    }

    // 4) Rapor
    const fields = [
      {
        name: 'ROL HİYERARŞİSİ',
        value: createdRoles.length
          ? `${createdRoles.length} rol oluşturuldu, ${Object.keys(ROLES).length - createdRoles.length} mevcut rol korundu.`
          : 'Tüm roller mevcut, değişiklik yapılmadı.',
      },
      {
        name: 'KANAL MİMARİSİ',
        value: `${createdChannels} öğe oluşturuldu, ${syncedChannels} mevcut öğe senkronize edildi.`,
      },
    ];
    if (HIDE_EXISTING_CHANNELS) {
      fields.push({
        name: 'ERİŞİM KISITLAMASI',
        value: `${hidden} mevcut kanal UNVERIFIED rolünden gizlendi.${hideFailed ? ` ${hideFailed} kanalda işlem başarısız oldu.` : ''}`,
      });
    }
    if (misplaced.length) {
      fields.push({
        name: '⚠ HİYERARŞİ UYARISI',
        value: `Bot rolü şu rollerin altında kalıyor: ${misplaced.map((r) => r.name).join(', ')}. Rol atamalarının çalışması için bot rolünü AETHERIX rollerinin üzerine taşıyın.`,
      });
    }

    await status.edit({
      embeds: [
        makeEmbed({
          heading: 'KURULUM PROTOKOLÜ TAMAMLANDI',
          description: 'AETHERIX altyapısı başarıyla yapılandırıldı. Sistem operasyonel durumdadır.',
          fields,
        }),
      ],
    });
  } catch (err) {
    console.error('[SETUP] Hata:', err);
    await status
      .edit({
        embeds: [
          makeEmbed({
            heading: 'KURULUM PROTOKOLÜ BAŞARISIZ',
            description: `Yapılandırma sırasında kritik bir hata oluştu.\n\`\`\`${String(err.message).slice(0, 500)}\`\`\``,
          }),
        ],
      })
      .catch(() => {});
  } finally {
    setupLocks.delete(guild.id);
  }
}

/* ───────────────────────────── CLIENT ───────────────────────────── */

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,   // Privileged
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // Privileged
  ],
});

client.once(Events.ClientReady, (c) => {
  console.log(`[AETHERIX SYSTEM ENGINE] Çevrimiçi: ${c.user.tag}`);
});

// Yeni üyeye otomatik UNVERIFIED
client.on(Events.GuildMemberAdd, async (member) => {
  if (member.user.bot) return;
  const role = findRole(member.guild, 'UNVERIFIED');
  if (!role) {
    console.warn(`[JOIN] "${ROLES.UNVERIFIED.name}" rolü bulunamadı (${member.guild.name}). Önce !setup çalıştırın.`);
    return;
  }
  try {
    await member.roles.add(role, 'AETHERIX SYSTEM ENGINE: otomatik rol tahsisi');
  } catch (err) {
    console.error(`[JOIN] Rol verilemedi (${member.user.tag}):`, err.message);
  }
});

// !setup komutu
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.inGuild()) return;
  if (!message.content.startsWith(PREFIX)) return;

  const command = message.content.slice(PREFIX.length).trim().split(/\s+/)[0].toLowerCase();
  if (command !== 'setup') return;

  if (!message.member.permissions.has(P.Administrator)) {
    return message.reply({
      embeds: [makeEmbed({ heading: 'ERİŞİM REDDEDİLDİ', description: 'Bu komut yalnızca yönetici yetkisine sahip personel tarafından yürütülebilir.' })],
    });
  }
  await runSetup(message);
});

// [ VERIFY ACCESS ] butonu
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton() || interaction.customId !== VERIFY_BUTTON_ID) return;

  await interaction.deferReply({ flags: MessageFlags.Ephemeral });

  const reply = (heading, description) =>
    interaction.editReply({ embeds: [makeEmbed({ heading, description })] });

  try {
    const { guild } = interaction;
    const memberRole = findRole(guild, 'MEMBER');
    const unverifiedRole = findRole(guild, 'UNVERIFIED');

    if (!memberRole || !unverifiedRole) {
      return reply('SİSTEM YAPILANDIRILMAMIŞ', 'Gerekli roller bulunamadı. Lütfen yetkili ekiple iletişime geçin.');
    }

    const member = await guild.members.fetch(interaction.user.id);

    if (member.roles.cache.has(memberRole.id) && !member.roles.cache.has(unverifiedRole.id)) {
      return reply('DOĞRULAMA MEVCUT', 'Hesabınız zaten doğrulanmıştır. Ek bir işlem gerekmemektedir.');
    }

    // Önce yetki ver, sonra kısıtlı rolü kaldır (kullanıcı hiçbir anda rolsüz kalmaz)
    await member.roles.add(memberRole, 'AETHERIX SYSTEM ENGINE: doğrulama');
    if (member.roles.cache.has(unverifiedRole.id)) {
      await member.roles.remove(unverifiedRole, 'AETHERIX SYSTEM ENGINE: doğrulama');
    }

    return reply(
      'ERİŞİM ONAYLANDI',
      'Kimlik doğrulama başarıyla tamamlandı. **AETHERIX MEMBER** yetkisi hesabınıza tanımlandı; ' +
        'kilitli kanallar ve ana iletişim alanı erişiminize açılmıştır.',
    );
  } catch (err) {
    console.error('[VERIFY] Hata:', err);
    const hint =
      err.code === 50013
        ? 'Bot rolü, atanacak rollerin altında konumlanmaktadır. Yetkili ekibe bildirin.'
        : 'Beklenmeyen bir sistem hatası oluştu. Lütfen daha sonra tekrar deneyin.';
    return reply('DOĞRULAMA BAŞARISIZ', hint).catch(() => {});
  }
});

client.on(Events.Error, (err) => console.error('[CLIENT] Hata:', err));
process.on('unhandledRejection', (err) => console.error('[UNHANDLED]', err));

if (!TOKEN) {
  console.error('DISCORD_TOKEN ortam değişkeni tanımlı değil. Örn: DISCORD_TOKEN=xxxxx node index.js');
  process.exit(1);
}
client.login(TOKEN);

  
