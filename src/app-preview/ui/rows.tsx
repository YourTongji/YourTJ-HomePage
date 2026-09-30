import React from 'react';
import {Icon} from '../Icon';
import {C, alpha, tint} from '../theme';
import {Avatar} from './primitives';

/*
 * The app's list rows, ported one-for-one from ui_kit:
 *
 *   GfChip            components/gf_chip.dart
 *   GfAvatarStack     components/atoms/gf_avatar_stack.dart
 *   GfTopicRow        components/gf_topic_row.dart
 *   GfConversationRow components/business/gf_conversation_row.dart
 *   GfNotificationRow components/business/gf_notification_row.dart
 *
 * The film drew its own versions of these; the sizes and colours below are the
 * app's, so a row in the preview and a row on a phone measure the same.
 */

/** Category chip: base-300 fill, radius 8, 24pt tall, a 6pt colour dot. */
export const GfChip: React.FC<{label: string; color: string}> = ({label, color}) => (
  <div
    data-hover={label}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: 24,
      padding: '2px 8px',
      boxSizing: 'border-box',
      borderRadius: 8,
      background: C.base300,
    }}
  >
    <div style={{width: 6, height: 6, borderRadius: 3, background: color, flexShrink: 0}} />
    <span
      style={{
        marginLeft: 4,
        fontSize: 12,
        lineHeight: 1.25,
        fontWeight: 500,
        color: alpha(C.content, 0.72),
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {label}
    </span>
  </div>
);

/** Participant stack: 24pt avatars, 8pt overlap, each with a base-100 ring. */
export const GfAvatarStack: React.FC<{people: string[]}> = ({people}) => {
  const shown = people.slice(0, 4);
  return (
    <div
      style={{
        position: 'relative',
        height: 24,
        width: shown.length === 0 ? 0 : 24 + (shown.length - 1) * 16,
        flexShrink: 0,
      }}
    >
      {shown.map((who, index) => (
        <div key={who} style={{position: 'absolute', left: index * 16, top: 0}}>
          <Avatar who={who} size={24} />
        </div>
      ))}
    </div>
  );
};

/**
 * GfTopicRow: px-4 py-2.5, home variant min-h 88; title 15pt w500 over a 13pt
 * description at 55%; a 12pt meta line with the participant stack, the activity
 * text and the reply count behind a 14pt message glyph; and the row's own
 * hairline, line at 70%, sitting 10pt under the meta line.
 */
export const GfTopicRow: React.FC<{
  title: string;
  description?: string;
  categories?: {label: string; color: string}[];
  people?: string[];
  activity: string;
  replies: number;
  pinned?: boolean;
  hot?: boolean;
  unseen?: boolean;
  divider?: boolean;
}> = ({
  title,
  description,
  categories = [],
  people = [],
  activity,
  replies,
  pinned = false,
  hot = false,
  unseen = false,
  divider = true,
}) => (
  <div
    data-hover={title}
    style={{
      background: C.base100,
      padding: '10px 16px',
      boxSizing: 'border-box',
      minHeight: 88,
    }}
  >
    <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4, columnGap: 8}}>
      {pinned && <Icon name="pin-filled" size={16} color={C.error} />}
      <span style={{fontSize: 15, fontWeight: 500, lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%'}}>
        {title}
      </span>
      {hot && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: 20,
            padding: '0 6px',
            boxSizing: 'border-box',
            borderRadius: 4,
            background: alpha(C.warning, 0.12),
          }}
        >
          <Icon name="flame" size={12} color={C.warning} />
          <span style={{marginLeft: 2, fontSize: 11, fontWeight: 600, color: C.warning}}>hot</span>
        </div>
      )}
      {unseen && <div style={{width: 8, height: 8, borderRadius: 4, background: C.primary}} />}
      {categories.map((category) => (
        <GfChip key={category.label} label={category.label} color={category.color} />
      ))}
    </div>

    {description && (
      <div
        style={{
          marginTop: 4,
          fontSize: 13,
          lineHeight: 1.4,
          color: alpha(C.content, 0.55),
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {description}
      </div>
    )}

    <div style={{marginTop: 6, display: 'flex', alignItems: 'center'}}>
      {people.length > 0 && (
        <>
          <GfAvatarStack people={people} />
          <div style={{width: 8}} />
        </>
      )}
      <span style={{fontSize: 12, color: alpha(C.content, 0.55)}}>{activity}</span>
      <div style={{flex: 1}} />
      <Icon name="message-circle" size={14} color={alpha(C.content, 0.55)} />
      <span style={{marginLeft: 4, fontSize: 12, color: alpha(C.content, 0.55)}}>{replies}</span>
    </div>

    {divider && <div style={{marginTop: 10, height: 1, background: alpha(C.line, 0.7)}} />}
  </div>
);

/**
 * GfConversationRow: px-4 py-3 with a 40pt ringed avatar and a 10pt error dot;
 * the name is 16pt w600, the preview 15pt, and the time only rides the name row
 * while at least 120pt of width is left for the identity.
 */
export const GfConversationRow: React.FC<{
  who: string;
  name: string;
  message: string;
  time: string;
  unread?: boolean;
  active?: boolean;
}> = ({who, name, message, time, unread = false, active = false}) => (
  <div
    data-hover={name}
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      boxSizing: 'border-box',
      background: active ? alpha(C.info, 0.1) : C.base100,
      borderLeft: active ? `3px solid ${C.primary}` : '3px solid transparent',
    }}
  >
    <div style={{position: 'relative', flexShrink: 0}}>
      <Avatar who={who} size={40} />
      {unread && (
        <div
          style={{
            position: 'absolute',
            right: -1,
            top: -1,
            width: 10,
            height: 10,
            borderRadius: 5,
            background: C.error,
            border: `2px solid ${C.base100}`,
            boxSizing: 'content-box',
          }}
        />
      )}
    </div>
    <div style={{width: 12}} />
    <div style={{flex: 1, minWidth: 0}}>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <span
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: 16,
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {name}
        </span>
        <div style={{width: 8}} />
        <span style={{fontSize: 13, lineHeight: 1.35, color: alpha(C.content, 0.72), flexShrink: 0}}>
          {time}
        </span>
      </div>
      <div style={{height: 8}} />
      <div
        style={{
          fontSize: 15,
          fontWeight: unread ? 600 : 400,
          color: alpha(C.content, unread ? 0.85 : 0.72),
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {message}
      </div>
    </div>
  </div>
);

/** The five tones GfNotificationRow maps to theme colours. */
export const NOTIFICATION_TONES = {
  success: C.success,
  warning: C.warning,
  info: C.info,
  primary: C.primary,
  like: '#F91880',
} as const;

export type NotificationTone = keyof typeof NOTIFICATION_TONES;

/**
 * GfNotificationRow: an unread row is tinted with primary at 4%; a 28x44 slot
 * holds the 24pt event symbol, then the actor avatar, the unread dot and the
 * mark-read button over the heading, with the excerpt under it.
 */
export const GfNotificationRow: React.FC<{
  symbol: string;
  tone: NotificationTone;
  /** The heading; `actor` inside it is drawn bold, as the app does. */
  title: string;
  actor: string;
  subtitle?: string;
  time: string;
  unread?: boolean;
  who?: string;
}> = ({symbol, tone, title, actor, subtitle, time, unread = false, who}) => {
  const actorStart = title.indexOf(actor);
  return (
    <div
      data-hover={title}
      style={{
        padding: '12px 16px',
        boxSizing: 'border-box',
        background: unread ? tint(C.primary, 0.04) : C.base100,
        display: 'flex',
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          width: 28,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon name={symbol} size={24} color={NOTIFICATION_TONES[tone]} />
      </div>
      <div style={{width: 12}} />
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          {who && <Avatar who={who} size={36} />}
          <div style={{flex: 1}} />
          {unread && <div style={{width: 7, height: 7, borderRadius: 4, background: C.primary}} />}
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: 15,
            lineHeight: 1.4,
            color: C.content,
            maxHeight: 63,
            overflow: 'hidden',
          }}
        >
          {actorStart < 0 ? (
            title
          ) : (
            <>
              {title.slice(0, actorStart)}
              <strong style={{fontWeight: 700}}>{actor}</strong>
              {title.slice(actorStart + actor.length)}
            </>
          )}
          <span style={{fontSize: 13, color: C.iconMuted}}> · {time}</span>
        </div>
        {subtitle && (
          <div
            style={{
              marginTop: 5,
              fontSize: 15,
              lineHeight: 1.4,
              color: alpha(C.content, 0.65),
              maxHeight: 63,
              overflow: 'hidden',
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
