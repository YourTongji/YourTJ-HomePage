import React from 'react';
import { ClockIcon, FileTextIcon, LibraryIcon } from '../../components/icons';
import { MOCK_WIKI_NAMESPACES, MOCK_WIKI_RECENT } from '../data';
import { HUB, muted, tint } from '../tokens';
import { edge, HubShell } from '../primitives';

/*
 * Wiki · 知识库
 *
 * 1:1 Pixel-perfect reproduction of WikiHome.vue from YourTJ-Hub:
 * - Hero section: gf-card with Library icon, "知识库" title, and official subtitle.
 * - Namespaces section: 3-column gf-card grid with pageCount badge, description and update timestamp.
 * - Recent updates section: official list rows with item title, wiki path and clock timestamp.
 */

export const HubWiki: React.FC = () => (
  <HubShell wikiMode contentPadding="20px 24px">
    <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 1. Hero Card: direct port of WikiHome.vue hero section */}
      <section
        style={{
          background: HUB.base100,
          border: `1px solid ${edge(40)}`,
          borderRadius: 16,
          boxShadow: '0 2px 8px rgb(0 0 0 / 0.03)',
          overflow: 'hidden',
          padding: '24px 28px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 8,
              background: tint(HUB.info, 12),
              color: HUB.primary,
              flexShrink: 0,
            }}
          >
            <LibraryIcon className="h-5 w-5" />
          </span>
          <h1
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: HUB.content,
              lineHeight: 1.2,
            }}
          >
            知识库
          </h1>
        </div>
        <p
          style={{
            margin: '10px 0 0',
            maxWidth: 640,
            fontSize: 13.5,
            lineHeight: 1.6,
            color: muted(0.6),
          }}
        >
          社区共同维护的知识库：沉淀经验、教程与参考文档。
        </p>
      </section>

      {/* 2. Namespaces Grid: direct port of WikiHome.vue namespaces section */}
      <section style={{ marginTop: 14, flexShrink: 0 }}>
        <h2
          style={{
            margin: 0,
            padding: '0 4px',
            fontSize: 13,
            fontWeight: 600,
            color: muted(0.55),
          }}
        >
          命名空间
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: 12,
            marginTop: 8,
          }}
        >
          {MOCK_WIKI_NAMESPACES.map((namespace) => (
            <div
              key={namespace.name}
              style={{
                background: HUB.base100,
                border: `1px solid ${edge(35)}`,
                borderRadius: 16,
                padding: '14px 16px',
                boxShadow: '0 1px 3px rgb(0 0 0 / 0.02)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 600,
                    color: HUB.content,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {namespace.name}
                </h3>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3,
                    padding: '2px 6px',
                    borderRadius: 4,
                    background: HUB.base200,
                    fontSize: 11,
                    fontWeight: 600,
                    color: muted(0.55),
                    flexShrink: 0,
                  }}
                >
                  <FileTextIcon className="h-3 w-3" />
                  {namespace.pageCount}
                </span>
              </div>
              {namespace.description && (
                <p
                  style={{
                    margin: '6px 0 0',
                    fontSize: 12.5,
                    lineHeight: 1.5,
                    color: muted(0.55),
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {namespace.description}
                </p>
              )}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  marginTop: 10,
                  fontSize: 11.5,
                  color: muted(0.45),
                }}
              >
                <ClockIcon className="h-3 w-3" />
                {namespace.updatedAt}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Recent Updates List: direct port of WikiHome.vue recent section */}
      <section style={{ marginTop: 14, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <h2
          style={{
            margin: 0,
            padding: '0 4px',
            fontSize: 13,
            fontWeight: 600,
            color: muted(0.55),
          }}
        >
          最近更新
        </h2>
        <div
          style={{
            marginTop: 8,
            flex: 1,
            overflow: 'hidden',
            borderRadius: 16,
            border: `1px solid ${edge(35)}`,
            background: HUB.base100,
            boxShadow: '0 1px 3px rgb(0 0 0 / 0.02)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {MOCK_WIKI_RECENT.slice(0, 7).map((item, index) => (
            <div
              key={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '9.5px 16px',
                borderTop: index > 0 ? `1px solid ${edge(30)}` : undefined,
                minWidth: 0,
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: HUB.content,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginTop: 3,
                    fontSize: 11.5,
                    color: muted(0.55),
                  }}
                >
                  <span
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {item.path}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                    <ClockIcon className="h-3 w-3" />
                    {item.updatedAt}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  </HubShell>
);

export default HubWiki;
