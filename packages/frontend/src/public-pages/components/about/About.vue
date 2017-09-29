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

                <h2>Event Overview</h2>

                <p>
                    Give To Our City is a 24-hour event that encourages everyone to contribute to Our City and nonprofit organizations
                    through a single online giving platform on May 18th. Give To Our City is coordinated by , in partnership with local nonprofit organizations.
                </p>

                <p>
                    Every donation makes a bigger impact on Give To Our City because nonprofits also get a proportional share of a $350,000
                    match fund.
                </p>

                <p>
                    The purpose of Give To Our City is to promote philanthropy in Our City. There are three primary goals:
                </p>

                <ol>
                    <li>Introduce new donors to our nonprofit organizations.</li>
                    <li>Help Our City nonprofit organizations tell their stories and educate Our City about the positive impact they
                        have on our lives.</li>
                    <li>Shine a community spotlight on this day of charitable giving to raise a substantial amount of new money to
                        assist the local nonprofit network.</li>
                </ol>

                <p>
                    Give To Our City is intended to be a bonus fundraising opportunity for local nonprofits in our community. It is not intended
                    to replace or interfere with donors’ gifts to a nonprofit organization that would be made in the regular
                    course of charitable giving.
                </p>

                <h2>Making A Donation</h2>

                <p>
                    Donations to participating charities are made online and will be updated in real time on the online leader board at Give To Our City website.
                    Online donations may be made starting on May 1st. Gifts made between May 1 – May 17 will count toward the
                    event, show on the leader board when the giving day begins on May 18 and be eligible for the match fund.
                </p>

                <p>
                    Donations may also be made in person by cash or check at the The Greater Area Foundation office from 8:00am to 5:00pm on
                    Thursday, May 18. Checks must be written to “The Greater Area Foundation” with the nonprofit name specified
                    in the memo line. LCF will charge the same 2.9% fee as Firespring Foundation, and direct fees received from
                    offline gifts to discretionary funds used for community grants to local nonprofits. All donations are final
                    and cannot be refunded. Nonprofit organizations will receive their donations (minus 2.9% fee), proportional
                    share of the match fund and a list of offline donors within approximately one month of the event.
                </p>

                <h2 id="nonprofit-eligibility">Nonprofit Eligibility</h2>

                <p>
                    Nonprofit organizations recognized by the IRS as 501(c)(3) public charities located in Lancaster County that serve the people
                    of Our City are eligible to register for Give To Our City. Nonprofits that have either
                    a Lancaster County address listed on their GuideStar record or most recent Form 990 are eligible. If the
                    GuideStar/Form 990 official address is outside Lancaster County, the nonprofit must have a physical office
                    space in Lancaster County other than a personal residence. Houses of worship and their foundations are excluded
                    from participating.
                </p>

                <p>
                    Nonprofits must <a href="#">register to participate</a> each year, and may be required to attend
                    a training session at the The Greater Area Foundation. Training session information will be included in
                    the registration confirmation from The Greater Area Foundation, or sign up for a training session <a href="#">here</a>.
                </p>

                <h2>Why is my gift to Firespring Foundation?</h2>

                <p>
                    All donations on <a href="#">Give To Our City website</a> will be made to the Firespring Foundation; a 501(c)(3)
                    tax-exempt organization which permits donors to advise a re-granting of their donations to other IRS recognized
                    qualifying 501(c)(3) organizations. Firespring Foundation will re-grant 97.1% of each contribution to the
                    qualifying organization as advised by the donor, retaining 2.9% plus $.30 per transaction for credit card
                    transaction costs.
                </p>

                <h2>Is there a minimum donation?</h2>

                <p>
                    The minimum donation on <a href="#">Give To Our City</a> is $10. There is a maximum donation limit
                    of $10,000 per nonprofit per household.
                </p>

                <h2>Is there a limit to the amount an organization can receive on Give To Our City?</h2>

                <p>
                    There is no maximum amount an organization may receive.
                </p>

                <h2>Are there restrictions on the match fund grants?</h2>

                <p>
                    Gifts made to satisfy prior pledges are not eligible for matching funds. Household gifts exceeding $10,000 per nonprofit
                    will be eligible for match fund dollars up to $10,000, and any amount in excess of $10,000 will not be eligible
                    for the match fund. The Greater Area Foundation reserves the right to deny, condition or modify the distribution
                    of match grants if deemed necessary in the judgment of its Board of Directors.
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