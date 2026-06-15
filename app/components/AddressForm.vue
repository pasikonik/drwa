<template>
  <div class="addr">
    <div class="field">
      <label class="field__label" for="addr-name">Imię i nazwisko</label>
      <input id="addr-name" v-model="address.name" class="field__input" :class="{ 'field__input--error': errors?.name }" type="text" autocomplete="name" />
      <span v-if="errors?.name" class="field__error" role="alert">{{ errors.name }}</span>
    </div>
    <div class="field">
      <label class="field__label" for="addr-street">Ulica i numer</label>
      <input id="addr-street" v-model="address.street" class="field__input" :class="{ 'field__input--error': errors?.street }" type="text" autocomplete="street-address" />
      <span v-if="errors?.street" class="field__error" role="alert">{{ errors.street }}</span>
    </div>
    <div class="addr__row">
      <div class="field">
        <label class="field__label" for="addr-postal">Kod pocztowy</label>
        <input id="addr-postal" v-model="address.postalCode" class="field__input" :class="{ 'field__input--error': errors?.postalCode }" type="text" autocomplete="postal-code" placeholder="00-000" />
        <span v-if="errors?.postalCode" class="field__error" role="alert">{{ errors.postalCode }}</span>
      </div>
      <div class="field">
        <label class="field__label" for="addr-city">Miasto</label>
        <input id="addr-city" v-model="address.city" class="field__input" :class="{ 'field__input--error': errors?.city }" type="text" autocomplete="address-level2" />
        <span v-if="errors?.city" class="field__error" role="alert">{{ errors.city }}</span>
      </div>
    </div>
    <div class="field">
      <label class="field__label" for="addr-phone">Telefon</label>
      <input id="addr-phone" v-model="address.phone" class="field__input" :class="{ 'field__input--error': errors?.phone }" type="tel" autocomplete="tel" />
      <span v-if="errors?.phone" class="field__error" role="alert">{{ errors.phone }}</span>
    </div>
    <div v-if="showPoint" class="field">
      <label class="field__label" for="addr-point">Kod paczkomatu</label>
      <input id="addr-point" v-model="address.pointCode" class="field__input" type="text" placeholder="np. KRA01M" />
      <span class="field__hint">Wpisz kod wybranego paczkomatu InPost.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShippingAddress } from '~/types/shop'

defineProps<{
  /** Reactive address object owned by the parent — fields are mutated in place. */
  address: ShippingAddress
  showPoint?: boolean
  errors?: Partial<Record<keyof ShippingAddress, string>>
}>()
</script>
