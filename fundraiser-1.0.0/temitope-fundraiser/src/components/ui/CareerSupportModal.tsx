'use client';

import { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import type { SubmissionType } from '@/types';
import { cn } from '@/lib/utils';

const TYPE_CONFIG: Record<SubmissionType, { label: string; placeholder: string }> = {
  internship: {
    label: 'Internship Opportunity',
    placeholder: 'Please share details about the opportunity — company, role, how to apply, or any referral information.',
  },
  learning_resource: {
    label: 'Learning Resource',
    placeholder: 'Share a course, book, YouTube channel, blog, or any resource that could help with Python, data engineering, or software development.',
  },
  certification: {
    label: 'Certification Recommendation',
    placeholder: 'Which certification do you recommend, and why? Any tips for preparation?',
  },
  mentorship: {
    label: 'Mentorship Offer',
    placeholder: 'Share a bit about your background and how you\'d like to help — code reviews, career advice, industry insights, etc.',
  },
  project_idea: {
    label: 'Project Idea',
    placeholder: 'Describe your project idea — what problem it solves, what technologies might be involved, and any resources or collaborators.',
  },
  networking: {
    label: 'Connect With Me',
    placeholder: 'Introduce yourself and share how you\'d like to connect.',
  },
};

interface CareerSupportModalProps {
  type: SubmissionType;
  onClose: () => void;
}

export function CareerSupportModal({ type, onClose }: CareerSupportModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const config = TYPE_CONFIG[type];

  async function handleSubmit() {
    if (!name.trim() || !message.trim()) {
      setError('Name and message are required.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/career-support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submission_type: type,
          name: name.trim(),
          email: email.trim() || undefined,
          linkedin_url: linkedin.trim() || undefined,
          message: message.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) setDone(true);
      else setError(data.error || 'Submission failed. Please try again.');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-rule">
          <h3 className="font-bold text-ink">{config.label}</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-ink rounded-lg p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {done ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
            <h4 className="font-bold text-ink mb-2">Received! Thank you.</h4>
            <p className="text-sm text-stone-500 mb-5">
              Your submission means a lot to me. I&apos;ll review it and get back to you if you provided contact details.
            </p>
            <button className="btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-600 mb-1.5 block">
                  Your name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Full name or alias"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-600 mb-1.5 block">
                  Email address
                </label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="Optional"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 mb-1.5 block">
                LinkedIn URL
              </label>
              <input
                type="url"
                className="input-field"
                placeholder="https://linkedin.com/in/yourprofile"
                value={linkedin}
                onChange={e => setLinkedin(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-600 mb-1.5 block">
                Message <span className="text-red-400">*</span>
              </label>
              <textarea
                className="textarea-field min-h-[120px]"
                placeholder={config.placeholder}
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 text-xs">{error}</p>}

            <button
              className="btn-primary w-full"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
