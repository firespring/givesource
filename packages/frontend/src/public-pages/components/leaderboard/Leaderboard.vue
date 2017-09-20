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
    <div>
        <layout-hero :presentedBy="true">
            <h1 slot="title">Leaderboard</h1>
        </layout-hero>

        <main class="main">
            <div class="wrapper wrapper--sm">

                <div class="main__content">

                    <div class="leaderboard">

                        <div class="leaderboard-item">
                            <div class="leaderboard-item__num">01.</div>
                            <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo'  }">Pius X Foundation</router-link></h3></div>
                            <div class="leaderboard-item__amount">$44,746</div>
                            <div class="leaderboard-item__action"><a href="#" class="btn btn--xs btn--green">Donate</a></div>
                        </div>

                        <div class="leaderboard-item">
                            <div class="leaderboard-item__num">02.</div>
                            <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo'  }">Jacobs Well</router-link></h3></div>
                            <div class="leaderboard-item__amount">$44,627</div>
                            <div class="leaderboard-item__action"><a href="#" class="btn btn--xs btn--green">Donate</a></div>
                        </div>

                        <div class="leaderboard-item">
                            <div class="leaderboard-item__num">03.</div>
                            <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo'  }">Camp Sonshine</router-link></h3></div>
                            <div class="leaderboard-item__amount">$40,820</div>
                            <div class="leaderboard-item__action"><a href="#" class="btn btn--xs btn--green">Donate</a></div>
                        </div>

                        <div class="leaderboard-item">
                            <div class="leaderboard-item__num">04.</div>
                            <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo'  }">Food Bank of Lincoln</router-link></h3></div>
                            <div class="leaderboard-item__amount">$33,075</div>
                            <div class="leaderboard-item__action"><a href="#" class="btn btn--xs btn--green">Donate</a></div>
                        </div>

                        <div class="leaderboard-item">
                            <div class="leaderboard-item__num">05.</div>
                            <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo'  }">City Impact</router-link></h3></div>
                            <div class="leaderboard-item__amount">$29,563</div>
                            <div class="leaderboard-item__action"><a href="#" class="btn btn--xs btn--green">Donate</a></div>
                        </div>

                        <div class="leaderboard-item">
                            <div class="leaderboard-item__num">06.</div>
                            <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo'  }">Jewish Federation of Lincoln</router-link></h3></div>
                            <div class="leaderboard-item__amount">$27,961</div>
                            <div class="leaderboard-item__action"><a href="#" class="btn btn--xs btn--green">Donate</a></div>
                        </div>

                        <div class="leaderboard-item">
                            <div class="leaderboard-item__num">07.</div>
                            <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo'  }">People’s City Mission</router-link></h3></div>
                            <div class="leaderboard-item__amount">$25,262</div>
                            <div class="leaderboard-item__action"><a href="#" class="btn btn--xs btn--green">Donate</a></div>
                        </div>

                        <div class="leaderboard-item">
                            <div class="leaderboard-item__num">08.</div>
                            <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo'  }">Matt Talbot Kitchen &amp; Outreach</router-link></h3></div>
                            <div class="leaderboard-item__amount">$25,169</div>
                            <div class="leaderboard-item__action"><a href="#" class="btn btn--xs btn--green">Donate</a></div>
                        </div>

                        <div class="leaderboard-item">
                            <div class="leaderboard-item__num">09.</div>
                            <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo'  }">Tabitha Foundation</router-link></h3></div>
                            <div class="leaderboard-item__amount">$24,990</div>
                            <div class="leaderboard-item__action"><a href="#" class="btn btn--xs btn--green">Donate</a></div>
                        </div>

                        <div class="leaderboard-item">
                            <div class="leaderboard-item__num">10.</div>
                            <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo'  }">Cat House</router-link></h3></div>
                            <div class="leaderboard-item__amount">$23,990</div>
                            <div class="leaderboard-item__action"><a href="#" class="btn btn--xs btn--green">Donate</a></div>
                        </div>

                        <div class="leaderboard-item">
                            <div class="leaderboard-item__num">11.</div>
                            <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo'  }">Pius X Foundation</router-link></h3></div>
                            <div class="leaderboard-item__amount">$44,746</div>
                            <div class="leaderboard-item__action"><a href="#" class="btn btn--xs btn--green">Donate</a></div>
                        </div>

                        <div class="leaderboard-item">
                            <div class="leaderboard-item__num">12.</div>
                            <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo'  }">Jacobs Well</router-link></h3></div>
                            <div class="leaderboard-item__amount">$44,627</div>
                            <div class="leaderboard-item__action"><a href="#" class="btn btn--xs btn--green">Donate</a></div>
                        </div>

                        <div class="leaderboard-item">
                            <div class="leaderboard-item__num">13.</div>
                            <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo'  }">Camp Sonshine</router-link></h3></div>
                            <div class="leaderboard-item__amount">$40,820</div>
                            <div class="leaderboard-item__action"><a href="#" class="btn btn--xs btn--green">Donate</a></div>
                        </div>

                        <div class="leaderboard-item">
                            <div class="leaderboard-item__num">14.</div>
                            <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo'  }">Food Bank of Lincoln</router-link></h3></div>
                            <div class="leaderboard-item__amount">$33,075</div>
                            <div class="leaderboard-item__action"><a href="#" class="btn btn--xs btn--green">Donate</a></div>
                        </div>

                        <div class="leaderboard-item">
                            <div class="leaderboard-item__num">15.</div>
                            <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo'  }">City Impact</router-link></h3></div>
                            <div class="leaderboard-item__amount">$29,563</div>
                            <div class="leaderboard-item__action"><a href="#" class="btn btn--xs btn--green">Donate</a></div>
                        </div>

                        <div class="leaderboard-item">
                            <div class="leaderboard-item__num">16.</div>
                            <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo'  }">Jewish Federation of Lincoln</router-link></h3></div>
                            <div class="leaderboard-item__amount">$27,961</div>
                            <div class="leaderboard-item__action"><a href="#" class="btn btn--xs btn--green">Donate</a></div>
                        </div>

                        <div class="leaderboard-item">
                            <div class="leaderboard-item__num">17.</div>
                            <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo'  }">People’s City Mission</router-link></h3></div>
                            <div class="leaderboard-item__amount">$25,262</div>
                            <div class="leaderboard-item__action"><a href="#" class="btn btn--xs btn--green">Donate</a></div>
                        </div>

                        <div class="leaderboard-item">
                            <div class="leaderboard-item__num">18.</div>
                            <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo'  }">Matt Talbot Kitchen &amp; Outreach</router-link></h3></div>
                            <div class="leaderboard-item__amount">$25,169</div>
                            <div class="leaderboard-item__action"><a href="#" class="btn btn--xs btn--green">Donate</a></div>
                        </div>

                        <div class="leaderboard-item">
                            <div class="leaderboard-item__num">19.</div>
                            <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo'  }">Tabitha Foundation</router-link></h3></div>
                            <div class="leaderboard-item__amount">$24,990</div>
                            <div class="leaderboard-item__action"><a href="#" class="btn btn--xs btn--green">Donate</a></div>
                        </div>

                        <div class="leaderboard-item">
                            <div class="leaderboard-item__num">20.</div>
                            <div class="leaderboard-item__info"><h3><router-link :to="{ name: 'nonprofit-landing-page-demo'  }">Cat House</router-link></h3></div>
                            <div class="leaderboard-item__amount">$23,990</div>
                            <div class="leaderboard-item__action"><a href="#" class="btn btn--xs btn--green">Donate</a></div>
                        </div>

                    </div>

                    <div class="pagination flex justify-center items-center">
                        <a href="#" class="prev"><i class="fa fa-fw fa-chevron-left" aria-hidden="true"></i>Prev</a>
                        <a href="#" class="here">1</a>
                        <a href="#">2</a>
                        <a href="#">3</a>
                        <a href="#">4</a>
                        <a href="#">5</a>
                        <a href="#" class="next">Next<i class="fa fa-fw fa-chevron-right" aria-hidden="true"></i></a>
                    </div>
                </div>

            </div>
        </main>

        <layout-footer>
            <layout-sponsors></layout-sponsors>
        </layout-footer>
    </div>
</template>

<script>
	module.exports = {
		beforeMount: function () {
			const vue = this;

			vue.setBodyClasses('page');
			vue.setPageTitle('Leaderboard');
		},
		components: {
			'layout-footer': require('./../layout/Footer.vue'),
			'layout-hero': require('./../layout/Hero.vue'),
            'layout-sponsors': require('./../layout/Sponsors.vue')
		}
	};
</script>