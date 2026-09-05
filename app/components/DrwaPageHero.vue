<template>
  <section class="phero">
    <div class="phero__bg"><slot name="bg" /></div>
    <div class="phero__scrim" />
    <div class="phero__inner">
      <div v-if="$slots.crumb" class="phero__crumb"><slot name="crumb" /></div>
      <span v-if="$slots.eyebrow" class="eyebrow eyebrow--ondark"><slot name="eyebrow" /></span>
      <h1><slot name="title" /></h1>
      <span class="phero__rule" aria-hidden="true" />
      <p v-if="$slots.lead" class="phero__lead"><slot name="lead" /></p>
      <div v-if="$slots.meta" class="phero__meta"><slot name="meta" /></div>
      <div v-if="$slots.cta" class="phero__cta"><slot name="cta" /></div>
    </div>
  </section>
</template>

<style scoped>
/* Wspólny hero każdej podstrony: ciemny blok po lewej, zdjęcie odsłonięte
   i nasycone po prawej (bez przyciemnienia), płynne przejście między nimi. */
.phero {
  --ink-rgb: 8, 11, 10;
  position: relative;
  overflow: hidden;
  background: rgb(var(--ink-rgb));
}
.phero__bg {
  position: absolute;
  inset: 0;
}
.phero__bg :deep(picture) {
  display: contents;
}
.phero__bg :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 40%;
  filter: saturate(1.06) contrast(1.04);
  display: block;
}
.phero__scrim {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg,
      rgba(var(--ink-rgb), 0.97) 0%,
      rgba(var(--ink-rgb), 0.95) 24%,
      rgba(var(--ink-rgb), 0.78) 40%,
      rgba(var(--ink-rgb), 0.34) 55%,
      rgba(var(--ink-rgb), 0.06) 68%,
      rgba(var(--ink-rgb), 0) 78%),
    linear-gradient(180deg, rgba(var(--ink-rgb), 0.16) 0%, rgba(var(--ink-rgb), 0) 36%, rgba(var(--ink-rgb), 0.24) 100%);
}
.phero__inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  min-height: clamp(400px, 34vw, 540px);
  max-width: var(--container-max);
  margin: 0 auto;
  padding: var(--space-8) var(--space-6);
  color: var(--cream-50);
}
.phero__crumb {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--pine-200);
  margin-bottom: var(--space-4);
}
.phero__crumb :deep(a) {
  color: var(--pine-200);
  text-decoration: none;
  transition: color var(--dur-fast) var(--ease-standard);
}
.phero__crumb :deep(a:hover) {
  color: var(--cream-50);
}
.phero__crumb :deep(.sep) {
  color: var(--timber-300);
}
.phero__crumb :deep(.cur) {
  color: var(--cream-100);
}
.phero__inner > .eyebrow {
  font-size: clamp(12px, 1vw, 15px);
  letter-spacing: 0.24em;
}
.phero__inner h1 {
  font-family: var(--font-display);
  font-weight: 500;
  letter-spacing: -0.02em;
  font-size: clamp(40px, 6.2vw, 96px);
  line-height: 1.0;
  margin: clamp(10px, 1.4vw, 20px) 0 0;
  color: var(--cream-50);
  text-wrap: balance;
}
.phero__rule {
  display: block;
  width: 36px;
  height: 2px;
  background: var(--timber-400);
  margin: clamp(16px, 1.7vw, 26px) 0 0;
}
.phero__lead {
  font-size: clamp(17px, 1.45vw, 22px);
  line-height: 1.7;
  color: var(--cream-100);
  max-width: 25.5em;
  margin: clamp(16px, 1.8vw, 26px) 0 0;
}
.phero__meta {
  display: flex;
  gap: var(--space-5);
  flex-wrap: wrap;
  margin-top: var(--space-6);
}
.phero__meta :deep(.phero__fact) {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: var(--text-2xs);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--cream-100);
}
.phero__meta :deep(.phero__fact svg) {
  color: var(--timber-300);
  flex: none;
}
.phero__cta {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
  margin-top: var(--space-7);
}
@media (prefers-reduced-motion: no-preference) {
  .phero__inner > * {
    animation: drwa-rise var(--dur-slower) var(--ease-out) both;
  }
  .phero__inner > *:nth-child(2) { animation-delay: 90ms; }
  .phero__inner > *:nth-child(3) { animation-delay: 180ms; }
  .phero__inner > *:nth-child(4) { animation-delay: 270ms; }
  .phero__inner > *:nth-child(5) { animation-delay: 360ms; }
  .phero__inner > *:nth-child(6) { animation-delay: 450ms; }
}
@media (max-width: 860px) {
  .phero__scrim {
    background:
      linear-gradient(180deg, rgba(var(--ink-rgb), 0.72) 0%, rgba(var(--ink-rgb), 0.80) 55%, rgba(var(--ink-rgb), 0.92) 100%),
      rgba(var(--ink-rgb), 0.30);
  }
  .phero__bg :deep(img) {
    object-position: 50% 30%;
  }
  .phero__inner {
    min-height: 0;
    padding: var(--space-9) var(--space-5);
  }
  .phero__lead {
    max-width: 40ch;
  }
}
</style>
