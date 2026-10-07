"use client";

import React, { useState } from 'react';
import card from '../StepCard.module.css';
import form from '../../ui/Form.module.css';
import choice from '../ui/Choice.module.css';
import bg from './BackgroundStep.module.css';
import styles from './ScreenDesignStep.module.css';
import Carousel from '../ui/Carousel';
import ScreenContent, { SCREEN_STYLES, screenWidthAt } from '../ui/ScreenContent';
import StepFooter from '../ui/StepFooter';
import TicketTabs from '../ui/TicketTabs';
import { FOODVILLA_ART, PROMO_TYPES, PromoTypeId, RETAIL_CATEGORIES, STYLE_KEYWORDS } from '../data';
import { findScreen, ScreenModel } from '../devices';
import { EVERYDAY_HEADER } from '../paperTickets';
import { selectedScreens } from '../pricing';
import { screenArtNeeds, screenPromoTypes, screenStyleOf, ScreenTicketDef, screenTickets, uploadComplete } from '../screenTickets';
import { BackgroundMode, BrandSetup, brandColours, PromoUpload, ScreenSetup } from '../state';

interface ScreenDesignStepProps {
  value: ScreenSetup;
  onChange: (value: ScreenSetup) => void;
  brand: BrandSetup;
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
}

type Orientation = 'portrait' | 'landscape';

const CAROUSEL_HEIGHT = 220;
const AI_MS = 1400;
const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

/** Design for Digital Screen backgrounds, laid out like the Paper background steps */
const ScreenDesignStep: React.FC<ScreenDesignStepProps> = ({ value: saved, onChange, brand, onBack, onNext, nextLabel }) => {
  // Older saved state may not have the newer fields
  const value: ScreenSetup = {
    ...saved,
    mode: saved.mode ?? 'select',
    promoTypes: saved.promoTypes ?? [],
    typeStyles: saved.typeStyles ?? {},
    typePrompts: saved.typePrompts ?? {},
    aiTypes: saved.aiTypes ?? [],
    everydayUpload: saved.everydayUpload ?? {},
    typeUploads: saved.typeUploads ?? {},
  };
  const [showErrors, setShowErrors] = useState(false);
  const [openType, setOpenType] = useState<PromoTypeId | null>(PROMO_TYPES[0].id);
  const [viewKey, setViewKey] = useState('everyday');
  const [aiBusy, setAiBusy] = useState<string | null>(null);
  const [aiResults, setAiResults] = useState<Record<string, string>>({});
  const [uploadError, setUploadError] = useState('');
  const set = (patch: Partial<ScreenSetup>) => onChange({ ...value, ...patch });

  const lines = selectedScreens(value);
  const models = lines.length ? lines.map((l) => l.model) : [findScreen('zkl290')!];
  // Designs are shown on the first non-bar screen chosen, so the carousels stay readable
  const designModel = models.find((m) => m.shape !== 'bar') ?? models[0];
  const need = screenArtNeeds(value);
  const tickets = screenTickets(value);
  const viewing = tickets.find((t) => t.key === viewKey) ?? tickets[0];

  const screen = (model: ScreenModel, t: Pick<ScreenTicketDef, 'mode' | 'style' | 'header' | 'upload'>, height: number, maxWidth?: number) => (
    <div style={{ width: Math.min(screenWidthAt(model, height), maxWidth ?? Infinity), maxWidth: '100%' }}>
      <ScreenContent
        model={model}
        mode={t.mode}
        style={t.style}
        header={t.header}
        {...brandColours(brand, t.mode)}
        logoUrl={brand.logoUrl}
        upload={t.upload}
        blank
        maxHeight={height}
        maxWidth={maxWidth}
      />
    </div>
  );
  const designPreview = (mode: 'everyday' | 'promo', style: number, header: string) =>
    screen(designModel, { mode, style, header }, CAROUSEL_HEIGHT, 560);

  /* ---------- Select ---------- */
  const moveStyle = (id: PromoTypeId, style: number) => set({ typeStyles: { ...value.typeStyles, [id]: style } });
  const tickType = (id: PromoTypeId) =>
    set({ promoTypes: value.promoTypes.includes(id) ? value.promoTypes.filter((x) => x !== id) : [...value.promoTypes, id] });

  /* ---------- Build with AI ---------- */
  const styleFromPrompt = (prompt: string, kind: 'everyday' | 'promo') =>
    STYLE_KEYWORDS[kind].findIndex((words) => words.some((w) => prompt.toLowerCase().includes(w)));

  const buildEveryday = () => {
    setAiBusy('everyday');
    setTimeout(() => {
      const found = styleFromPrompt(value.aiPrompt, 'everyday');
      const style = found >= 0 ? found : (RETAIL_CATEGORIES.indexOf(brand.category) + 1) % SCREEN_STYLES.everyday.length;
      onChange({ ...value, everydayStyle: style, everydayChosen: true, aiDone: true });
      setAiResults((r) => ({ ...r, everyday: `AI picked the ${SCREEN_STYLES.everyday[style]} design for your Everyday content.` }));
      setViewKey('everyday');
      setAiBusy(null);
    }, AI_MS);
  };

  const buildPromo = (id: PromoTypeId) => {
    setAiBusy(id);
    setTimeout(() => {
      const t = PROMO_TYPES.find((x) => x.id === id)!;
      const found = styleFromPrompt(value.typePrompts[id] ?? '', 'promo');
      const style = found >= 0 ? found : t.style;
      onChange({
        ...value,
        typeStyles: { ...value.typeStyles, [id]: style },
        promoTypes: value.promoTypes.includes(id) ? value.promoTypes : [...value.promoTypes, id],
        aiTypes: value.aiTypes.includes(id) ? value.aiTypes : [...value.aiTypes, id],
      });
      setAiResults((r) => ({ ...r, [id]: `AI ${found >= 0 ? 'used' : 'picked'} the ${SCREEN_STYLES.promo[style]} design for your ${t.name} content.` }));
      setViewKey(id);
      setAiBusy(null);
    }, AI_MS);
  };

  /* ---------- Upload ---------- */
  const setUpload = (type: PromoTypeId | 'everyday', patch: PromoUpload) => {
    if (type === 'everyday') set({ everydayUpload: { ...value.everydayUpload, ...patch } });
    else set({ typeUploads: { ...value.typeUploads, [type]: { ...value.typeUploads[type], ...patch } } });
  };
  const onFile = (type: PromoTypeId | 'everyday', o: Orientation, file: File | undefined) => {
    if (!file) return;
    const video = /^video\/(mp4|webm)$/.test(file.type);
    if (!video && !/^image\/(jpeg|png)$/.test(file.type)) {
      setUploadError('Upload a JPEG, PNG, MP4 or WebM file.');
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError('Files must be 50MB or smaller.');
      return;
    }
    setUploadError('');
    const url = URL.createObjectURL(file);
    setUpload(type, o === 'portrait' ? { portraitName: file.name, portraitUrl: url, portraitVideo: video } : { landscapeName: file.name, landscapeUrl: url, landscapeVideo: video });
  };
  const applySample = (type: PromoTypeId | 'everyday', o: Orientation) => {
    const art =
      type === 'everyday'
        ? { name: FOODVILLA_ART.screen.name, url: o === 'portrait' ? FOODVILLA_ART.screen.portrait : FOODVILLA_ART.screen.landscape }
        : FOODVILLA_ART.promo(type, o);
    setUpload(type, o === 'portrait' ? { portraitName: art.name, portraitUrl: art.url, portraitVideo: false } : { landscapeName: art.name, landscapeUrl: art.url, landscapeVideo: false });
  };

  const uploadBox = (type: PromoTypeId | 'everyday', o: Orientation) => {
    const u = type === 'everyday' ? value.everydayUpload : value.typeUploads[type] ?? {};
    const name = o === 'portrait' ? u.portraitName : u.landscapeName;
    const url = o === 'portrait' ? u.portraitUrl : u.landscapeUrl;
    const isVideo = o === 'portrait' ? u.portraitVideo : u.landscapeVideo;
    return (
      <div className={bg.uploadBox}>
        <span className={form.label}>{o === 'portrait' ? 'Portrait artwork (floor-standing screens)' : 'Landscape artwork (bars and wide displays)'}</span>
        <label className={bg.dropzone}>
          <input type="file" accept="image/jpeg,image/png,video/mp4,video/webm" onChange={(e) => onFile(type, o, e.target.files?.[0])} hidden />
          {url ? (
            <span className={bg.uploaded}>
              {isVideo ? (
                <video src={url} muted className={styles.thumb} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={url} alt="" />
              )}
              <span>
                <strong>{name}</strong>
                <small>Click to replace.</small>
              </span>
            </span>
          ) : (
            <span>
              <strong>Drop an image or video here</strong>
              <small>JPEG, PNG, MP4 or WebM, or click to browse</small>
            </span>
          )}
        </label>
        {!url && (
          <button type="button" className={`${form.link} ${bg.sample}`} onClick={() => applySample(type, o)}>
            Use Foodvilla sample artwork
          </button>
        )}
      </div>
    );
  };
  const uploadBoxes = (type: PromoTypeId | 'everyday') => (
    <div className={need.portrait && need.landscape ? bg.uploads : ''}>
      {need.landscape && uploadBox(type, 'landscape')}
      {need.portrait && uploadBox(type, 'portrait')}
    </div>
  );

  /* ---------- Shared pieces ---------- */
  const aiBox = (title: string, hint: string, prompt: string, onPrompt: (v: string) => void, onBuild: () => void, busy: boolean, built: boolean) => (
    <div className={`${bg.ai} ${bg.aiStack}`}>
      <div className={bg.aiText}>
        <strong>{title}</strong>
        <small>{hint}</small>
        <textarea className={`${form.input} ${bg.prompt}`} rows={3} placeholder="e.g. natural kraft paper look" value={prompt} onChange={(e) => onPrompt(e.target.value)} aria-label={title} />
      </div>
      <button type="button" className={`${form.button} ${form.buttonSecondary} ${bg.aiButton}`} onClick={onBuild} disabled={!!aiBusy}>
        <span className={form.buttonIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2zm7 11l.9 2.6 2.6.9-2.6.9L19 20l-.9-2.6-2.6-.9 2.6-.9L19 13z" />
          </svg>
        </span>
        <span className={form.buttonText}>{busy ? 'Building...' : built ? 'Build again' : 'Build with AI'}</span>
      </button>
    </div>
  );

  // Accordion of promotions; `status` and `body` depend on the open tab
  const promoAccordion = (title: string, intro: string, status: (id: PromoTypeId) => { done: boolean; text: string }, body: (id: PromoTypeId) => React.ReactNode) => (
    <section className={card.section}>
      <h3 className={card.sectionTitle}>{title}</h3>
      <p className={card.sectionIntro}>{intro}</p>
      <div className={bg.accordion}>
        {PROMO_TYPES.map((t) => {
          const open = openType === t.id;
          const st = status(t.id);
          return (
            <div key={t.id} className={`${bg.accItem} ${open ? bg.accOpen : ''}`}>
              <button type="button" className={bg.accHead} aria-expanded={open} onClick={() => setOpenType(open ? null : t.id)}>
                <strong className={bg.accTitle}>{t.name}</strong>
                <span className={bg.accText}>{t.description}</span>
                <span className={`${bg.accStatus} ${st.done ? bg.accAdded : ''}`}>{st.text}</span>
                <span className={bg.chevron} aria-hidden="true" />
              </button>
              {open && <div className={bg.accBody}>{body(t.id)}</div>}
            </div>
          );
        })}
      </div>
    </section>
  );

  /* ---------- Readiness ---------- */
  const promosReady = screenPromoTypes(value).length > 0;
  const everydayReady =
    value.mode === 'upload' ? uploadComplete(value, value.everydayUpload) : value.mode === 'ai' ? value.aiDone : value.everydayChosen;
  const ready = everydayReady && promosReady;
  const errorText = !everydayReady
    ? value.mode === 'upload'
      ? 'Upload your Everyday screen artwork.'
      : value.mode === 'ai'
        ? 'Build your Everyday screen design with AI.'
        : 'Tick an Everyday screen design.'
    : value.mode === 'upload'
      ? 'Upload the artwork for at least one promotion.'
      : value.mode === 'ai'
        ? 'Build at least one promotion with AI.'
        : 'Tick a design for at least one promotion.';

  const handleNext = () => {
    if (!ready) {
      setShowErrors(true);
      return;
    }
    onNext();
  };

  const tabs: { id: BackgroundMode; title: string; text: string }[] = [
    { id: 'select', title: 'Select a design', text: 'The same designs as your Paper tickets' },
    { id: 'ai', title: 'Build with AI', text: 'Describe the look you want' },
    { id: 'upload', title: 'Upload your own', text: 'Use screen artwork or video you have' },
  ];

  return (
    <div className={card.card}>
      <div className={card.titleBar}>
        <h2 className={card.headline}>Design your screen content</h2>
        <p className={card.subline}>Pick a ready-made design, build one with AI, or upload your own artwork</p>
      </div>

      <section className={card.section}>
        <div className={bg.tabs} role="tablist">
          {tabs.map((t) => (
            <button
              type="button"
              role="tab"
              key={t.id}
              aria-selected={value.mode === t.id}
              className={`${bg.tab} ${value.mode === t.id ? bg.tabOn : ''}`}
              onClick={() => {
                set({ mode: t.id });
                setShowErrors(false);
              }}
            >
              <strong>{t.title}</strong>
              <small>{t.text}</small>
            </button>
          ))}
        </div>
      </section>

      {value.fromPaper && value.mode === 'select' && (
        <section className={card.section}>
          <div className={choice.note}>
            <strong>We brought across your Paper designs.</strong>
            <span>Your Everyday design and promotions are ready on your screens. Change anything you like.</span>
          </div>
        </section>
      )}

      {value.mode === 'select' && (
        <>
          <section className={card.section}>
            <h3 className={card.sectionTitle}>Select your Everyday screen design</h3>
            <p className={card.sectionIntro}>One design for all your Everyday content. Your logo and colours come from the Your brand step.</p>
            <Carousel
              items={SCREEN_STYLES.everyday.map((_, i) => i)}
              index={value.everydayStyle}
              onIndexChange={(everydayStyle) => set({ everydayStyle, everydayChosen: false })}
              selected={value.everydayChosen}
              onSelect={() => set({ everydayChosen: !value.everydayChosen })}
              renderItem={(s) => designPreview('everyday', s, EVERYDAY_HEADER)}
              label="everyday screen design"
              height={CAROUSEL_HEIGHT}
            />
            <p className={bg.accCaption}>
              <strong>{SCREEN_STYLES.everyday[value.everydayStyle]}</strong>. {value.everydayChosen ? 'Everyday design is chosen.' : 'Tick the circle to choose it.'}
            </p>
          </section>

          {promoAccordion(
            'Select your Promotional screen designs',
            'One design for each promotion. Open a promotion, slide to the design you like and tick it to add it.',
            (id) => ({
              done: value.promoTypes.includes(id),
              text: value.promoTypes.includes(id) ? `Added · ${SCREEN_STYLES.promo[screenStyleOf(value, id)]} design` : 'Not added',
            }),
            (id) => {
              const t = PROMO_TYPES.find((x) => x.id === id)!;
              const style = screenStyleOf(value, id);
              const added = value.promoTypes.includes(id);
              return (
                <>
                  <Carousel
                    items={SCREEN_STYLES.promo.map((_, i) => i)}
                    index={style}
                    onIndexChange={(i) => moveStyle(id, i)}
                    selected={added}
                    onSelect={() => tickType(id)}
                    renderItem={(s) => designPreview('promo', s, t.header)}
                    label={`${t.name} screen design`}
                    height={CAROUSEL_HEIGHT}
                  />
                  <p className={bg.accCaption}>
                    <strong>{SCREEN_STYLES.promo[style]}</strong>
                    {style === t.style && ' · Recommended'}. {added ? `${t.name} is added.` : `Tick the circle to add ${t.name}.`}
                  </p>
                </>
              );
            },
          )}
        </>
      )}

      {value.mode === 'ai' && (
        <>
          <section className={card.section}>
            <h3 className={card.sectionTitle}>Build your Everyday screen design with AI</h3>
            <p className={card.sectionIntro}>Describe the look you want. Your logo and colours come from the Your brand step.</p>
            {aiBox(
              'Let AI build your Everyday screen design',
              'For example a texture or style, such as kraft paper, brick or clean.',
              value.aiPrompt,
              (aiPrompt) => set({ aiPrompt }),
              buildEveryday,
              aiBusy === 'everyday',
              value.aiDone,
            )}
            {aiBusy === 'everyday' ? (
              <p className={bg.aiResult} role="status">
                <span className={bg.spinner} /> Building your Everyday design...
              </p>
            ) : (
              value.aiDone && aiResults.everyday && <p className={bg.aiResult}>{aiResults.everyday}</p>
            )}
          </section>

          {promoAccordion(
            'Build your Promotional screen designs with AI',
            "Open a promotion, describe the look you want and click Build with AI. Only that promotion's design is built.",
            (id) => {
              const built = value.aiTypes.includes(id) && value.promoTypes.includes(id);
              return { done: built, text: aiBusy === id ? 'Building...' : built ? `Added · ${SCREEN_STYLES.promo[screenStyleOf(value, id)]} design` : 'Not added' };
            },
            (id) => {
              const t = PROMO_TYPES.find((x) => x.id === id)!;
              const built = value.aiTypes.includes(id) && value.promoTypes.includes(id);
              return (
                <>
                  {aiBox(
                    `Let AI build your ${t.name} screen design`,
                    `Describe the look you want for ${t.name}, such as gold, frame or slant.`,
                    value.typePrompts[id] ?? '',
                    (v) => set({ typePrompts: { ...value.typePrompts, [id]: v } }),
                    () => buildPromo(id),
                    aiBusy === id,
                    built,
                  )}
                  {aiBusy === id ? (
                    <p className={bg.aiResult} role="status">
                      <span className={bg.spinner} /> Building your {t.name} design...
                    </p>
                  ) : (
                    built && aiResults[id] && <p className={bg.aiResult}>{aiResults[id]}</p>
                  )}
                </>
              );
            },
          )}
        </>
      )}

      {value.mode === 'upload' && (
        <>
          <section className={card.section}>
            <h3 className={card.sectionTitle}>Upload your Everyday screen artwork</h3>
            <p className={card.sectionIntro}>Upload artwork or video for your Everyday content. It is shown on your screens as it is.</p>
            {uploadBoxes('everyday')}
          </section>

          {promoAccordion(
            'Upload your Promotional screen artwork',
            'Open a promotion and upload its artwork or video.',
            (id) => {
              const u = value.typeUploads[id];
              const done = uploadComplete(value, u);
              return { done, text: done ? 'Added · uploaded' : u?.portraitUrl || u?.landscapeUrl ? 'Upload incomplete' : 'Not added' };
            },
            (id) => uploadBoxes(id),
          )}
          {uploadError && <p className={form.error}>{uploadError}</p>}
        </>
      )}

      <section className={card.section}>
        <h3 className={card.sectionTitle}>How it looks on your screens</h3>
        <p className={card.sectionIntro}>Choose Everyday or a promotion to see its design on each screen you chose.</p>
        <TicketTabs tickets={tickets.map((t) => ({ key: t.key, name: t.name, promo: t.mode === 'promo' }))} activeKey={viewing.key} onChange={setViewKey} />
        <div className={styles.preview}>
          {models.map((m) => (
            <figure key={m.id} className={m.shape === 'portrait' ? styles.portraitItem : styles.wideItem}>
              {screen(m, viewing, m.shape === 'portrait' ? 300 : m.shape === 'wide' ? 170 : 60)}
              <figcaption>
                {m.size} {m.model} · {m.resolution} px
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <StepFooter onBack={onBack} nextLabel={nextLabel} onNext={handleNext} error={showErrors && !ready ? errorText : ''} />
    </div>
  );
};

export default ScreenDesignStep;
