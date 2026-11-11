<template>
  <div class="site">
    <DrwaNav />

    <main id="main-content" class="container section" style="padding-top: var(--space-6)">
      <!-- Okruszki -->
      <nav class="drwa-crumb" aria-label="Breadcrumb">
        <NuxtLink to="/blog">Blog</NuxtLink>
        <template v-if="post.category">
          <span class="drwa-crumb__sep">·</span>
          <span>{{ post.category }}</span>
        </template>
        <span class="drwa-crumb__sep">·</span>
        <span class="drwa-crumb__current" aria-current="page">{{ post.title }}</span>
      </nav>

      <!-- Nagłówek artykułu -->
      <header class="article-head io">
        <span class="eyebrow">
          <template v-if="post.category">{{ post.category }} · </template>{{ readTime(post.content) }}
        </span>
        <h1>{{ post.title }}</h1>
        <div class="byline">
          <span>{{ formatDate(post.publish_date) }}</span>
          <span class="dot">·</span>
          <span>{{ readTime(post.content) }}</span>
        </div>
      </header>

      <!-- Zdjęcie hero -->
      <figure v-if="post.featured_image" class="article-hero io">
        <DrwaImg :src="post.featured_image" :alt="post.title" preset="hero" priority />
      </figure>

      <!-- Treść -->
      <div class="prose io" v-html="post.content" />

      <!-- Czytaj dalej -->
      <section v-if="related.length" class="more">
        <div class="sec-head io">
          <span class="eyebrow">Czytaj dalej</span>
          <h2>Więcej z lasu</h2>
        </div>
        <div class="bgrid" style="margin-top: 0">
          <NuxtLink v-for="a in related" :key="a.id" class="drwa-pcard io" :to="`/blog/${a.slug}`">
            <div class="drwa-pcard__media">
              <DrwaImg :src="a.featured_image" :alt="a.title" preset="card" fallback="/assets/forest-1.avif" />
            </div>
            <div class="drwa-pcard__body">
              <span class="drwa-pcard__eyebrow"><template v-if="a.category">{{ a.category }} · </template>{{ readTime(a.content, true) }}</span>
              <h3 class="drwa-pcard__title">{{ a.title }}</h3>
              <p class="drwa-pcard__desc">{{ stripHtml(a.content, 140) }}</p>
              <div class="drwa-pcard__foot">
                <span class="drwa-pcard__meta">{{ formatDate(a.publish_date) }}</span>
                <span class="bcard__go">
                  Czytaj
                  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </section>
    </main>

    <DrwaFooter />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDate, stripHtml, readTime } from '~/utils/format'

const route = useRoute()
const { data } = await useBlogPost(String(route.params.slug))

const post = data.value
if (!post) {
  throw createError({ statusCode: 404, statusMessage: 'Wpis nie znaleziony', fatal: true })
}

useHead({ title: `${post.title} — Blog DRWA` })
useSeoMeta({ description: stripHtml(post.content, 160) })

// Powiązane wpisy z listy (cache współdzielony z /blog) — bez bieżącego, max 3.
const { data: allPosts } = await useBlogPosts()
const related = computed(() =>
  (allPosts.value ?? []).filter((p) => p.slug !== post.slug).slice(0, 3),
)

useScrollReveal()
</script>
