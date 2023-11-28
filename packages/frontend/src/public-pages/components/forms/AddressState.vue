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
  <select
    :id="id"
    ref="input"
    v-model="localValue"
    :name="name"
  >
    <option
      v-if="placeholder"
      disabled
      value=""
    >
      {{ placeholder }}
    </option>
    <option
      v-if="placeholder"
      disabled
      value=""
    >
      -----
    </option>
    <option
      v-for="state in states"
      :value="state.abbreviation"
    >
      {{ state.name }}
    </option>
  </select>
</template>

<script>
export default {
  emits: ['input'],
  props: {
    value: { type: String, default: '' },
    id: {
      type: String,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    }
  },
  data: function () {
    return {
      localValue: this.value ? this.value : !this.placeholder ? 'AL' : '',
      states: [
        {
          name: 'Alabama',
          abbreviation: 'AL'
        },
        {
          name: 'Alaska',
          abbreviation: 'AK'
        },
        {
          name: 'American Samoa',
          abbreviation: 'AS'
        },
        {
          name: 'Arizona',
          abbreviation: 'AZ'
        },
        {
          name: 'Arkansas',
          abbreviation: 'AR'
        },
        {
          name: 'California',
          abbreviation: 'CA'
        },
        {
          name: 'Colorado',
          abbreviation: 'CO'
        },
        {
          name: 'Connecticut',
          abbreviation: 'CT'
        },
        {
          name: 'Delaware',
          abbreviation: 'DE'
        },
        {
          name: 'District Of Columbia',
          abbreviation: 'DC'
        },
        {
          name: 'Federated States Of Micronesia',
          abbreviation: 'FM'
        },
        {
          name: 'Florida',
          abbreviation: 'FL'
        },
        {
          name: 'Georgia',
          abbreviation: 'GA'
        },
        {
          name: 'Guam',
          abbreviation: 'GU'
        },
        {
          name: 'Hawaii',
          abbreviation: 'HI'
        },
        {
          name: 'Idaho',
          abbreviation: 'ID'
        },
        {
          name: 'Illinois',
          abbreviation: 'IL'
        },
        {
          name: 'Indiana',
          abbreviation: 'IN'
        },
        {
          name: 'Iowa',
          abbreviation: 'IA'
        },
        {
          name: 'Kansas',
          abbreviation: 'KS'
        },
        {
          name: 'Kentucky',
          abbreviation: 'KY'
        },
        {
          name: 'Louisiana',
          abbreviation: 'LA'
        },
        {
          name: 'Maine',
          abbreviation: 'ME'
        },
        {
          name: 'Marshall Islands',
          abbreviation: 'MH'
        },
        {
          name: 'Maryland',
          abbreviation: 'MD'
        },
        {
          name: 'Massachusetts',
          abbreviation: 'MA'
        },
        {
          name: 'Michigan',
          abbreviation: 'MI'
        },
        {
          name: 'Minnesota',
          abbreviation: 'MN'
        },
        {
          name: 'Mississippi',
          abbreviation: 'MS'
        },
        {
          name: 'Missouri',
          abbreviation: 'MO'
        },
        {
          name: 'Montana',
          abbreviation: 'MT'
        },
        {
          name: 'Nebraska',
          abbreviation: 'NE'
        },
        {
          name: 'Nevada',
          abbreviation: 'NV'
        },
        {
          name: 'New Hampshire',
          abbreviation: 'NH'
        },
        {
          name: 'New Jersey',
          abbreviation: 'NJ'
        },
        {
          name: 'New Mexico',
          abbreviation: 'NM'
        },
        {
          name: 'New York',
          abbreviation: 'NY'
        },
        {
          name: 'North Carolina',
          abbreviation: 'NC'
        },
        {
          name: 'North Dakota',
          abbreviation: 'ND'
        },
        {
          name: 'Northern Mariana Islands',
          abbreviation: 'MP'
        },
        {
          name: 'Ohio',
          abbreviation: 'OH'
        },
        {
          name: 'Oklahoma',
          abbreviation: 'OK'
        },
        {
          name: 'Oregon',
          abbreviation: 'OR'
        },
        {
          name: 'Palau',
          abbreviation: 'PW'
        },
        {
          name: 'Pennsylvania',
          abbreviation: 'PA'
        },
        {
          name: 'Puerto Rico',
          abbreviation: 'PR'
        },
        {
          name: 'Rhode Island',
          abbreviation: 'RI'
        },
        {
          name: 'South Carolina',
          abbreviation: 'SC'
        },
        {
          name: 'South Dakota',
          abbreviation: 'SD'
        },
        {
          name: 'Tennessee',
          abbreviation: 'TN'
        },
        {
          name: 'Texas',
          abbreviation: 'TX'
        },
        {
          name: 'Utah',
          abbreviation: 'UT'
        },
        {
          name: 'Vermont',
          abbreviation: 'VT'
        },
        {
          name: 'Virgin Islands',
          abbreviation: 'VI'
        },
        {
          name: 'Virginia',
          abbreviation: 'VA'
        },
        {
          name: 'Washington',
          abbreviation: 'WA'
        },
        {
          name: 'West Virginia',
          abbreviation: 'WV'
        },
        {
          name: 'Wisconsin',
          abbreviation: 'WI'
        },
        {
          name: 'Wyoming',
          abbreviation: 'WY'
        }
      ]
    }
  },
  computed: {
    selectedValue: function () {
      const vue = this
      return vue.localValue
    }
  },
  watch: {
    localValue: function (value, oldValue) {
      const vue = this
      if (value === oldValue) {
        return
      }
      vue.$emit('input', vue.selectedValue)
    },
    value: function (value, oldValue) {
      const vue = this
      if (value === oldValue) {
        return
      }
      vue.localValue = value
    }
  },
  mounted: function () {
    const vue = this
    vue.$emit('input', vue.selectedValue)
  }
}
</script>
