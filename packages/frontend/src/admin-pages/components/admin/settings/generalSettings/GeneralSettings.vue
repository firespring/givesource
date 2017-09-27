<template>
    <div class="o-app">
        <navigation></navigation>

        <main class="o-app__main o-app__main--compact">
            <div class="o-app_main-content o-app_main-content--md">


                <div class="o-page-header">
                    <div class="o-page-header__text">
                        <nav class="o-page-header-nav c-breadcrumb">
                            <span><router-link :to="{ name: 'settings-list' }">Settings</router-link></span>
                        </nav>
                        <h1 class="o-page-header-title">General Settings</h1>
                    </div>
                </div>

                <div class="o-app-main-content">

                    <form>
                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">
                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">Giving Day Event Info</h2>
                                </div>
                            </header>

                            <div class="c-page-section__main">

                                <div class="c-form-item c-form-item--text c-form-item--required">
                                    <div class="c-form-item__label">
                                        <label for="eventTitle" class="c-form-item-label-text">Event Title</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <input type="text" name="eventTitle" id="eventTitle" maxlength="200" value="">
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--date c-form-item--required">
                                    <div class="c-form-item__label">
                                        <label for="dateEvent" class="c-form-item-label-text">Event Date</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <forms-datetime v-model="formData.dateEvent" name="dateEvent" id="dateEvent"></forms-datetime>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--url c-form-item--required">
                                    <div class="c-form-item__label">
                                        <label for="eventUrl" class="c-form-item-label-text">Event URL</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <div class="u-control-icon u-control-icon--url">
                                            <input type="url" name="eventUrl" id="eventUrl" maxlength="200" value="" placeholder="http://">
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--tel">
                                    <div class="c-form-item__label">
                                        <label for="phoneNum" class="c-form-item-label-text">Contact Phone #</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <div class="u-control-icon u-control-icon--tel">
                                            <input type="tel" name="phoneNum" id="phoneNum">
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--combobox">
                                    <div class="c-form-item__label">
                                        <label for="eventTimezone" class="c-form-item-label-text">Time Zone</label>
                                    </div>

                                    <div class="c-form-item__control">
                                        <select id="eventTimezone" name="eventTimezone" class="combobox js-combobox" data-placeholder="Select A Time Zone" style="display: none;">
                                            <option value="" selected=""></option>
                                            <option data-offset="-39600" value="International Date Line West">(GMT-11:00) International Date Line West</option>
                                            <option data-offset="-39600" value="Midway Island">(GMT-11:00) Midway Island</option>
                                            <option data-offset="-39600" value="Samoa">(GMT-11:00) Samoa</option>
                                            <option data-offset="-36000" value="Hawaii">(GMT-10:00) Hawaii</option>
                                            <option data-offset="-32400" value="Alaska">(GMT-09:00) Alaska</option>
                                            <option data-offset="-28800" value="Pacific Time (US &amp; Canada)">(GMT-08:00) Pacific Time (US &amp; Canada)</option>
                                            <option data-offset="-28800" value="Tijuana">(GMT-08:00) Tijuana</option>
                                            <option data-offset="-25200" value="Mountain Time (US &amp; Canada)">(GMT-07:00) Mountain Time (US &amp; Canada)</option>
                                            <option data-offset="-25200" value="Arizona">(GMT-07:00) Arizona</option>
                                            <option data-offset="-25200" value="Chihuahua">(GMT-07:00) Chihuahua</option>
                                            <option data-offset="-25200" value="Mazatlan">(GMT-07:00) Mazatlan</option>
                                            <option data-offset="-21600" value="Central Time (US &amp; Canada)" selected="">(GMT-06:00) Central Time (US &amp; Canada)</option>
                                            <option data-offset="-21600" value="Saskatchewan">(GMT-06:00) Saskatchewan</option>
                                            <option data-offset="-21600" value="Guadalajara">(GMT-06:00) Guadalajara</option>
                                            <option data-offset="-21600" value="Mexico City">(GMT-06:00) Mexico City</option>
                                            <option data-offset="-21600" value="Monterrey">(GMT-06:00) Monterrey</option>
                                            <option data-offset="-21600" value="Central America">(GMT-06:00) Central America</option>
                                            <option data-offset="-18000" value="Eastern Time (US &amp; Canada)">(GMT-05:00) Eastern Time (US &amp; Canada)</option>
                                            <option data-offset="-18000" value="Indiana (East)">(GMT-05:00) Indiana (East)</option>
                                            <option data-offset="-18000" value="Bogota">(GMT-05:00) Bogota</option>
                                            <option data-offset="-18000" value="Lima">(GMT-05:00) Lima</option>
                                            <option data-offset="-18000" value="Quito">(GMT-05:00) Quito</option>
                                            <option data-offset="-14400" value="Atlantic Time (Canada)">(GMT-04:00) Atlantic Time (Canada)</option>
                                            <option data-offset="-14400" value="Caracas">(GMT-04:00) Caracas</option>
                                            <option data-offset="-14400" value="La Paz">(GMT-04:00) La Paz</option>
                                            <option data-offset="-14400" value="Georgetown">(GMT-04:00) Georgetown</option>
                                            <option data-offset="-12600" value="Newfoundland">(GMT-03:30) Newfoundland</option>
                                            <option data-offset="-10800" value="Santiago">(GMT-03:00) Santiago</option>
                                            <option data-offset="-10800" value="Buenos Aires">(GMT-03:00) Buenos Aires</option>
                                            <option data-offset="-10800" value="Greenland">(GMT-03:00) Greenland</option>
                                            <option data-offset="-7200" value="Brasilia">(GMT-02:00) Brasilia</option>
                                            <option data-offset="-7200" value="Mid-Atlantic">(GMT-02:00) Mid-Atlantic</option>
                                            <option data-offset="-3600" value="Azores">(GMT-01:00) Azores</option>
                                            <option data-offset="-3600" value="Cape Verde Is.">(GMT-01:00) Cape Verde Is.</option>
                                            <option data-offset="0" value="Dublin">(GMT) Dublin</option>
                                            <option data-offset="0" value="Edinburgh">(GMT) Edinburgh</option>
                                            <option data-offset="0" value="Lisbon">(GMT) Lisbon</option>
                                            <option data-offset="0" value="London">(GMT) London</option>
                                            <option data-offset="0" value="Casablanca">(GMT) Casablanca</option>
                                            <option data-offset="0" value="Monrovia">(GMT) Monrovia</option>
                                            <option data-offset="0" value="UTC">(GMT) UTC</option>
                                            <option data-offset="3600" value="Belgrade">(GMT+01:00) Belgrade</option>
                                            <option data-offset="3600" value="Bratislava">(GMT+01:00) Bratislava</option>
                                            <option data-offset="3600" value="Budapest">(GMT+01:00) Budapest</option>
                                            <option data-offset="3600" value="Ljubljana">(GMT+01:00) Ljubljana</option>
                                            <option data-offset="3600" value="Prague">(GMT+01:00) Prague</option>
                                            <option data-offset="3600" value="Sarajevo">(GMT+01:00) Sarajevo</option>
                                            <option data-offset="3600" value="Skopje">(GMT+01:00) Skopje</option>
                                            <option data-offset="3600" value="Warsaw">(GMT+01:00) Warsaw</option>
                                            <option data-offset="3600" value="Zagreb">(GMT+01:00) Zagreb</option>
                                            <option data-offset="3600" value="Brussels">(GMT+01:00) Brussels</option>
                                            <option data-offset="3600" value="Copenhagen">(GMT+01:00) Copenhagen</option>
                                            <option data-offset="3600" value="Madrid">(GMT+01:00) Madrid</option>
                                            <option data-offset="3600" value="Paris">(GMT+01:00) Paris</option>
                                            <option data-offset="3600" value="Amsterdam">(GMT+01:00) Amsterdam</option>
                                            <option data-offset="3600" value="Berlin">(GMT+01:00) Berlin</option>
                                            <option data-offset="3600" value="Bern">(GMT+01:00) Bern</option>
                                            <option data-offset="3600" value="Rome">(GMT+01:00) Rome</option>
                                            <option data-offset="3600" value="Stockholm">(GMT+01:00) Stockholm</option>
                                            <option data-offset="3600" value="Vienna">(GMT+01:00) Vienna</option>
                                            <option data-offset="3600" value="West Central Africa">(GMT+01:00) West Central Africa</option>
                                            <option data-offset="7200" value="Bucharest">(GMT+02:00) Bucharest</option>
                                            <option data-offset="7200" value="Cairo">(GMT+02:00) Cairo</option>
                                            <option data-offset="7200" value="Helsinki">(GMT+02:00) Helsinki</option>
                                            <option data-offset="7200" value="Kiev">(GMT+02:00) Kiev</option>
                                            <option data-offset="7200" value="Kyiv">(GMT+02:00) Kyiv</option>
                                            <option data-offset="7200" value="Riga">(GMT+02:00) Riga</option>
                                            <option data-offset="7200" value="Sofia">(GMT+02:00) Sofia</option>
                                            <option data-offset="7200" value="Tallinn">(GMT+02:00) Tallinn</option>
                                            <option data-offset="7200" value="Vilnius">(GMT+02:00) Vilnius</option>
                                            <option data-offset="7200" value="Athens">(GMT+02:00) Athens</option>
                                            <option data-offset="7200" value="Istanbul">(GMT+02:00) Istanbul</option>
                                            <option data-offset="7200" value="Jerusalem">(GMT+02:00) Jerusalem</option>
                                            <option data-offset="7200" value="Harare">(GMT+02:00) Harare</option>
                                            <option data-offset="7200" value="Pretoria">(GMT+02:00) Pretoria</option>
                                            <option data-offset="10800" value="Minsk">(GMT+03:00) Minsk</option>
                                            <option data-offset="10800" value="Moscow">(GMT+03:00) Moscow</option>
                                            <option data-offset="10800" value="St. Petersburg">(GMT+03:00) St. Petersburg</option>
                                            <option data-offset="10800" value="Volgograd">(GMT+03:00) Volgograd</option>
                                            <option data-offset="10800" value="Kuwait">(GMT+03:00) Kuwait</option>
                                            <option data-offset="10800" value="Riyadh">(GMT+03:00) Riyadh</option>
                                            <option data-offset="10800" value="Nairobi">(GMT+03:00) Nairobi</option>
                                            <option data-offset="10800" value="Baghdad">(GMT+03:00) Baghdad</option>
                                            <option data-offset="12600" value="Tehran">(GMT+03:30) Tehran</option>
                                            <option data-offset="14400" value="Abu Dhabi">(GMT+04:00) Abu Dhabi</option>
                                            <option data-offset="14400" value="Muscat">(GMT+04:00) Muscat</option>
                                            <option data-offset="14400" value="Baku">(GMT+04:00) Baku</option>
                                            <option data-offset="14400" value="Tbilisi">(GMT+04:00) Tbilisi</option>
                                            <option data-offset="14400" value="Yerevan">(GMT+04:00) Yerevan</option>
                                            <option data-offset="16200" value="Kabul">(GMT+04:30) Kabul</option>
                                            <option data-offset="18000" value="Ekaterinburg">(GMT+05:00) Ekaterinburg</option>
                                            <option data-offset="18000" value="Islamabad">(GMT+05:00) Islamabad</option>
                                            <option data-offset="18000" value="Karachi">(GMT+05:00) Karachi</option>
                                            <option data-offset="18000" value="Tashkent">(GMT+05:00) Tashkent</option>
                                            <option data-offset="19800" value="Chennai">(GMT+05:30) Chennai</option>
                                            <option data-offset="19800" value="Kolkata">(GMT+05:30) Kolkata</option>
                                            <option data-offset="19800" value="Mumbai">(GMT+05:30) Mumbai</option>
                                            <option data-offset="19800" value="New Delhi">(GMT+05:30) New Delhi</option>
                                            <option data-offset="19800" value="Sri Jayawardenepura">(GMT+05:30) Sri Jayawardenepura</option>
                                            <option data-offset="20700" value="Kathmandu">(GMT+05:45) Kathmandu</option>
                                            <option data-offset="21600" value="Astana">(GMT+06:00) Astana</option>
                                            <option data-offset="21600" value="Dhaka">(GMT+06:00) Dhaka</option>
                                            <option data-offset="21600" value="Almaty">(GMT+06:00) Almaty</option>
                                            <option data-offset="21600" value="Novosibirsk">(GMT+06:00) Novosibirsk</option>
                                            <option data-offset="21600" value="Urumqi">(GMT+06:00) Urumqi</option>
                                            <option data-offset="23400" value="Rangoon">(GMT+06:30) Rangoon</option>
                                            <option data-offset="25200" value="Bangkok">(GMT+07:00) Bangkok</option>
                                            <option data-offset="25200" value="Hanoi">(GMT+07:00) Hanoi</option>
                                            <option data-offset="25200" value="Jakarta">(GMT+07:00) Jakarta</option>
                                            <option data-offset="25200" value="Krasnoyarsk">(GMT+07:00) Krasnoyarsk</option>
                                            <option data-offset="28800" value="Beijing">(GMT+08:00) Beijing</option>
                                            <option data-offset="28800" value="Chongqing">(GMT+08:00) Chongqing</option>
                                            <option data-offset="28800" value="Hong Kong">(GMT+08:00) Hong Kong</option>
                                            <option data-offset="28800" value="Kuala Lumpur">(GMT+08:00) Kuala Lumpur</option>
                                            <option data-offset="28800" value="Singapore">(GMT+08:00) Singapore</option>
                                            <option data-offset="28800" value="Taipei">(GMT+08:00) Taipei</option>
                                            <option data-offset="28800" value="Perth">(GMT+08:00) Perth</option>
                                            <option data-offset="28800" value="Irkutsk">(GMT+08:00) Irkutsk</option>
                                            <option data-offset="28800" value="Ulaan Bataar">(GMT+08:00) Ulaan Bataar</option>
                                            <option data-offset="32400" value="Seoul">(GMT+09:00) Seoul</option>
                                            <option data-offset="32400" value="Osaka">(GMT+09:00) Osaka</option>
                                            <option data-offset="32400" value="Sapporo">(GMT+09:00) Sapporo</option>
                                            <option data-offset="32400" value="Tokyo">(GMT+09:00) Tokyo</option>
                                            <option data-offset="32400" value="Yakutsk">(GMT+09:00) Yakutsk</option>
                                            <option data-offset="34200" value="Darwin">(GMT+09:30) Darwin</option>
                                            <option data-offset="36000" value="Brisbane">(GMT+10:00) Brisbane</option>
                                            <option data-offset="36000" value="Vladivostok">(GMT+10:00) Vladivostok</option>
                                            <option data-offset="36000" value="Guam">(GMT+10:00) Guam</option>
                                            <option data-offset="36000" value="Port Moresby">(GMT+10:00) Port Moresby</option>
                                            <option data-offset="36000" value="Solomon Is.">(GMT+10:00) Solomon Is.</option>
                                            <option data-offset="37800" value="Adelaide">(GMT+10:30) Adelaide</option>
                                            <option data-offset="39600" value="Canberra">(GMT+11:00) Canberra</option>
                                            <option data-offset="39600" value="Melbourne">(GMT+11:00) Melbourne</option>
                                            <option data-offset="39600" value="Sydney">(GMT+11:00) Sydney</option>
                                            <option data-offset="39600" value="Hobart">(GMT+11:00) Hobart</option>
                                            <option data-offset="39600" value="Magadan">(GMT+11:00) Magadan</option>
                                            <option data-offset="39600" value="New Caledonia">(GMT+11:00) New Caledonia</option>
                                            <option data-offset="43200" value="Kamchatka">(GMT+12:00) Kamchatka</option>
                                            <option data-offset="43200" value="Marshall Is.">(GMT+12:00) Marshall Is.</option>
                                            <option data-offset="46800" value="Fiji">(GMT+13:00) Fiji</option>
                                            <option data-offset="46800" value="Auckland">(GMT+13:00) Auckland</option>
                                            <option data-offset="46800" value="Wellington">(GMT+13:00) Wellington</option>
                                            <option data-offset="46800" value="Nuku'alofa">(GMT+13:00) Nuku'alofa</option>
                                        </select><div class="chosen-container chosen-container-single" style="width: 100%;" title="" id="eventTimezone_chosen"><a class="chosen-single chosen-single-with-deselect"><span>(GMT-06:00) Central Time (US &amp; Canada)</span><abbr class="search-choice-close"></abbr><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off"></div><ul class="chosen-results"></ul></div></div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="c-page-section c-page-section--border c-page-section--shadow c-page-section--segmented">

                            <header class="c-page-section__header">
                                <div class="c-page-section-header-text">
                                    <h2 class="c-page-section-title">Giving Day Event Stages</h2>
                                </div>
                            </header>

                            <div class="c-page-section__main">

                                <div class="c-form-item c-form-item--date c-form-item--date-range">
                                    <div class="c-form-item__label">
                                        <label for="dateRegistrationsStart" class="c-form-item-label-text">When do you accept nonprofit registrations?</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <div class="c-form-control-grid u-items-center">
                                            <div class="c-form-control-grid__item u-flex-collapse">
                                                <forms-datetime v-model="formData.dateRegistrationsStart" name="dateRegistrationsStart" id="dateRegistrationsStart"
                                                                placeholder="Start" :maxDate="dateRegistrationsMaxDate"></forms-datetime>
                                            </div>
                                            <div class="c-form-control-grid__separator">
                                                to
                                            </div>
                                            <div class="c-form-control-grid__item u-flex-collapse">
                                                <forms-datetime v-model="formData.dateRegistrationsEnd" name="dateRegistrationsEnd" id="dateRegistrationsEnd"
                                                                placeholder="End" :minDate="dateRegistrationsMinDate"></forms-datetime>
                                            </div>
                                        </div>
                                        <div class="c-notes c-notes--below">
                                            During this time range, nonprofits in your community can register to create their own landing pages. If no range is specified, then nonprofits can start registering 30 days before your event's start date up until the date of your event.
                                        </div>
                                    </div>
                                </div>

                                <div class="c-form-item c-form-item--date c-form-item--date-range">
                                    <div class="c-form-item__label">
                                        <label for="dateAcceptDonationsStart" class="c-form-item-label-text">When do you accept donations?</label>
                                    </div>
                                    <div class="c-form-item__control">
                                        <div class="c-form-control-grid u-items-center">
                                            <div class="c-form-control-grid__item u-flex-collapse">
                                                <forms-datetime v-model="formData.dateAcceptDonationsStart" name="dateAcceptDonationsStart" id="dateAcceptDonationsStart"
                                                                placeholder="Start" :maxDate="dateAcceptDonationsMaxDate"></forms-datetime>
                                            </div>
                                            <div class="c-form-control-grid__separator">
                                                to
                                            </div>
                                            <div class="c-form-control-grid__item u-flex-collapse">
                                                <forms-datetime v-model="formData.dateAcceptDonationsEnd" name="dateAcceptDonationsEnd" id="dateAcceptDonationsEnd"
                                                                placeholder="End" :minDate="dateAcceptDonationsMinDate"></forms-datetime>
                                            </div>
                                        </div>
                                        <div class="c-notes c-notes--below">
                                            During this time range, visitors to your site can make donations to any registered and verified nonprofits. If no range is specified, then donations will only be accepted on the actual date your event.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>


                        <footer class="c-form-actions">
                            <button type="submit" class="c-btn">Save Changes</button>
                            <router-link :to="{ name: 'settings-list' }" class="c-btn c-btn--neutral c-btn--text">Cancel</router-link>
                        </footer>
                    </form>

                </div>
            </div>
        </main>
    </div>
</template>

<script>
    module.exports = {
    	data: function () {
    		return {

    			// Form Data
                formData: {
	                dateEvent: '',
                    dateRegistrationsStart: '',
                    dateRegistrationsEnd: '',
	                dateAcceptDonationsStart: '',
	                dateAcceptDonationsEnd: '',
                }

            };
        },
        computed: {
	        dateRegistrationsMinDate: function () {
		        return this.formData.dateRegistrationsStart ? this.formData.dateRegistrationsStart : false;
	        },
    		dateRegistrationsMaxDate: function () {
    			return this.formData.dateRegistrationsEnd ? this.formData.dateRegistrationsEnd : false;
            },
	        dateAcceptDonationsMinDate: function () {
	        	return this.formData.dateAcceptDonationsStart ? this.formData.dateAcceptDonationsStart : false;
            },
	        dateAcceptDonationsMaxDate: function () {
    			return this.formData.dateAcceptDonationsEnd ? this.formData.dateAcceptDonationsEnd : false;
            }
        },
        components: {
    		'forms-datetime': require('./../../../forms/Datetime.vue')
        }
    };
</script>