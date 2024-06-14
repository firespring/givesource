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
    <router-view />
    <modals />
  </div>
</template>

<script>
import ComponentModals from './modals/Modals.vue'
import { useAppStore } from '../store'

export default {
  components: {
    modals: ComponentModals
  },
  beforeCreate () {
    const store = useAppStore()

    const eventTitle = store.setting('EVENT_TITLE')
    if (eventTitle) {
      document.title = eventTitle
    }

    const seoDescription = store.setting('SEO_DESCRIPTION')
    const socialDescription = store.setting('SOCIAL_SHARING_DESCRIPTION')
    if (seoDescription || socialDescription) {
      const description = seoDescription || socialDescription
      document.querySelector('meta[name="description"]').setAttribute('content', description)
    }

    const favicon = store.setting('FAVICON')
    if (favicon) {
      const link = document.querySelector("link[rel*='icon']") || document.createElement('link')
      link.type = 'image/png'
      link.rel = 'shortcut icon'
      link.href = favicon

      document.getElementsByTagName('head')[0].appendChild(link)
    }
  }
}
</script>
