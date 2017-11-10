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
    <select v-model="localValue" :id="id" :name="name" class="combobox" :data-placeholder="placeholder" ref="select" :class="{'has-error': hasError}">
        <option value=""></option>
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
    </select>
</template>

<script>
	require('chosen-js');

    module.exports = {
    	data: function () {
    		return {
    			localValue: '',
            };
        },
        computed: {
	        selectedValue: function () {
	        	return this.localValue;
	        }
        },
        props: {
    		value: {},
            id: {
    			type: String,
                default: null,
            },
	        name: {
		        type: String,
		        default: null
	        },
            placeholder: {
    			type: String,
                default: 'Select A Time Zone'
            },
	        hasError: {
		        type: Boolean,
		        default: false
	        }
        },
        mounted: function () {
    		const vue = this;

    		$(vue.$refs.select).chosen({
			    allow_single_deselect: true,
			    width: '100%'
		    }).change(function () {
		    	vue.localValue = $(this).val();
            });
        },
	    watch: {
		    localValue: function (value, oldValue) {
			    const vue = this;
			    if (value === oldValue) {
				    return;
			    }
			    vue.$emit('input', vue.selectedValue);
		    },
		    value: function (value, oldValue) {
			    const vue = this;
			    if (value === oldValue) {
				    return;
			    }
			    vue.localValue = value;
			    $(vue.$refs.select).val(value);
			    $(vue.$refs.select).trigger("chosen:updated");
		    }
	    }
    };
</script>