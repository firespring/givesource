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
  <tr>
    <td class="input input--text">
      <SelectNonprofit
        :id="nonprofitFieldName"
        v-model="selectedNonprofit"
        :name="nonprofitFieldName"
        :nonprofits="nonprofits"
        :has-error="hasNonprofitIdError"
      />
      <div
        v-if="errors[nonprofitFieldName]"
        class="c-notes c-notes--below c-notes--bad c-form-control-error"
      >
        {{ errors[nonprofitFieldName] }}
      </div>
    </td>
    <td class="input input--text">
      <div class="u-control-icon u-control-icon--dollar">
        <input
          :id="dollarAmountFieldName"
          v-model="dollarAmount"
          type="number"
          step="0.01"
          :name="dollarAmountFieldName"
          :class="{ 'has-error': errors[dollarAmountFieldName] }"
        >
      </div>
      <div
        v-if="errors[dollarAmountFieldName]"
        class="c-notes c-notes--below c-notes--bad c-form-control-error"
      >
        {{ errors[dollarAmountFieldName] }}
      </div>
    </td>
    <td class="input input--text">
      <input
        :id="noteFieldName"
        v-model="note"
        type="text"
        :name="noteFieldName"
        :class="{ 'has-error': errors[noteFieldName] }"
      >
      <div
        v-if="errors[noteFieldName]"
        class="c-notes c-notes--below c-notes--bad c-form-control-error"
      >
        {{ errors[noteFieldName] }}
      </div>
    </td>
    <td class="icon">
      <a
        v-if="donationData.row !== 0"
        href="#"
        role="button"
        class="icon icon--bad"
        @click="removeRow"
      ><i
        class="fa fa-minus-circle"
        aria-hidden="true"
      /></a>
    </td>
  </tr>
</template>

<script>
import SelectNonprofit from '../../forms/SelectNonprofit.vue'

export default {
  components: {
    SelectNonprofit
  },

  props: {
    /**
     * The errors for the given row.
     */
    errors: {
      type: Object,
      default () {
        return {}
      }
    },
    /**
     * data of the row
     */
    donationData: {
      type: Object,
      required: true
    },
    /**
     * given list of nonprofits.
     */
    nonprofits: {
      type: Array,
      required: true
    },

    /**
     * field name
     */
    nonprofitFieldName: {
      type: String,
      required: true
    },

    /**
     * field name
     */
    dollarAmountFieldName: {
      type: String,
      required: true
    },

    /**
     * field name
     */
    noteFieldName: {
      type: String,
      required: true
    }
  },

  data () {
    const vm = this
    return {
      selectedNonprofit: vm.donationData.selectedNonprofit,
      dollarAmount: vm.donationData.dollarAmount,
      note: vm.donationData.note
    }
  },

  computed: {
    /**
     * The data of the row
     *
     * @return {{note: (default.watch.note|string|*), selectedNonprofit: (default.watch.selectedNonprofit|number|*), dollarAmount: (default.watch.dollarAmount|number|*), row: *}}
     */
    getRow () {
      const vm = this
      return {
        selectedNonprofit: vm.selectedNonprofit,
        dollarAmount: vm.dollarAmount,
        note: vm.note,
        row: vm.donationData.row
      }
    },

    /**
     * boolean value if field has error
     *
     * @return {boolean}
     */
    hasNonprofitIdError () {
      const vm = this
      return !!vm.errors[vm.nonprofitFieldName]
    }
  },

  watch: {
    /**
     * watch the object for change
     *
     * @param value
     * @param oldValue
     */
    donationData (value, oldValue) {
      const vm = this
      if (value !== oldValue) {
        vm.selectedNonprofit = value.selectedNonprofit
        vm.dollarAmount = value.dollarAmount
        vm.note = value.note
        vm.row = value.row
      }
    },
    /**
     * watch the selected NP and emit change
     *
     * @param value
     * @param oldValue
     */
    selectedNonprofit (value, oldValue) {
      const vm = this
      if (value !== oldValue) {
        vm.$emit('change', vm.getRow)
      }
    },
    /**
     * watch the dollar amount and emit change
     *
     * @param value
     * @param oldValue
     */
    dollarAmount (value, oldValue) {
      const vm = this
      if (value !== oldValue) {
        vm.$emit('change', vm.getRow)
      }
    },
    /**
     * watch the note and emit change
     *
     * @param value
     * @param oldValue
     */
    note (value, oldValue) {
      const vm = this
      if (value !== oldValue) {
        vm.$emit('change', vm.getRow)
      }
    }
  },

  methods: {
    /**
     * emit event to remove row
     *
     * @param event
     */
    removeRow (event) {
      const vm = this
      event.preventDefault()
      vm.$emit('remove', vm.getRow)
    }
  }
}
</script>
