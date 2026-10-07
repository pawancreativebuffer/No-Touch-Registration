"use client";

import React, { useState } from 'react';
import card from '../StepCard.module.css';
import form from '../../ui/Form.module.css';
import styles from './BackgroundStep.module.css';
import Carousel from '../ui/Carousel';
import TicketBackground from '../ui/TicketBackground';
import StepFooter from '../ui/StepFooter';
import { CORE_TEXTURES, findSize, FOODVILLA_ART, PROMO_STYLES, PROMO_TYPES, PromoTypeId, RETAIL_CATEGORIES, STYLE_KEYWORDS, STYLE_NAMES, TYPE_KEYWORDS } from '../data';
import { BackgroundMode, BackgroundSetup, BrandSetup, brandColours, everydayDefaults, PromoUpload } from '../state';

interface BackgroundStepProps {
  kind: 'everyday' | 'promo';
  value: BackgroundSetup;
  onChange: (value: BackgroundSetup) => void;
  /** Category, logo and colours from the Your brand step */
  brand: BrandSetup;
  /** Ticket sizes picked on the sizes step, used to decide which uploads are needed */
  sizes: string[];
  onBack: () => void;
  onNext: () => void;
  nextLabel: string;
}

const COPY = {
  everyday: {
    title: 'Let us build your Everyday ticket background',
    upload: 'If you already have your everyday ticket backgrounds, upload them here.',
    portrait: 'Select your Portrait Everyday background',
    landscape: 'Select your Landscape Everyday background',
    ai: 'Let AI build your Everyday ticket',
    prompt: 'e.g. natural kraft paper look',
  },
  promo: {
    title: 'Let us build your Promotional ticket background',
    upload: 'If you already have your promotional ticket backgrounds, upload them here. They are used for all your promotion types.',
    portrait: 'Select your promotional background',
    landscape: 'Promotional Ticket Suite',
    ai: 'Let AI build your Promotional tickets',
    prompt: 'e.g. bold gold look for sale and clear out promotions',
  },
};

/** Everyday tickets have one design with this header */
const EVERYDAY_HEADER = 'Everyday Value';



const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const AI_MS = 1400;

type Orientation = 'portrait' | 'landscape';

/** One ticket design to show: the Everyday design, or one per promotion type */
interface TicketItem {
  key: string;
  label: string;
  header: string;
  style: (orientation: Orientation) => number;
  type?: PromoTypeId;
}

const BackgroundStep: React.FC<BackgroundStepProps> = ({ kind, value: saved, onChange, brand, sizes, onBack, onNext, nextLabel }) => {
  // Fill in any fields missing from older saved state (e.g. after a hot reload) so nothing reads undefined
  const value: BackgroundSetup = { ...everydayDefaults(), ...saved };
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [aiBusy, setAiBusy] = useState(false);
  const [aiBusyType, setAiBusyType] = useState<PromoTypeId | null>(null);
  const [typeResults, setTypeResults] = useState<Partial<Record<PromoTypeId, string>>>({});
  const [showErrors, setShowErrors] = useState(false);
  const [openType, setOpenType] = useState<PromoTypeId | null>(PROMO_TYPES[0].id);
  const [fitType, setFitType] = useState<PromoTypeId | null>(null);
  const copy = COPY[kind];
  const isPromo = kind === 'promo';
  const variants = isPromo ? PROMO_STYLES.length : CORE_TEXTURES.length;
  const { colour1, colour2 } = brandColours(brand, kind);

  // Portrait sizes need a portrait upload; landscape, shelf talker and shelf edge sizes need a landscape one
  const needsPortrait = sizes.length === 0 || sizes.some((id) => id.startsWith('p-'));
  const needsLandscape = sizes.length === 0 || sizes.some((id) => !id.startsWith('p-'));

  const set = (patch: Partial<BackgroundSetup>) => onChange({ ...value, ...patch });

  const pickedTypes = PROMO_TYPES.filter((t) => value.promoTypes.includes(t.id));
  const styleOf = (t: (typeof PROMO_TYPES)[number]) => value.typeStyles[t.id] ?? t.style;

  const items: TicketItem[] = isPromo
    ? pickedTypes.map((t) => ({ key: t.id, label: t.name, header: t.header, style: () => styleOf(t), type: t.id }))
    : [
        {
          key: 'everyday',
          label: EVERYDAY_HEADER,
          header: EVERYDAY_HEADER,
          style: (o) => (o === 'portrait' ? value.portraitIndex : value.landscapeIndex),
        },
      ];

  // Promotional designs always have both shapes; Everyday shows the backgrounds that are ticked
  const shown = (o: Orientation) => isPromo || (o === 'portrait' ? value.portraitChosen : value.landscapeChosen);

  const onFile = (orientation: Orientation, file: File | undefined, type?: PromoTypeId) => {
    if (!file) return;
    if (!/^image\/(jpeg|png)$/.test(file.type)) {
      setUploadError('Upload a JPEG or PNG file.');
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError('Background must be 10MB or smaller.');
      return;
    }
    setUploadError('');
    const url = URL.createObjectURL(file);
    if (type) {
      setTypeUpload(type, orientation, file.name, url);
      return;
    }
    set(orientation === 'portrait' ? { uploadName: file.name, uploadUrl: url } : { landscapeName: file.name, landscapeUrl: url });
  };

  const applySample = (orientation: Orientation, type?: PromoTypeId) => {
    if (type) {
      const art = FOODVILLA_ART.promo(type, orientation);
      setTypeUpload(type, orientation, art.name, art.url);
      return;
    }
    set(
      orientation === 'portrait'
        ? { uploadName: FOODVILLA_ART.paper.name, uploadUrl: FOODVILLA_ART.paper.url }
        : { landscapeName: FOODVILLA_ART.paperLandscape.name, landscapeUrl: FOODVILLA_ART.paperLandscape.url },
    );
  };

  // Promotional uploads: one portrait and one landscape image per promotion type
  const uploadOf = (id: PromoTypeId): PromoUpload => value.typeUploads[id] ?? {};
  const uploadDone = (id: PromoTypeId) => {
    const u = uploadOf(id);
    return (!needsPortrait || !!u.portraitUrl) && (!needsLandscape || !!u.landscapeUrl);
  };
  const uploadedTypes = PROMO_TYPES.filter((t) => uploadDone(t.id));
  const setTypeUpload = (id: PromoTypeId, orientation: Orientation, name: string, url: string) =>
    set({
      typeUploads: {
        ...value.typeUploads,
        [id]: { ...uploadOf(id), ...(orientation === 'portrait' ? { portraitName: name, portraitUrl: url } : { landscapeName: name, landscapeUrl: url }) },
      },
    });

  // Sliding changes the promotion's design; an added promotion stays added, so its tab below keeps showing it
  const moveStyle = (id: PromoTypeId, style: number) => set({ typeStyles: { ...value.typeStyles, [id]: style } });

  // Ticking adds (or removes) the promotion; the accordion stays open until another one is opened
  const tickType = (id: PromoTypeId) =>
    set({ promoTypes: value.promoTypes.includes(id) ? value.promoTypes.filter((x) => x !== id) : [...value.promoTypes, id] });

  // Prototype "AI" for one promotion: reads its prompt for style words, otherwise uses the recommended design
  const buildTypeWithAi = (id: PromoTypeId) => {
    setAiBusyType(id);
    setTimeout(() => {
      const t = PROMO_TYPES.find((x) => x.id === id)!;
      const prompt = (value.typePrompts[id] ?? '').toLowerCase();
      const styleIndex = STYLE_KEYWORDS.promo.findIndex((words) => words.some((w) => prompt.includes(w)));
      const style = styleIndex >= 0 ? styleIndex : t.style;
      onChange({
        ...value,
        typeStyles: { ...value.typeStyles, [id]: style },
        promoTypes: value.promoTypes.includes(id) ? value.promoTypes : [...value.promoTypes, id],
        aiTypes: value.aiTypes.includes(id) ? value.aiTypes : [...value.aiTypes, id],
      });
      setTypeResults((r) => ({
        ...r,
        [id]: `AI ${styleIndex >= 0 ? 'used' : 'picked'} the ${STYLE_NAMES.promo[style]} design for your ${t.name} ticket.`,
      }));
      setFitType(id);
      setAiBusyType(null);
    }, AI_MS);
  };

  // Prototype "AI": reads the prompt for style words (and promotion types), otherwise uses the store category
  const buildWithAi = () => {
    setAiBusy(true);
    setAiResult('');
    setTimeout(() => {
      const prompt = value.aiPrompt.toLowerCase();
      const styleIndex = STYLE_KEYWORDS[kind].findIndex((words) => words.some((w) => prompt.includes(w)));
      if (isPromo) {
        const named = PROMO_TYPES.filter((t) => TYPE_KEYWORDS[t.id].some((w) => prompt.includes(w))).map((t) => t.id);
        const promoTypes = named.length ? named : value.promoTypes.length ? value.promoTypes : (['special'] as PromoTypeId[]);
        const typeStyles = styleIndex >= 0 ? Object.fromEntries(promoTypes.map((id) => [id, styleIndex])) : {};
        set({ promoTypes, typeStyles, aiDone: true });
        const names = PROMO_TYPES.filter((t) => promoTypes.includes(t.id)).map((t) => t.name);
        setAiResult(
          `AI ${styleIndex >= 0 ? `used the ${STYLE_NAMES.promo[styleIndex]} style` : 'picked the recommended design for each promotion'} and made ${
            names.length > 1 ? `a ticket for each of your ${names.length} promotions` : `your ${names[0]} ticket`
          }.`,
        );
      } else {
        const seed = RETAIL_CATEGORIES.indexOf(brand.category) + 1 + colour1.length;
        const portraitIndex = styleIndex >= 0 ? styleIndex : seed % variants;
        const landscapeIndex = styleIndex >= 0 ? styleIndex : (seed + 2) % variants;
        set({ portraitIndex, portraitChosen: true, landscapeIndex, landscapeChosen: true, aiDone: true });
        setAiResult(
          `AI picked the ${STYLE_NAMES.everyday[portraitIndex]} background${
            portraitIndex !== landscapeIndex ? ` (portrait) and ${STYLE_NAMES.everyday[landscapeIndex]} (landscape)` : ''
          } for your Everyday tickets.`,
        );
      }
      setAiBusy(false);
    }, AI_MS);
  };

  const uploadReady = isPromo
    ? uploadedTypes.length > 0
    : (!needsPortrait || !!value.uploadUrl) && (!needsLandscape || !!value.landscapeUrl);
  const designReady = isPromo ? pickedTypes.length > 0 : value.portraitChosen && value.landscapeChosen;
  const aiTypesBuilt = PROMO_TYPES.filter((t) => value.aiTypes.includes(t.id) && value.promoTypes.includes(t.id));
  const aiReady = isPromo ? aiTypesBuilt.length > 0 : value.aiDone && designReady;
  const ready = value.mode === 'upload' ? uploadReady : value.mode === 'ai' ? aiReady : designReady;

  const errorText =
    value.mode === 'upload' && isPromo
      ? `Upload the ${needsPortrait && needsLandscape ? 'portrait and landscape backgrounds' : needsPortrait ? 'portrait background' : 'landscape background'} for at least one promotion.`
      : value.mode === 'upload'
      ? `Upload your ${[needsPortrait && !value.uploadUrl && 'portrait', needsLandscape && !value.landscapeUrl && 'landscape'].filter(Boolean).join(' and ')} background.`
      : isPromo && value.mode === 'ai' && aiTypesBuilt.length === 0
        ? 'Build a ticket with AI for at least one promotion.'
      : isPromo && pickedTypes.length === 0
        ? 'Tick a design for at least one promotion.'
        : value.mode === 'ai'
          ? 'Describe the look you want and click Build with AI.'
          : 'Tick a portrait and a landscape background.';

  const handleNext = () => {
    if (!ready) {
      setShowErrors(true);
      return;
    }
    onNext();
  };

  const renderTicket = (item: TicketItem, orientation: Orientation, style = item.style(orientation), fill = false) => (
    <TicketBackground
      kind={kind}
      variant={style}
      orientation={orientation}
      header={item.header}
      colour1={colour1}
      colour2={colour2}
      logoUrl={brand.logoUrl}
      fill={fill}
    >
    </TicketBackground>
  );

  const variantIndexes = Array.from({ length: variants }, (_, i) => i);

  const tabs: { id: BackgroundMode; title: string; text: string }[] = [
    { id: 'select', title: 'Select a design', text: 'Pick from our ready-made backgrounds' },
    { id: 'ai', title: 'Build with AI', text: 'Describe the look you want' },
    { id: 'upload', title: 'Upload your own', text: 'Use backgrounds you already have' },
  ];

  // Promotional: one promotion open at a time; slide to a design and tick it to add that promotion
  const promoAccordion = (
    <section className={card.section}>
      <h3 className={card.sectionTitle}>Select your Promotional designs</h3>
      <p className={card.sectionIntro}>
        Open a promotion, slide to the design you like and tick it to add it. Your logo and colours come from the Your brand step.
      </p>
      <div className={styles.accordion}>
        {PROMO_TYPES.map((t) => {
          const open = openType === t.id;
          const added = value.promoTypes.includes(t.id);
          const style = styleOf(t);
          const item: TicketItem = { key: t.id, label: t.name, header: t.header, style: () => style, type: t.id };
          return (
            <div key={t.id} className={`${styles.accItem} ${open ? styles.accOpen : ''}`}>
              <button type="button" className={styles.accHead} aria-expanded={open} onClick={() => setOpenType(open ? null : t.id)}>
                <strong className={styles.accTitle}>{t.name}</strong>
                <span className={styles.accText}>{t.description}</span>
                <span className={`${styles.accStatus} ${added ? styles.accAdded : ''}`}>
                  {added ? `Added · ${STYLE_NAMES.promo[style]} design` : 'Not added'}
                </span>
                <span className={styles.chevron} aria-hidden="true" />
              </button>
              {open && (
                <div className={styles.accBody}>
                  <Carousel
                    items={variantIndexes}
                    index={style}
                    onIndexChange={(i) => moveStyle(t.id, i)}
                    selected={added}
                    onSelect={() => tickType(t.id)}
                    renderItem={(v) => renderTicket(item, 'portrait', v)}
                    label={`${t.name} design`}
                    height={260}
                  />
                  <p className={styles.accCaption}>
                    <strong>{STYLE_NAMES.promo[style]}</strong>
                    {style === t.style && ' · Recommended'}. {added ? `${t.name} is added.` : `Tick the circle to add ${t.name}.`}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );

  const sizeList = sizes.map((id) => findSize(id)).filter((sz): sz is NonNullable<typeof sz> => !!sz);

  // Every picked ticket size, filled by `render` (or shown as a dashed box when it returns null)
  const fitsSection = (render: (orientation: Orientation) => React.ReactNode, intro?: string, tabsRow?: React.ReactNode) =>
    sizeList.length === 0 ? null : (
      <section className={card.section}>
        <h3 className={card.sectionTitle}>How it fits your ticket sizes</h3>
        {intro && <p className={card.sectionIntro}>{intro}</p>}
        {tabsRow}
        <div className={styles.fits}>
          {sizeList.map((size) => {
            const orientation = size.id.startsWith('p-') ? 'portrait' : 'landscape';
            const content = render(orientation);
            return (
              <figure key={size.id} className={styles.fit}>
                <div className={styles.fitBox}>
                  <div
                    className={`${styles.fitTicket} ${content ? '' : styles.fitEmpty}`}
                    style={{
                      aspectRatio: `${size.cellW} / ${size.cellH}`,
                      width: size.cellW >= size.cellH ? '100%' : 'auto',
                      height: size.cellW >= size.cellH ? 'auto' : '100%',
                    }}
                  >
                    {content}
                  </div>
                </div>
                <figcaption>
                  <strong>{[size.name, size.up].filter(Boolean).join(' ')}</strong>
                  <small>
                    {orientation === 'portrait' ? 'Portrait' : 'Landscape'} · {size.dims} mm
                  </small>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </section>
    );

  // Designed tickets (Select and AI tabs); promotions show the first type picked
  const activeItem = items.find((i) => i.key === fitType) ?? items[0];
  const designFit = (orientation: Orientation) => (activeItem && shown(orientation) ? renderTicket(activeItem, orientation, undefined, true) : null);

  // Promotional: one tab per added promotion; the active one is drawn on every size
  const promoTabs =
    isPromo && items.length > 0 ? (
      <div className={styles.fitTabs} role="tablist">
        {items.map((i) => (
          <button
            type="button"
            role="tab"
            key={i.key}
            aria-selected={activeItem?.key === i.key}
            className={`${styles.fitTab} ${activeItem?.key === i.key ? styles.fitTabOn : ''}`}
            onClick={() => setFitType(i.type ?? null)}
          >
            {i.label}
          </button>
        ))}
      </div>
    ) : undefined;

  // Promotional Build with AI tab: tabs for the promotions AI has built
  const activeAi = aiTypesBuilt.find((t) => t.id === fitType) ?? aiTypesBuilt[0];
  const aiTabs =
    isPromo && aiTypesBuilt.length > 0 ? (
      <div className={styles.fitTabs} role="tablist">
        {aiTypesBuilt.map((t) => (
          <button
            type="button"
            role="tab"
            key={t.id}
            aria-selected={activeAi?.id === t.id}
            className={`${styles.fitTab} ${activeAi?.id === t.id ? styles.fitTabOn : ''}`}
            onClick={() => setFitType(t.id)}
          >
            {t.name}
          </button>
        ))}
      </div>
    ) : undefined;
  const promoAiFit = (orientation: Orientation) => {
    const item = activeAi && items.find((i) => i.key === activeAi.id);
    return item ? renderTicket(item, orientation, undefined, true) : null;
  };

  // Built when rendered so it can use the helpers declared below
  const promoAiAccordion = () => (
    <section className={card.section}>
      <h3 className={card.sectionTitle}>Build your Promotional designs with AI</h3>
      <p className={card.sectionIntro}>Open a promotion, describe the look you want and click Build with AI. Only that promotion&apos;s ticket is built.</p>
      <div className={styles.accordion}>
        {PROMO_TYPES.map((t) => {
          const open = openType === t.id;
          const built = value.aiTypes.includes(t.id) && value.promoTypes.includes(t.id);
          const busy = aiBusyType === t.id;
          return (
            <div key={t.id} className={`${styles.accItem} ${open ? styles.accOpen : ''}`}>
              <button type="button" className={styles.accHead} aria-expanded={open} onClick={() => setOpenType(open ? null : t.id)}>
                <strong className={styles.accTitle}>{t.name}</strong>
                <span className={styles.accText}>{t.description}</span>
                <span className={`${styles.accStatus} ${built ? styles.accAdded : ''}`}>
                  {busy ? 'Building...' : built ? `Added · ${STYLE_NAMES.promo[styleOf(t)]} design` : 'Not added'}
                </span>
                <span className={styles.chevron} aria-hidden="true" />
              </button>
              {open && (
                <div className={styles.accBody}>
                  <div className={`${styles.ai} ${styles.aiStack}`}>
                    <div className={styles.aiText}>
                      <strong>Let AI build your {t.name} ticket</strong>
                      <small>Describe the look you want for {t.name}.</small>
                      <textarea
                        className={`${form.input} ${styles.prompt}`}
                        rows={3}
                        placeholder={`e.g. bold gold look for ${t.name.toLowerCase()}`}
                        value={value.typePrompts[t.id] ?? ''}
                        onChange={(e) => set({ typePrompts: { ...value.typePrompts, [t.id]: e.target.value } })}
                        aria-label={`Describe the look you want for ${t.name}`}
                      />
                    </div>
                    <button
                      type="button"
                      className={`${form.button} ${form.buttonSecondary} ${styles.aiButton}`}
                      onClick={() => buildTypeWithAi(t.id)}
                      disabled={!!aiBusyType}
                    >
                      <span className={form.buttonIcon}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2zm7 11l.9 2.6 2.6.9-2.6.9L19 20l-.9-2.6-2.6-.9 2.6-.9L19 13z" />
                        </svg>
                      </span>
                      <span className={form.buttonText}>{busy ? 'Building...' : built ? 'Build again' : 'Build with AI'}</span>
                    </button>
                  </div>
                  {busy ? (
                    <p className={styles.aiResult} role="status">
                      <span className={styles.spinner} /> Building your {t.name} ticket...
                    </p>
                  ) : (
                    built && typeResults[t.id] && <p className={styles.aiResult}>{typeResults[t.id]}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );

  // AI tab: sizes stay empty until Build with AI has run
  const aiFit = (orientation: Orientation) => (value.aiDone ? designFit(orientation) : null);

  // Uploaded artwork (Upload tab)
  const uploadFit = (orientation: Orientation) => {
    const url = orientation === 'portrait' ? value.uploadUrl : value.landscapeUrl;
    return url ? <div className={styles.fitImage} style={{ backgroundImage: `url("${url}")` }} /> : null;
  };

  // Promotional Upload tab: tabs for promotions with their artwork uploaded
  const activeUpload = uploadedTypes.find((t) => t.id === fitType) ?? uploadedTypes[0];
  const uploadTabs =
    isPromo && uploadedTypes.length > 0 ? (
      <div className={styles.fitTabs} role="tablist">
        {uploadedTypes.map((t) => (
          <button
            type="button"
            role="tab"
            key={t.id}
            aria-selected={activeUpload?.id === t.id}
            className={`${styles.fitTab} ${activeUpload?.id === t.id ? styles.fitTabOn : ''}`}
            onClick={() => setFitType(t.id)}
          >
            {t.name}
          </button>
        ))}
      </div>
    ) : undefined;
  const promoUploadFit = (orientation: Orientation) => {
    const u = activeUpload ? uploadOf(activeUpload.id) : {};
    const url = orientation === 'portrait' ? u.portraitUrl : u.landscapeUrl;
    return url ? <div className={styles.fitImage} style={{ backgroundImage: `url("${url}")` }} /> : null;
  };

  const sizesNeed = needsPortrait && needsLandscape ? 'a portrait and a landscape background' : needsPortrait ? 'a portrait background' : 'a landscape background';

  // Built when rendered: it uses uploadBox, which is declared further down
  const promoUploadAccordion = () => (
    <section className={card.section}>
      <h3 className={card.sectionTitle}>Upload your Promotional backgrounds</h3>
      <p className={card.sectionIntro}>Open a promotion and upload its artwork. Your ticket sizes need {sizesNeed} for each one.</p>
      <div className={styles.accordion}>
        {PROMO_TYPES.map((t) => {
          const open = openType === t.id;
          const u = uploadOf(t.id);
          const done = uploadDone(t.id);
          const started = !!(u.portraitUrl || u.landscapeUrl);
          return (
            <div key={t.id} className={`${styles.accItem} ${open ? styles.accOpen : ''}`}>
              <button type="button" className={styles.accHead} aria-expanded={open} onClick={() => setOpenType(open ? null : t.id)}>
                <strong className={styles.accTitle}>{t.name}</strong>
                <span className={styles.accText}>{t.description}</span>
                <span className={`${styles.accStatus} ${done ? styles.accAdded : ''}`}>{done ? 'Added · uploaded' : started ? 'Upload incomplete' : 'Not added'}</span>
                <span className={styles.chevron} aria-hidden="true" />
              </button>
              {open && (
                <div className={styles.accBody}>
                  <div className={needsPortrait && needsLandscape ? styles.uploads : ''}>
                    {needsPortrait && uploadBox('portrait', t.id)}
                    {needsLandscape && uploadBox('landscape', t.id)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {uploadError && <p className={form.error}>{uploadError}</p>}
    </section>
  );

  const fitsNote = isPromo ? 'Click a promotion to see its design on each of your ticket sizes.' : undefined;

  const uploadBox = (orientation: Orientation, type?: PromoTypeId) => {
    const u = type ? uploadOf(type) : null;
    const name = u ? (orientation === 'portrait' ? u.portraitName : u.landscapeName) : orientation === 'portrait' ? value.uploadName : value.landscapeName;
    const url = u ? (orientation === 'portrait' ? u.portraitUrl : u.landscapeUrl) : orientation === 'portrait' ? value.uploadUrl : value.landscapeUrl;
    const dropKey = `${type ?? 'base'}-${orientation}`;
    return (
      <div className={styles.uploadBox}>
        <span className={form.label}>{orientation === 'portrait' ? 'Portrait background' : 'Landscape background'}</span>
        <label
          className={`${styles.dropzone} ${dragOver === dropKey ? styles.dragOver : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(dropKey);
          }}
          onDragLeave={() => setDragOver(null)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(null);
            onFile(orientation, e.dataTransfer.files[0], type);
          }}
        >
          <input type="file" accept="image/jpeg,image/png" onChange={(e) => onFile(orientation, e.target.files?.[0], type)} hidden />
          {url ? (
            <span className={styles.uploaded}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" />
              <span>
                <strong>{name}</strong>
                <small>Click to replace.</small>
              </span>
            </span>
          ) : (
            <span>
              <strong>Drop a {orientation} JPEG or PNG here</strong>
              <small>or click to browse</small>
            </span>
          )}
        </label>
        {!url && (
          <button type="button" className={`${form.link} ${styles.sample}`} onClick={() => applySample(orientation, type)}>
            Use Foodvilla sample artwork
          </button>
        )}
      </div>
    );
  };

  const aiBox = (
    <section className={card.section}>
      <div className={`${styles.ai} ${styles.aiStack}`}>
        <div className={styles.aiText}>
          <strong>{copy.ai}</strong>
          <small>
            {isPromo
              ? 'Describe the look you want and name the promotions you run, such as sale and clear out. We will design a ticket for each one.'
              : 'Describe the look you want. We will pick backgrounds to match.'}
          </small>
          <textarea
            className={`${form.input} ${styles.prompt}`}
            rows={4}
            placeholder={copy.prompt}
            value={value.aiPrompt}
            onChange={(e) => set({ aiPrompt: e.target.value })}
            aria-label="Describe the look you want"
          />
        </div>
        <button type="button" className={`${form.button} ${form.buttonSecondary} ${styles.aiButton}`} onClick={buildWithAi} disabled={aiBusy}>
          <span className={form.buttonIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2zm7 11l.9 2.6 2.6.9-2.6.9L19 20l-.9-2.6-2.6-.9 2.6-.9L19 13z" />
            </svg>
          </span>
          <span className={form.buttonText}>{aiBusy ? 'Building...' : 'Build with AI'}</span>
        </button>
      </div>
    </section>
  );

  return (
    <div className={card.card}>
      <div className={card.titleBar}>
        <h2 className={card.headline}>{copy.title}</h2>
        <p className={card.subline}>Pick a ready-made design, build one with AI, or upload your own artwork</p>
      </div>

      <section className={card.section}>
        <div className={styles.tabs} role="tablist">
          {tabs.map((t) => (
            <button
              type="button"
              role="tab"
              key={t.id}
              aria-selected={value.mode === t.id}
              className={`${styles.tab} ${value.mode === t.id ? styles.tabOn : ''}`}
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

      {value.mode === 'select' && !isPromo && (
        <>
          <section className={card.section}>
            <h3 className={card.sectionTitle}>{copy.portrait}</h3>
            <p className={card.sectionIntro}>Your logo and colours come from the Your brand step.</p>
            <Carousel
              items={variantIndexes}
              index={value.portraitIndex}
              onIndexChange={(portraitIndex) => set({ portraitIndex, portraitChosen: false })}
              selected={value.portraitChosen}
              onSelect={() => set({ portraitChosen: !value.portraitChosen })}
              renderItem={(v) => renderTicket(items[0], 'portrait', v)}
              label="portrait background"
              height={260}
            />
          </section>

          <section className={card.section}>
            <h3 className={card.sectionTitle}>{copy.landscape}</h3>
            <Carousel
              items={variantIndexes}
              index={value.landscapeIndex}
              onIndexChange={(landscapeIndex) => set({ landscapeIndex, landscapeChosen: false })}
              selected={value.landscapeChosen}
              onSelect={() => set({ landscapeChosen: !value.landscapeChosen })}
              renderItem={(v) => renderTicket(items[0], 'landscape', v)}
              label="landscape background"
              height={190}
            />
          </section>

          {fitsSection(
            designFit,
            !value.portraitChosen && !value.landscapeChosen ? 'Tick a background to see how it fits each of your ticket sizes.' : undefined,
          )}
        </>
      )}

      {value.mode === 'select' && isPromo && (
        <>
          {promoAccordion}

          {fitsSection(designFit, items.length === 0 ? 'Tick a design for a promotion to see how it fits each of your ticket sizes.' : fitsNote, promoTabs)}
        </>
      )}

      {value.mode === 'ai' && isPromo && (
        <>
          {promoAiAccordion()}

          {fitsSection(
            promoAiFit,
            aiTypesBuilt.length === 0 ? 'Build a promotion with AI to see how it fits each of your ticket sizes.' : fitsNote,
            aiTabs,
          )}
        </>
      )}

      {value.mode === 'ai' && !isPromo && (
        <>
          {aiBox}

          {aiBusy && (
            <p className={`${styles.ticketsEmpty} ${card.section}`} role="status">
              <span className={styles.spinner} /> {isPromo ? 'Building your tickets...' : 'Building your design...'}
            </p>
          )}
          {!aiBusy && value.aiDone && aiResult && <p className={styles.aiResult}>{aiResult}</p>}

          {fitsSection(
            aiFit,
            !value.aiDone
              ? 'Build with AI to see how it fits each of your ticket sizes.'
              : items.length === 0
                ? 'Tick a design for a promotion to see how it fits each of your ticket sizes.'
                : fitsNote,
            value.aiDone ? promoTabs : undefined,
          )}
        </>
      )}

      {value.mode === 'upload' && isPromo && (
        <>
          {promoUploadAccordion()}

          {fitsSection(
            promoUploadFit,
            uploadedTypes.length === 0 ? 'Upload the artwork for a promotion to see how it fits each of your ticket sizes.' : fitsNote,
            uploadTabs,
          )}
        </>
      )}

      {value.mode === 'upload' && !isPromo && (
        <>
          <section className={card.section}>
            <h3 className={card.sectionTitle}>Upload your Everyday backgrounds</h3>
            <p className={card.sectionIntro}>
              {copy.upload}{' '}
              {needsPortrait && needsLandscape
                ? 'Your ticket sizes need a portrait and a landscape background.'
                : needsPortrait
                  ? 'Your ticket sizes need a portrait background.'
                  : 'Your ticket sizes need a landscape background.'}
            </p>
            <div className={needsPortrait && needsLandscape ? styles.uploads : ''}>
              {needsPortrait && uploadBox('portrait')}
              {needsLandscape && uploadBox('landscape')}
            </div>
            {uploadError && <p className={form.error}>{uploadError}</p>}
          </section>

          {fitsSection(uploadFit, !value.uploadUrl && !value.landscapeUrl ? 'Upload a background to see how it fits each of your ticket sizes.' : undefined)}
        </>
      )}

      <StepFooter onBack={onBack} nextLabel={nextLabel} onNext={handleNext} error={showErrors && !ready ? errorText : ''} />
    </div>
  );
};

export default BackgroundStep;
