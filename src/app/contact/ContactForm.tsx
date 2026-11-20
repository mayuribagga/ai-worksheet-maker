"use client";

import { useActionState, useState } from "react";
import { CheckIcon } from "@/components/Icons";
import { SubmitButton } from "@/components/SubmitButton";
import { sendMessage, type ContactState } from "./actions";

const initialState: ContactState = {};
const MESSAGE_MAX = 5000;

export function ContactForm() {
  // Changing the key starts a fresh form after a message is sent.
  const [formKey, setFormKey] = useState(0);
  return <MessageForm key={formKey} onSendAnother={() => setFormKey((k) => k + 1)} />;
}

function MessageForm({ onSendAnother }: { onSendAnother: () => void }) {
  const [state, formAction] = useActionState(sendMessage, initialState);
  const [length, setLength] = useState(state.values?.message.length ?? 0);

  if (state.sent) {
    return (
      <div role="status" className="animate-sheet-in flex flex-col items-center gap-4 py-8 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-violet text-white shadow-[0_4px_0_0_var(--color-ink)]">
          <CheckIcon className="h-7 w-7" />
        </span>
        <div className="flex flex-col gap-1">
          <p className="font-display text-xl font-bold text-ink">Message sent</p>
          <p className="text-muted">Thanks for getting in touch. I&apos;ll reply by email.</p>
        </div>
        <button type="button" onClick={onSendAnother} className="btn-secondary">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.error && (
        <p className="alert alert-error" role="alert">
          {state.error}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm text-ink">
          Name
          <input
            name="name"
            autoComplete="name"
            required
            maxLength={100}
            defaultValue={state.values?.name}
            className="input"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-ink">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={200}
            defaultValue={state.values?.email}
            className="input"
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5 text-sm text-ink">
        Message
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={MESSAGE_MAX}
          rows={7}
          defaultValue={state.values?.message}
          onChange={(e) => setLength(e.target.value.length)}
          aria-describedby="message-count"
          className="input resize-y"
        />
        <span id="message-count" className="self-end text-xs text-muted">
          {length.toLocaleString("en-CA")} / {MESSAGE_MAX.toLocaleString("en-CA")}
        </span>
      </label>

      {/* Spam trap: hidden from people, but bots fill it in. */}
      <div aria-hidden className="absolute -left-[9999px]">
        <label>
          Leave this empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <SubmitButton label="Send message" pendingLabel="Sending…" />
    </form>
  );
}
