"use client";

import React, { useState } from 'react';
import styles from './UserDetailsForm.module.css';
import form from '../ui/Form.module.css';
import card from './StepCard.module.css';
import StepFooter from './ui/StepFooter';
import { COUNTRIES, REGIONS, UserDetails } from './steps';

type Errors = Partial<Record<keyof UserDetails, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s]{7,15}$/;

const validate = (v: UserDetails): Errors => {
  const errors: Errors = {};
  if (!v.userName.trim()) errors.userName = 'User name is required.';
  if (!v.login.trim()) errors.login = 'Login is required.';
  if (!v.password) errors.password = 'Password is required.';
  else if (v.password.length < 8) errors.password = 'Password must be at least 8 characters.';
  if (!v.email.trim()) errors.email = 'Email is required.';
  else if (!EMAIL_RE.test(v.email)) errors.email = 'Enter a valid email address.';
  if (v.landline && !PHONE_RE.test(v.landline)) errors.landline = 'Format is incorrect. 99 999 999';
  if (v.mobile && !PHONE_RE.test(v.mobile)) errors.mobile = 'Format is incorrect. 021 444 5599';
  if (v.postcode && !/^\d{3,10}$/.test(v.postcode)) errors.postcode = 'Numbers only.';
  return errors;
};

const generatePassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

interface UserDetailsFormProps {
  values: UserDetails;
  onChange: (values: UserDetails) => void;
  onCancel: () => void;
  onNext: () => void;
}

const UserDetailsForm: React.FC<UserDetailsFormProps> = ({ values, onChange, onCancel, onNext }) => {
  const [touched, setTouched] = useState<Partial<Record<keyof UserDetails, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const errors = validate(values);

  const set = (key: keyof UserDetails, value: string) => onChange({ ...values, [key]: value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const firstInvalid = (Object.keys(values) as (keyof UserDetails)[]).find((k) => errors[k]);
    if (firstInvalid) {
      setTouched(Object.fromEntries(Object.keys(values).map((k) => [k, true])));
      document.getElementById(firstInvalid)?.focus();
      return;
    }
    onNext();
  };

  const field = (
    key: keyof UserDetails,
    label: string,
    opts: { type?: string; placeholder?: string; className?: string; required?: boolean; action?: React.ReactNode } = {},
  ) => {
    const error = touched[key] ? errors[key] : undefined;
    return (
      <div className={`${form.field} ${opts.className ?? ''}`}>
        <div className={styles.labelRow}>
          <label htmlFor={key} className={form.label}>
            {label}
            {opts.required && <span className={form.required}>*</span>}
          </label>
          {opts.action}
        </div>
        <input
          id={key}
          type={opts.type ?? 'text'}
          placeholder={opts.placeholder ?? `Enter ${label.toLowerCase()}`}
          className={`${form.input} ${error ? form.inputError : ''}`}
          value={values[key]}
          onChange={(e) => set(key, e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, [key]: true }))}
        />
        {error && <p className={form.error}>{error}</p>}
      </div>
    );
  };

  const select = (key: keyof UserDetails, label: string, options: string[]) => (
    <div className={form.field}>
      <label htmlFor={key} className={form.label}>{label}</label>
      <select id={key} className={form.input} value={values[key]} onChange={(e) => set(key, e.target.value)}>
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );

  return (
    <form className={card.card} onSubmit={handleSubmit} noValidate>
      <div className={card.titleBar}>
        <h2 className={card.headline}>User Details</h2>
        <p className={card.subline}>Tell us about yourself to get started</p>
      </div>

      <h3 className={card.sectionTitle}>Personal Information</h3>
      <div className={styles.grid}>
        {field('userName', 'User Name', { required: true })}
        {field('login', 'Login', { required: true })}
        {field('password', 'Password', {
          type: 'text',
          required: true,
          action: (
            <button type="button" className={`${form.link} ${styles.generate}`} onClick={() => set('password', generatePassword())}>
              Generate
            </button>
          ),
        })}

        {field('email', 'Email', { type: 'email', required: true })}
        {field('landline', 'Landline', { type: 'tel', placeholder: '99 999 999' })}
        {field('mobile', 'Mobile', { type: 'tel', placeholder: '021 444 5599' })}

        {field('division', 'Division')}
      </div>

      <h3 className={card.sectionTitle}>Address</h3>
      <div className={styles.grid}>
        {field('address1', 'Address Line 1')}
        {field('address2', 'Address Line 2')}
        {select('country', 'Country', COUNTRIES)}

        {field('state', 'State')}
        {select('region', 'Region', REGIONS)}
        {field('postcode', 'Postcode')}
      </div>

      <div className={`${form.field} ${styles.notes}`}>
        <label htmlFor="notes" className={form.label}>Notes</label>
        <textarea
          id="notes"
          rows={3}
          placeholder="Anything else we should know"
          className={form.input}
          value={values.notes}
          onChange={(e) => set('notes', e.target.value)}
        />
      </div>

      <StepFooter
        backLabel="Cancel"
        onBack={onCancel}
        nextLabel="Select your Standard ticket sizes"
        error={submitted && Object.keys(errors).length > 0 ? 'Please fix the highlighted fields above.' : ''}
      />
    </form>
  );
};

export default UserDetailsForm;
