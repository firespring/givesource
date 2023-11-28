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
  <div class="donation-option">
    <a
      href="#"
      @click="selectTier"
    >
      <h2 class="donation-option__title">{{ amount }}</h2>
      <div class="donation-option__description">
        {{ donationTier.description }}
      </div>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    donationTier: { type: Object, default: () => ({}) }
  },
  computed: {
    amount: function () {
      return this.formatMoney(this.donationTier.amount)
    }
  },
  methods: {
    selectTier: function (event) {
      event.preventDefault()
      const vue = this

      vue.$emit('select-tier', vue.donationTier.amount)
    }
  }
}
</script>
