<!--
  ~ Copyright (C) 2017  Firespring
  ~
  ~ This program is free software: you can redistribute it and/or modify
  ~ it under the terms of the GNU General Public License as published by
  ~ the Free Software Foundation, either version 3 of the License, or
  ~ (at your option) any later version.
  ~
  ~ This program is distributed in the hope that it will be useful,
  ~ but WITHOUT ANY WARRANTY; without even the implied warranty of
  ~ MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  ~ GNU General Public License for more details.
  ~
  ~ You should have received a copy of the GNU General Public License
  ~ along with this program.  If not, see <http://www.gnu.org/licenses/>.
  -->

<template>
    <div class="leaderboard">

        <h2 class="leaderboard__title"><span>Give To Our City</span> Leaderboard</h2>

        <div class="grid">
            <div class="grid-item">
                <div class="leaderboard-item">
                    <div class="leaderboard-item__num">01.</div>
                    <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo' }">Pius X Foundation</router-link></h3></div>
                    <div class="leaderboard-item__amount">$44,746</div>
                    <div class="leaderboard-item__action"><a v-on:click.prevent="donate('Pius X Foundation')" href="#" class="btn btn--xs btn--green">Donate</a></div>
                </div>

                <div class="leaderboard-item">
                    <div class="leaderboard-item__num">02.</div>
                    <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo' }">Jacobs Well</router-link></h3></div>
                    <div class="leaderboard-item__amount">$44,627</div>
                    <div class="leaderboard-item__action"><a v-on:click.prevent="donate('Jacobs Well')" href="#" class="btn btn--xs btn--green">Donate</a></div>
                </div>

                <div class="leaderboard-item">
                    <div class="leaderboard-item__num">03.</div>
                    <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo' }">Camp Sonshine</router-link></h3></div>
                    <div class="leaderboard-item__amount">$40,820</div>
                    <div class="leaderboard-item__action"><a v-on:click.prevent="donate('Camp Sonshine')" href="#" class="btn btn--xs btn--green">Donate</a></div>
                </div>

                <div class="leaderboard-item">
                    <div class="leaderboard-item__num">04.</div>
                    <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo' }">Food Bank of Our City</router-link></h3></div>
                    <div class="leaderboard-item__amount">$33,075</div>
                    <div class="leaderboard-item__action"><a v-on:click.prevent="donate('Food Bank of Our City')" href="#" class="btn btn--xs btn--green">Donate</a></div>
                </div>

                <div class="leaderboard-item">
                    <div class="leaderboard-item__num">05.</div>
                    <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo' }">City Impact</router-link></h3></div>
                    <div class="leaderboard-item__amount">$29,563</div>
                    <div class="leaderboard-item__action"><a v-on:click.prevent="donate('City Impact')" href="#" class="btn btn--xs btn--green">Donate</a></div>
                </div>

                <div class="leaderboard-item">
                    <div class="leaderboard-item__num">06.</div>
                    <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo' }">Jewish Federation of Our City</router-link></h3></div>
                    <div class="leaderboard-item__amount">$27,961</div>
                    <div class="leaderboard-item__action"><a v-on:click.prevent="donate('Jewish Federation of Our City')" href="#" class="btn btn--xs btn--green">Donate</a></div>
                </div>

                <div class="leaderboard-item">
                    <div class="leaderboard-item__num">07.</div>
                    <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo' }">People’s City Mission</router-link></h3></div>
                    <div class="leaderboard-item__amount">$25,262</div>
                    <div class="leaderboard-item__action"><a v-on:click.prevent="donate('People\'s City Mission')" href="#" class="btn btn--xs btn--green">Donate</a></div>
                </div>

                <div class="leaderboard-item">
                    <div class="leaderboard-item__num">08.</div>
                    <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo' }">Matt Talbot Kitchen & Outreach</router-link></h3></div>
                    <div class="leaderboard-item__amount">$25,169</div>
                    <div class="leaderboard-item__action"><a v-on:click.prevent="donate('Matt Talbot Kitchen & Outreach')" href="#" class="btn btn--xs btn--green">Donate</a></div>
                </div>

                <div class="leaderboard-item">
                    <div class="leaderboard-item__num">09.</div>
                    <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo' }">Tabitha Foundation</router-link></h3></div>
                    <div class="leaderboard-item__amount">$24,990</div>
                    <div class="leaderboard-item__action"><a v-on:click.prevent="donate('Tabitha Foundation')" href="#" class="btn btn--xs btn--green">Donate</a></div>
                </div>

                <div class="leaderboard-item">
                    <div class="leaderboard-item__num">10.</div>
                    <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo' }">Cat House</router-link></h3></div>
                    <div class="leaderboard-item__amount">$23,990</div>
                    <div class="leaderboard-item__action"><a v-on:click.prevent="donate('Cat House')" href="#" class="btn btn--xs btn--green">Donate</a></div>
                </div>
            </div>

            <div class="grid-item">
                <div class="leaderboard-item">
                    <div class="leaderboard-item__num">11.</div>
                    <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo' }">Pius X Foundation</router-link></h3></div>
                    <div class="leaderboard-item__amount">$44,746</div>
                    <div class="leaderboard-item__action"><a v-on:click.prevent="donate('Pius X Foundation')" href="#" class="btn btn--xs btn--green">Donate</a></div>
                </div>

                <div class="leaderboard-item">
                    <div class="leaderboard-item__num">12.</div>
                    <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo' }">Jacobs Well</router-link></h3></div>
                    <div class="leaderboard-item__amount">$44,627</div>
                    <div class="leaderboard-item__action"><a v-on:click.prevent="donate('Jacobs Well')" href="#" class="btn btn--xs btn--green">Donate</a></div>
                </div>

                <div class="leaderboard-item">
                    <div class="leaderboard-item__num">13.</div>
                    <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo' }">Camp Sonshine</router-link></h3></div>
                    <div class="leaderboard-item__amount">$40,820</div>
                    <div class="leaderboard-item__action"><a v-on:click.prevent="donate('Camp Sonshine')" href="#" class="btn btn--xs btn--green">Donate</a></div>
                </div>

                <div class="leaderboard-item">
                    <div class="leaderboard-item__num">14.</div>
                    <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo' }">Food Bank of Our City</router-link></h3></div>
                    <div class="leaderboard-item__amount">$33,075</div>
                    <div class="leaderboard-item__action"><a v-on:click.prevent="donate('Food Bank of Our City')" href="#" class="btn btn--xs btn--green">Donate</a></div>
                </div>

                <div class="leaderboard-item">
                    <div class="leaderboard-item__num">15.</div>
                    <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo' }">City Impact</router-link></h3></div>
                    <div class="leaderboard-item__amount">$29,563</div>
                    <div class="leaderboard-item__action"><a v-on:click.prevent="donate('City Impact')" href="#" class="btn btn--xs btn--green">Donate</a></div>
                </div>

                <div class="leaderboard-item">
                    <div class="leaderboard-item__num">16.</div>
                    <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo' }">Jewish Federation of Our City</router-link></h3></div>
                    <div class="leaderboard-item__amount">$27,961</div>
                    <div class="leaderboard-item__action"><a v-on:click.prevent="donate('Jewish Federation of Our City')" href="#" class="btn btn--xs btn--green">Donate</a></div>
                </div>

                <div class="leaderboard-item">
                    <div class="leaderboard-item__num">17.</div>
                    <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo' }">People’s City Mission</router-link></h3></div>
                    <div class="leaderboard-item__amount">$25,262</div>
                    <div class="leaderboard-item__action"><a v-on:click.prevent="donate('People\'s City Mission')" href="#" class="btn btn--xs btn--green">Donate</a></div>
                </div>

                <div class="leaderboard-item">
                    <div class="leaderboard-item__num">18.</div>
                    <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo' }">Matt Talbot Kitchen & Outreach</router-link></h3></div>
                    <div class="leaderboard-item__amount">$25,169</div>
                    <div class="leaderboard-item__action"><a v-on:click.prevent="donate('Matt Talbot Kitchen & Outreach')" href="#" class="btn btn--xs btn--green">Donate</a></div>
                </div>

                <div class="leaderboard-item">
                    <div class="leaderboard-item__num">19.</div>
                    <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo' }">Tabitha Foundation</router-link></h3></div>
                    <div class="leaderboard-item__amount">$24,990</div>
                    <div class="leaderboard-item__action"><a v-on:click.prevent="donate('Tabitha Foundation')" href="#" class="btn btn--xs btn--green">Donate</a></div>
                </div>

                <div class="leaderboard-item">
                    <div class="leaderboard-item__num">20.</div>
                    <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo' }">Cat House</router-link></h3></div>
                    <div class="leaderboard-item__amount">$23,990</div>
                    <div class="leaderboard-item__action"><a v-on:click.prevent="donate('Cat House')" href="#" class="btn btn--xs btn--green">Donate</a></div>
                </div>
            </div>
        </div>

        <div class="leaderboard__actions">
            <router-link :to="{ name: 'leaderboard' }" class="btn btn--dark btn--lg">See Full Leaderboard</router-link>
        </div>

    </div>
</template>

<script>
    module.exports = {
    	methods: {
    		donate: function (legalName) {
    			const vue = this;

			    vue.addModal('donation-tiers', {
			    	nonprofit: {
			    		legalName: legalName,
                    },
                    tiers: [
	                    {
		                    amount: 10000,
		                    description: 'Intrinsicly enable ubiquitous opportunities for 24/365 data. Interactively predominate just in time communities via tactical e-tailers.'
	                    },
	                    {
		                    amount: 5000,
		                    description: 'Dynamically restore an expanded array of e-markets before leveraged technologies.'
	                    },
	                    {
		                    amount: 2500,
		                    description: 'Completely orchestrate impactful metrics after prospective infomediaries.'
	                    },
	                    {
		                    amount: 1000,
		                    description: 'Enthusiastically network frictionless solutions and high-payoff total linkage.'
	                    }
                    ]
			    });
            }
        }
    };
</script>