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
            <h1 slot="title">About Give To Our City Day</h1>
        </layout-hero>

        <main class="main">
            <div class="wrapper wrapper--sm">

                <h2>Authoritatively customize compelling best practices via clicks-and-mortar bandwidth</h2>

                <p>
                    Collaboratively <strong>productivate</strong> vertical action items <em>after principle-centered platforms</em>. Assertively <a href="#">envisioneer</a> team building e-business rather than client-centered portals. Seamlessly negotiate enterprise-wide outsourcing for client-focused channels.
                </p>

                <p>
                    Competently communicate viral web-readiness through interdependent initiatives. Holisticly revolutionize top-line alignments with focused imperatives. Seamlessly disseminate alternative information and focused leadership skills.
                </p>

                <h2>Collaboratively monetize multidisciplinary value and compelling solutions</h2>

                <p>
                    Uniquely innovate functionalized benefits after extensible materials. Appropriately myocardinate customer directed synergy with open-source human capital. Professionally recaptiualize next-generation sources with highly efficient e-services.
                </p>

                <ol>
                    <li>Progressively aggregate emerging communities without market positioning paradigms.</li>
                    <li>Energistically matrix ethical partnerships through cross-media internal or "organic" sources.</li>
                    <li>Intrinsicly visualize cross-unit core competencies via long-term high-impact e-business.</li>
                </ol>

                <p>
                    Seamlessly harness high-payoff benefits and cutting-edge portals. Objectively extend innovative markets whereas effective results. Continually engage leveraged solutions for corporate leadership.
                </p>

                <p>
                    Monotonectally architect quality mindshare and covalent products. Enthusiastically empower holistic markets after cooperative mindshare. Completely build impactful applications without equity invested channels.
                </p>

                <p>
                    Conveniently conceptualize goal-oriented value rather than sticky experiences. Uniquely reconceptualize error-free web-readiness and front-end value. Appropriately deploy equity invested ROI before leading-edge schemas.
                </p>

                <p>
                    Continually incubate extensive e-tailers with extensible data.
                </p>

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
			vue.setPageTitle('Give To Our City - About');
		},
		components: {
			'layout-footer': require('./../layout/Footer.vue'),
			'layout-hero': require('../layout/Hero.vue'),
            'layout-sponsors': require('../layout/Sponsors.vue'),
		}
	};
</script>