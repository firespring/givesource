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
  <VueSelect
    v-model="localValue"
    :input-id="id"
    :name="name"
    placeholder="Select a state"
    :options="[
      {
        label: 'Alabama',
        value: 'AL'
      },
      {
        label: 'Alaska',
        value: 'AK'
      },
      {
        label: 'American Samoa',
        value: 'AS'
      },
      {
        label: 'Arizona',
        value: 'AZ'
      },
      {
        label: 'Arkansas',
        value: 'AR'
      },
      {
        label: 'California',
        value: 'CA'
      },
      {
        label: 'Colorado',
        value: 'CO'
      },
      {
        label: 'Connecticut',
        value: 'CT'
      },
      {
        label: 'Delaware',
        value: 'DE'
      },
      {
        label: 'District Of Columbia',
        value: 'DC'
      },
      {
        label: 'Federated States Of Micronesia',
        value: 'FM'
      },
      {
        label: 'Florida',
        value: 'FL'
      },
      {
        label: 'Georgia',
        value: 'GA'
      },
      {
        label: 'Guam',
        value: 'GU'
      },
      {
        label: 'Hawaii',
        value: 'HI'
      },
      {
        label: 'Idaho',
        value: 'ID'
      },
      {
        label: 'Illinois',
        value: 'IL'
      },
      {
        label: 'Indiana',
        value: 'IN'
      },
      {
        label: 'Iowa',
        value: 'IA'
      },
      {
        label: 'Kansas',
        value: 'KS'
      },
      {
        label: 'Kentucky',
        value: 'KY'
      },
      {
        label: 'Louisiana',
        value: 'LA'
      },
      {
        label: 'Maine',
        value: 'ME'
      },
      {
        label: 'Marshall Islands',
        value: 'MH'
      },
      {
        label: 'Maryland',
        value: 'MD'
      },
      {
        label: 'Massachusetts',
        value: 'MA'
      },
      {
        label: 'Michigan',
        value: 'MI'
      },
      {
        label: 'Minnesota',
        value: 'MN'
      },
      {
        label: 'Mississippi',
        value: 'MS'
      },
      {
        label: 'Missouri',
        value: 'MO'
      },
      {
        label: 'Montana',
        value: 'MT'
      },
      {
        label: 'Nebraska',
        value: 'NE'
      },
      {
        label: 'Nevada',
        value: 'NV'
      },
      {
        label: 'New Hampshire',
        value: 'NH'
      },
      {
        label: 'New Jersey',
        value: 'NJ'
      },
      {
        label: 'New Mexico',
        value: 'NM'
      },
      {
        label: 'New York',
        value: 'NY'
      },
      {
        label: 'North Carolina',
        value: 'NC'
      },
      {
        label: 'North Dakota',
        value: 'ND'
      },
      {
        label: 'Northern Mariana Islands',
        value: 'MP'
      },
      {
        label: 'Ohio',
        value: 'OH'
      },
      {
        label: 'Oklahoma',
        value: 'OK'
      },
      {
        label: 'Oregon',
        value: 'OR'
      },
      {
        label: 'Palau',
        value: 'PW'
      },
      {
        label: 'Pennsylvania',
        value: 'PA'
      },
      {
        label: 'Puerto Rico',
        value: 'PR'
      },
      {
        label: 'Rhode Island',
        value: 'RI'
      },
      {
        label: 'South Carolina',
        value: 'SC'
      },
      {
        label: 'South Dakota',
        value: 'SD'
      },
      {
        label: 'Tennessee',
        value: 'TN'
      },
      {
        label: 'Texas',
        value: 'TX'
      },
      {
        label: 'Utah',
        value: 'UT'
      },
      {
        label: 'Vermont',
        value: 'VT'
      },
      {
        label: 'Virgin Islands',
        value: 'VI'
      },
      {
        label: 'Virginia',
        value: 'VA'
      },
      {
        label: 'Washington',
        value: 'WA'
      },
      {
        label: 'West Virginia',
        value: 'WV'
      },
      {
        label: 'Wisconsin',
        value: 'WI'
      },
      {
        label: 'Wyoming',
        value: 'WY'
      }
    ]"
  />
</template>

<script>
import { ref, watch, onMounted } from 'vue'

export default {
  props: {
    modelValue: { type: [String, Number], default: null },
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
      default: 'Select a state'
    },
    nonprofits: {
      type: Array,
      default: function () {
        return []
      }
    },
    hasError: {
      type: Boolean,
      default: false
    },
    isRequired: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const localValue = ref('')

    watch(localValue, (newValue) => {
      emit('update:modelValue', newValue + '')
    })

    onMounted(() => {
      watch(() => props.modelValue, (newValue) => {
        localValue.value = newValue
      })
    })

    return {
      localValue
    }
  }
}
</script>
