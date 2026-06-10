<template>
  <section class="section container">
    <div class="sec-head io">
      <span class="eyebrow">Cztery rzeczy, w które wierzymy</span>
      <h2>Rzemiosło, las i ognisko</h2>
    </div>
    <div class="values-grid">
      <div v-for="v in VALUES" :key="v.title" class="value-card io">
        <div class="value-card__icon">
          <component :is="v.icon" />
        </div>
        <h3 class="value-card__title">{{ v.title }}</h3>
        <p class="value-card__desc">{{ v.desc }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineComponent, h } from 'vue'

const icon = (paths) => defineComponent({
  render: () => h('svg', {
    viewBox: '0 0 24 24', width: '24', height: '24',
    fill: 'none', stroke: 'currentColor', 'stroke-width': '1.75',
    'stroke-linecap': 'round', 'stroke-linejoin': 'round',
  }, paths.map(d => h('path', { d })))
})

const HammerIcon = defineComponent({ render: () => h('svg', { viewBox:'0 0 24 24', width:'24', height:'24', fill:'none', stroke:'currentColor', 'stroke-width':'1.75', 'stroke-linecap':'round', 'stroke-linejoin':'round' }, [
  h('path', { d: 'm15 12-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9' }),
  h('path', { d: 'M17.64 15 22 10.64' }),
  h('path', { d: 'm20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91' }),
]) })

const CompassIcon = defineComponent({ render: () => h('svg', { viewBox:'0 0 24 24', width:'24', height:'24', fill:'none', stroke:'currentColor', 'stroke-width':'1.75', 'stroke-linecap':'round', 'stroke-linejoin':'round' }, [
  h('circle', { cx:'12', cy:'12', r:'10' }),
  h('path', { d: 'm16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z' }),
]) })

const LeafIcon = defineComponent({ render: () => h('svg', { viewBox:'0 0 24 24', width:'24', height:'24', fill:'none', stroke:'currentColor', 'stroke-width':'1.75', 'stroke-linecap':'round', 'stroke-linejoin':'round' }, [
  h('path', { d: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z' }),
  h('path', { d: 'M2 21c0-3 1.85-5.36 5.08-6' }),
]) })

const UsersIcon = defineComponent({ render: () => h('svg', { viewBox:'0 0 24 24', width:'24', height:'24', fill:'none', stroke:'currentColor', 'stroke-width':'1.75', 'stroke-linecap':'round', 'stroke-linejoin':'round' }, [
  h('path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }),
  h('circle', { cx:'9', cy:'7', r:'4' }),
  h('path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' }),
]) })

const VALUES = [
  { icon: HammerIcon, title: 'Robimy rzeczy z drewna', desc: 'Rękodzieło z litego drewna, łączenia bez gwoździ i szacunek do materiału.' },
  { icon: CompassIcon, title: 'Stawiamy solidne konstrukcje', desc: 'Więźby, altany, wiaty i chaty — od fundamentu po kalenicę.' },
  { icon: LeafIcon, title: 'Budujemy naturalnie', desc: 'Drewno z odpowiedzialnych źródeł i wiedza o naturalnym budownictwie.' },
  { icon: UsersIcon, title: 'Uczymy tego innych', desc: 'Małe grupy, wspólna praca i nauka — stacjonarnie i online.' },
]
</script>
