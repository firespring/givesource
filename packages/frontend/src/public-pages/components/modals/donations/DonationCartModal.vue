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
  <div
    class="donation-overlay"
    :style="{ 'z-index': zIndex }"
  >
    <div class="donation-overlay__wrapper">
      <div
        ref="donationModalCart"
        class="donation-modal donation-modal--cart"
      >
        <section
          class="donation-modal__header"
          role="region"
          aria-label="Your Donations"
        >
          <h1 class="donation-modal__title">
            Your Donations
          </h1>
          <div class="donation-modal__content">
            <donation-cart-modal-list-table
              @close="close"
              @find-nonprofit="findNonprofit"
              @has-error="hasDonationErrors"
            />

            <div
              v-if="!isCartEmpty"
              class="donation-footer"
            >
              <a
                href="#"
                class="btn btn--lg btn--accent"
                @click.prevent="checkoutBtn"
              ><strong>Begin Checking Out</strong></a>
              <a
                href="#"
                class="btn btn--lite"
                @click.prevent="helpMoreBtn"
              ><strong>Help More Nonprofits</strong></a>
            </div>
          </div>

          <a
            href="#"
            class="donation-close"
            role="button"
            @click.prevent="close"
          ><span class="u-hidden-visually">Close</span><i
            class="fas fa-times-circle"
            aria-hidden="true"
          /></a>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import ComponentDonationCartModalListTable from './DonationCartModalListTable.vue'

export default {
  components: {
    'donation-cart-modal-list-table': ComponentDonationCartModalListTable
  },
  props: {
    data: { type: Object, default: () => ({}) },
    zIndex: {
      type: [Number, String],
      default: 1000
    }
  },
  data () {
    return {
      hasError: false
    }
  },
  computed: {
    isCartEmpty () {
      return this.$store.state.cartItems.length === 0
    }
  },
  created () {
    this.addBodyClasses('has-donation-overlay')
  },
  mounted () {
    $(this.$refs.donationModalCart).fadeIn()
  },
  methods: {
    close () {
      const vm = this

      $(vm.$refs.donationModalCart).fadeOut(() => {
        vm.removeModal('donation-cart')
        vm.removeBodyClasses('has-donation-overlay')
      })
    },
    checkoutBtn () {
      const vm = this

      if (!vm.hasError) {
        $(vm.$refs.donationModalCart).hide()
        vm.removeModal('donation-cart')
        vm.removeBodyClasses('has-donation-overlay')
        vm.$router.push({ name: 'cart' })
      }
    },
    helpMoreBtn () {
      const vm = this

      if (!vm.hasError) {
        $(vm.$refs.donationModalCart).hide()
        vm.removeModal('donation-cart')
        vm.removeBodyClasses('has-donation-overlay')

        vm.$router.push({
          name: vm.$route.name === 'leaderboard' ? 'leaderboard' : 'search-results',
          query: vm.$route.query ? vm.$route.query : {}
        })
      }
    },
    findNonprofit () {
      const vm = this

      $(vm.$refs.donationModalCart).hide()
      vm.removeModal('donation-cart')
      vm.removeBodyClasses('has-donation-overlay')

      vm.$router.push({
        name: vm.$route.name === 'leaderboard' ? 'leaderboard' : 'search-results',
        query: vm.$route.query ? vm.$route.query : {}
      })
    },
    hasDonationErrors (hasError) {
      this.hasError = hasError
    }
  }
}
</script>
