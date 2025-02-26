<!--
  ~ Copyright 2019 Firespring, Inc.
  ~
  ~ Licensed under the Apache License, Version 2.0 (the "License");
  ~ you may not use this file except in compliance with the License.
  ~ You may obtain a copy of the License at
  ~
  ~     http://www.apache.org/licenses/LICENSE-2.0
  ~
  ~ Unless required by applicable law or agreed to in writing, software
  ~ distributed under the License is distributed on an "AS IS" BASIS,
  ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~ See the License for the specific language governing permissions and
  ~ limitations under the License.
  -->

<template>
  <div>
    <input
      v-if="isMobile"
      :id="id"
      ref="input"
      v-model="localValue"
      type="tel"
      :name="name"
      autocomplete="cc-number"
      placeholder="•••• •••• •••• ••••"
      :required="isRequired"
      :class="{'has-error': hasError}"
      :aria-describedby="aria?.describedby"
      :aria-labelledby="aria?.labelledby"
    >
    <input
      v-else
      :id="id"
      ref="input"
      v-model="localValue"
      type="text"
      :name="name"
      autocomplete="cc-number"
      placeholder="•••• •••• •••• ••••"
      :class="{'has-error': hasError}"
      :required="isRequired"
      :aria-describedby="aria?.describedby"
      :aria-labelledby="aria?.labelledby"
    >
    <div
      aria-label="Accepted Card Types"
      class="notes notes--below accepted-cc"
    >
      <div
        class="cc visa"
        :class="{na: !displayCardType('visa')}"
      >
        <i
          class="fab fa-cc-visa"
          aria-label="Visa"
        />
      </div>
      <div
        class="cc mastercard"
        :class="{na: !displayCardType('mastercard')}"
      >
        <i
          class="fab fa-cc-mastercard"
          aria-label="Mastercard"
        />
      </div>
      <div
        class="cc amex"
        :class="{na: !displayCardType('amex')}"
      >
        <i
          class="fab fa-cc-amex"
          aria-label="American Express"
        />
      </div>
      <div
        class="cc discover"
        :class="{na: !displayCardType('discover')}"
      >
        <i
          class="fab fa-cc-discover"
          aria-label="Discover"
        />
      </div>
      <div
        class="cc dinersclub"
        :class="{na: !displayCardType('dinersclub')}"
      >
        <i
          class="fab fa-cc-diners-club"
          aria-label="Diners Club"
        />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    modelValue: { type: String, default: '' },
    id: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    hasError: {
      type: Boolean,
      default: false
    },
    aria: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isRequired: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  data: function () {
    return {
      localValue: this.modelValue ? this.modelValue : null
    }
  },
  computed: {
    isMobile: function () {
      return /Mobi/.test(navigator.userAgent)
    }
  },
  watch: {
    modelValue: {
      handler (newVal) {
        this.localValue = newVal
      }
    },
    localValue: {
      handler () {
        this.$emit('update:modelValue', this.localValue)
      }
    }
  },
  mounted: function () {
    const vue = this
    $(vue.$refs.input).payment('formatCardNumber')
  },
  methods: {
    displayCardType: function (cardType) {
      return !this.localValue || $.payment.cardType(this.localValue) === cardType
    }
  }
}
</script>
