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
    ref="select"
    v-model="localValue"
    :name="name"
    class="combobox"
    :data-placeholder="placeholder"
    :class="{'has-error': hasError}"
  >
    <option value="" />
    <option
      v-for="zone in timezones"
      :value="zone.timezone"
    >
      {{ zone.name }}
    </option>
  </select>
</template>

<script>
require('chosen-js')

export default {
  emits: ['update:modelValue'],
  props: {
    modelValue: { type: String, default: null },
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
      default: 'Select A Time Zone'
    },
    hasError: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      localValue: '',

      timezones: [
        {
          timezone: 'America/Adak',
          name: '(GMT-10:00) America/Adak (Hawaii-Aleutian Standard Time)'
        },
        {
          timezone: 'America/Atka',
          name: '(GMT-10:00) America/Atka (Hawaii-Aleutian Standard Time)'
        },
        {
          timezone: 'America/Anchorage',
          name: '(GMT-9:00) America/Anchorage (Alaska Standard Time)'
        },
        {
          timezone: 'America/Juneau',
          name: '(GMT-9:00) America/Juneau (Alaska Standard Time)'
        },
        {
          timezone: 'America/Nome',
          name: '(GMT-9:00) America/Nome (Alaska Standard Time)'
        },
        {
          timezone: 'America/Yakutat',
          name: '(GMT-9:00) America/Yakutat (Alaska Standard Time)'
        },
        {
          timezone: 'America/Dawson',
          name: '(GMT-8:00) America/Dawson (Pacific Standard Time)'
        },
        {
          timezone: 'America/Ensenada',
          name: '(GMT-8:00) America/Ensenada (Pacific Standard Time)'
        },
        {
          timezone: 'America/Los_Angeles',
          name: '(GMT-8:00) America/Los_Angeles (Pacific Standard Time)'
        },
        {
          timezone: 'America/Tijuana',
          name: '(GMT-8:00) America/Tijuana (Pacific Standard Time)'
        },
        {
          timezone: 'America/Vancouver',
          name: '(GMT-8:00) America/Vancouver (Pacific Standard Time)'
        },
        {
          timezone: 'America/Whitehorse',
          name: '(GMT-8:00) America/Whitehorse (Pacific Standard Time)'
        },
        {
          timezone: 'Canada/Pacific',
          name: '(GMT-8:00) Canada/Pacific (Pacific Standard Time)'
        },
        {
          timezone: 'Canada/Yukon',
          name: '(GMT-8:00) Canada/Yukon (Pacific Standard Time)'
        },
        {
          timezone: 'Mexico/BajaNorte',
          name: '(GMT-8:00) Mexico/BajaNorte (Pacific Standard Time)'
        },
        {
          timezone: 'America/Boise',
          name: '(GMT-7:00) America/Boise (Mountain Standard Time)'
        },
        {
          timezone: 'America/Cambridge_Bay',
          name: '(GMT-7:00) America/Cambridge_Bay (Mountain Standard Time)'
        },
        {
          timezone: 'America/Chihuahua',
          name: '(GMT-7:00) America/Chihuahua (Mountain Standard Time)'
        },
        {
          timezone: 'America/Dawson_Creek',
          name: '(GMT-7:00) America/Dawson_Creek (Mountain Standard Time)'
        },
        {
          timezone: 'America/Denver',
          name: '(GMT-7:00) America/Denver (Mountain Standard Time)'
        },
        {
          timezone: 'America/Edmonton',
          name: '(GMT-7:00) America/Edmonton (Mountain Standard Time)'
        },
        {
          timezone: 'America/Hermosillo',
          name: '(GMT-7:00) America/Hermosillo (Mountain Standard Time)'
        },
        {
          timezone: 'America/Inuvik',
          name: '(GMT-7:00) America/Inuvik (Mountain Standard Time)'
        },
        {
          timezone: 'America/Mazatlan',
          name: '(GMT-7:00) America/Mazatlan (Mountain Standard Time)'
        },
        {
          timezone: 'America/Phoenix',
          name: '(GMT-7:00) America/Phoenix (Mountain Standard Time)'
        },
        {
          timezone: 'America/Shiprock',
          name: '(GMT-7:00) America/Shiprock (Mountain Standard Time)'
        },
        {
          timezone: 'America/Yellowknife',
          name: '(GMT-7:00) America/Yellowknife (Mountain Standard Time)'
        },
        {
          timezone: 'Canada/Mountain',
          name: '(GMT-7:00) Canada/Mountain (Mountain Standard Time)'
        },
        {
          timezone: 'Mexico/BajaSur',
          name: '(GMT-7:00) Mexico/BajaSur (Mountain Standard Time)'
        },
        {
          timezone: 'America/Belize',
          name: '(GMT-6:00) America/Belize (Central Standard Time)'
        },
        {
          timezone: 'America/Cancun',
          name: '(GMT-6:00) America/Cancun (Central Standard Time)'
        },
        {
          timezone: 'America/Chicago',
          name: '(GMT-6:00) America/Chicago (Central Standard Time)'
        },
        {
          timezone: 'America/Costa_Rica',
          name: '(GMT-6:00) America/Costa_Rica (Central Standard Time)'
        },
        {
          timezone: 'America/El_Salvador',
          name: '(GMT-6:00) America/El_Salvador (Central Standard Time)'
        },
        {
          timezone: 'America/Guatemala',
          name: '(GMT-6:00) America/Guatemala (Central Standard Time)'
        },
        {
          timezone: 'America/Knox_IN',
          name: '(GMT-6:00) America/Knox_IN (Central Standard Time)'
        },
        {
          timezone: 'America/Managua',
          name: '(GMT-6:00) America/Managua (Central Standard Time)'
        },
        {
          timezone: 'America/Menominee',
          name: '(GMT-6:00) America/Menominee (Central Standard Time)'
        },
        {
          timezone: 'America/Merida',
          name: '(GMT-6:00) America/Merida (Central Standard Time)'
        },
        {
          timezone: 'America/Mexico_City',
          name: '(GMT-6:00) America/Mexico_City (Central Standard Time)'
        },
        {
          timezone: 'America/Monterrey',
          name: '(GMT-6:00) America/Monterrey (Central Standard Time)'
        },
        {
          timezone: 'America/Rainy_River',
          name: '(GMT-6:00) America/Rainy_River (Central Standard Time)'
        },
        {
          timezone: 'America/Rankin_Inlet',
          name: '(GMT-6:00) America/Rankin_Inlet (Central Standard Time)'
        },
        {
          timezone: 'America/Regina',
          name: '(GMT-6:00) America/Regina (Central Standard Time)'
        },
        {
          timezone: 'America/Swift_Current',
          name: '(GMT-6:00) America/Swift_Current (Central Standard Time)'
        },
        {
          timezone: 'America/Tegucigalpa',
          name: '(GMT-6:00) America/Tegucigalpa (Central Standard Time)'
        },
        {
          timezone: 'America/Winnipeg',
          name: '(GMT-6:00) America/Winnipeg (Central Standard Time)'
        },
        {
          timezone: 'Canada/Central',
          name: '(GMT-6:00) Canada/Central (Central Standard Time)'
        },
        {
          timezone: 'Canada/East-Saskatchewan',
          name: '(GMT-6:00) Canada/East-Saskatchewan (Central Standard Time)'
        },
        {
          timezone: 'Canada/Saskatchewan',
          name: '(GMT-6:00) Canada/Saskatchewan (Central Standard Time)'
        },
        {
          timezone: 'Chile/EasterIsland',
          name: '(GMT-6:00) Chile/EasterIsland (Easter Is. Time)'
        },
        {
          timezone: 'Mexico/General',
          name: '(GMT-6:00) Mexico/General (Central Standard Time)'
        },
        {
          timezone: 'America/Atikokan',
          name: '(GMT-5:00) America/Atikokan (Eastern Standard Time)'
        },
        {
          timezone: 'America/Bogota',
          name: '(GMT-5:00) America/Bogota (Colombia Time)'
        },
        {
          timezone: 'America/Cayman',
          name: '(GMT-5:00) America/Cayman (Eastern Standard Time)'
        },
        {
          timezone: 'America/Coral_Harbour',
          name: '(GMT-5:00) America/Coral_Harbour (Eastern Standard Time)'
        },
        {
          timezone: 'America/Detroit',
          name: '(GMT-5:00) America/Detroit (Eastern Standard Time)'
        },
        {
          timezone: 'America/Fort_Wayne',
          name: '(GMT-5:00) America/Fort_Wayne (Eastern Standard Time)'
        },
        {
          timezone: 'America/Grand_Turk',
          name: '(GMT-5:00) America/Grand_Turk (Eastern Standard Time)'
        },
        {
          timezone: 'America/Guayaquil',
          name: '(GMT-5:00) America/Guayaquil (Ecuador Time)'
        },
        {
          timezone: 'America/Havana',
          name: '(GMT-5:00) America/Havana (Cuba Standard Time)'
        },
        {
          timezone: 'America/Indianapolis',
          name: '(GMT-5:00) America/Indianapolis (Eastern Standard Time)'
        },
        {
          timezone: 'America/Iqaluit',
          name: '(GMT-5:00) America/Iqaluit (Eastern Standard Time)'
        },
        {
          timezone: 'America/Jamaica',
          name: '(GMT-5:00) America/Jamaica (Eastern Standard Time)'
        },
        {
          timezone: 'America/Lima',
          name: '(GMT-5:00) America/Lima (Peru Time)'
        },
        {
          timezone: 'America/Louisville',
          name: '(GMT-5:00) America/Louisville (Eastern Standard Time)'
        },
        {
          timezone: 'America/Montreal',
          name: '(GMT-5:00) America/Montreal (Eastern Standard Time)'
        },
        {
          timezone: 'America/Nassau',
          name: '(GMT-5:00) America/Nassau (Eastern Standard Time)'
        },
        {
          timezone: 'America/New_York',
          name: '(GMT-5:00) America/New_York (Eastern Standard Time)'
        },
        {
          timezone: 'America/Nipigon',
          name: '(GMT-5:00) America/Nipigon (Eastern Standard Time)'
        },
        {
          timezone: 'America/Panama',
          name: '(GMT-5:00) America/Panama (Eastern Standard Time)'
        },
        {
          timezone: 'America/Pangnirtung',
          name: '(GMT-5:00) America/Pangnirtung (Eastern Standard Time)'
        },
        {
          timezone: 'America/Port-au-Prince',
          name: '(GMT-5:00) America/Port-au-Prince (Eastern Standard Time)'
        },
        {
          timezone: 'America/Resolute',
          name: '(GMT-5:00) America/Resolute (Eastern Standard Time)'
        },
        {
          timezone: 'America/Thunder_Bay',
          name: '(GMT-5:00) America/Thunder_Bay (Eastern Standard Time)'
        },
        {
          timezone: 'America/Toronto',
          name: '(GMT-5:00) America/Toronto (Eastern Standard Time)'
        },
        {
          timezone: 'Canada/Eastern',
          name: '(GMT-5:00) Canada/Eastern (Eastern Standard Time)'
        },
        {
          timezone: 'America/Caracas',
          name: '(GMT-4:-30) America/Caracas (Venezuela Time)'
        },
        {
          timezone: 'America/Anguilla',
          name: '(GMT-4:00) America/Anguilla (Atlantic Standard Time)'
        },
        {
          timezone: 'America/Antigua',
          name: '(GMT-4:00) America/Antigua (Atlantic Standard Time)'
        },
        {
          timezone: 'America/Aruba',
          name: '(GMT-4:00) America/Aruba (Atlantic Standard Time)'
        },
        {
          timezone: 'America/Asuncion',
          name: '(GMT-4:00) America/Asuncion (Paraguay Time)'
        },
        {
          timezone: 'America/Barbados',
          name: '(GMT-4:00) America/Barbados (Atlantic Standard Time)'
        },
        {
          timezone: 'America/Blanc-Sablon',
          name: '(GMT-4:00) America/Blanc-Sablon (Atlantic Standard Time)'
        },
        {
          timezone: 'America/Boa_Vista',
          name: '(GMT-4:00) America/Boa_Vista (Amazon Time)'
        },
        {
          timezone: 'America/Campo_Grande',
          name: '(GMT-4:00) America/Campo_Grande (Amazon Time)'
        },
        {
          timezone: 'America/Cuiaba',
          name: '(GMT-4:00) America/Cuiaba (Amazon Time)'
        },
        {
          timezone: 'America/Curacao',
          name: '(GMT-4:00) America/Curacao (Atlantic Standard Time)'
        },
        {
          timezone: 'America/Dominica',
          name: '(GMT-4:00) America/Dominica (Atlantic Standard Time)'
        },
        {
          timezone: 'America/Eirunepe',
          name: '(GMT-4:00) America/Eirunepe (Amazon Time)'
        },
        {
          timezone: 'America/Glace_Bay',
          name: '(GMT-4:00) America/Glace_Bay (Atlantic Standard Time)'
        },
        {
          timezone: 'America/Goose_Bay',
          name: '(GMT-4:00) America/Goose_Bay (Atlantic Standard Time)'
        },
        {
          timezone: 'America/Grenada',
          name: '(GMT-4:00) America/Grenada (Atlantic Standard Time)'
        },
        {
          timezone: 'America/Guadeloupe',
          name: '(GMT-4:00) America/Guadeloupe (Atlantic Standard Time)'
        },
        {
          timezone: 'America/Guyana',
          name: '(GMT-4:00) America/Guyana (Guyana Time)'
        },
        {
          timezone: 'America/Halifax',
          name: '(GMT-4:00) America/Halifax (Atlantic Standard Time)'
        },
        {
          timezone: 'America/La_Paz',
          name: '(GMT-4:00) America/La_Paz (Bolivia Time)'
        },
        {
          timezone: 'America/Manaus',
          name: '(GMT-4:00) America/Manaus (Amazon Time)'
        },
        {
          timezone: 'America/Marigot',
          name: '(GMT-4:00) America/Marigot (Atlantic Standard Time)'
        },
        {
          timezone: 'America/Martinique',
          name: '(GMT-4:00) America/Martinique (Atlantic Standard Time)'
        },
        {
          timezone: 'America/Moncton',
          name: '(GMT-4:00) America/Moncton (Atlantic Standard Time)'
        },
        {
          timezone: 'America/Montserrat',
          name: '(GMT-4:00) America/Montserrat (Atlantic Standard Time)'
        },
        {
          timezone: 'America/Port_of_Spain',
          name: '(GMT-4:00) America/Port_of_Spain (Atlantic Standard Time)'
        },
        {
          timezone: 'America/Porto_Acre',
          name: '(GMT-4:00) America/Porto_Acre (Amazon Time)'
        },
        {
          timezone: 'America/Porto_Velho',
          name: '(GMT-4:00) America/Porto_Velho (Amazon Time)'
        },
        {
          timezone: 'America/Puerto_Rico',
          name: '(GMT-4:00) America/Puerto_Rico (Atlantic Standard Time)'
        },
        {
          timezone: 'America/Rio_Branco',
          name: '(GMT-4:00) America/Rio_Branco (Amazon Time)'
        },
        {
          timezone: 'America/Santiago',
          name: '(GMT-4:00) America/Santiago (Chile Time)'
        },
        {
          timezone: 'America/Santo_Domingo',
          name: '(GMT-4:00) America/Santo_Domingo (Atlantic Standard Time)'
        },
        {
          timezone: 'America/St_Barthelemy',
          name: '(GMT-4:00) America/St_Barthelemy (Atlantic Standard Time)'
        },
        {
          timezone: 'America/St_Kitts',
          name: '(GMT-4:00) America/St_Kitts (Atlantic Standard Time)'
        },
        {
          timezone: 'America/St_Lucia',
          name: '(GMT-4:00) America/St_Lucia (Atlantic Standard Time)'
        },
        {
          timezone: 'America/St_Thomas',
          name: '(GMT-4:00) America/St_Thomas (Atlantic Standard Time)'
        },
        {
          timezone: 'America/St_Vincent',
          name: '(GMT-4:00) America/St_Vincent (Atlantic Standard Time)'
        },
        {
          timezone: 'America/Thule',
          name: '(GMT-4:00) America/Thule (Atlantic Standard Time)'
        },
        {
          timezone: 'America/Tortola',
          name: '(GMT-4:00) America/Tortola (Atlantic Standard Time)'
        },
        {
          timezone: 'America/Virgin',
          name: '(GMT-4:00) America/Virgin (Atlantic Standard Time)'
        },
        {
          timezone: 'Antarctica/Palmer',
          name: '(GMT-4:00) Antarctica/Palmer (Chile Time)'
        },
        {
          timezone: 'Atlantic/Bermuda',
          name: '(GMT-4:00) Atlantic/Bermuda (Atlantic Standard Time)'
        },
        {
          timezone: 'Atlantic/Stanley',
          name: '(GMT-4:00) Atlantic/Stanley (Falkland Is. Time)'
        },
        {
          timezone: 'Brazil/Acre',
          name: '(GMT-4:00) Brazil/Acre (Amazon Time)'
        },
        {
          timezone: 'Brazil/West',
          name: '(GMT-4:00) Brazil/West (Amazon Time)'
        },
        {
          timezone: 'Canada/Atlantic',
          name: '(GMT-4:00) Canada/Atlantic (Atlantic Standard Time)'
        },
        {
          timezone: 'Chile/Continental',
          name: '(GMT-4:00) Chile/Continental (Chile Time)'
        },
        {
          timezone: 'America/St_Johns',
          name: '(GMT-3:-30) America/St_Johns (Newfoundland Standard Time)'
        },
        {
          timezone: 'Canada/Newfoundland',
          name: '(GMT-3:-30) Canada/Newfoundland (Newfoundland Standard Time)'
        },
        {
          timezone: 'America/Araguaina',
          name: '(GMT-3:00) America/Araguaina (Brasilia Time)'
        },
        {
          timezone: 'America/Bahia',
          name: '(GMT-3:00) America/Bahia (Brasilia Time)'
        },
        {
          timezone: 'America/Belem',
          name: '(GMT-3:00) America/Belem (Brasilia Time)'
        },
        {
          timezone: 'America/Buenos_Aires',
          name: '(GMT-3:00) America/Buenos_Aires (Argentine Time)'
        },
        {
          timezone: 'America/Catamarca',
          name: '(GMT-3:00) America/Catamarca (Argentine Time)'
        },
        {
          timezone: 'America/Cayenne',
          name: '(GMT-3:00) America/Cayenne (French Guiana Time)'
        },
        {
          timezone: 'America/Cordoba',
          name: '(GMT-3:00) America/Cordoba (Argentine Time)'
        },
        {
          timezone: 'America/Fortaleza',
          name: '(GMT-3:00) America/Fortaleza (Brasilia Time)'
        },
        {
          timezone: 'America/Godthab',
          name: '(GMT-3:00) America/Godthab (Western Greenland Time)'
        },
        {
          timezone: 'America/Jujuy',
          name: '(GMT-3:00) America/Jujuy (Argentine Time)'
        },
        {
          timezone: 'America/Maceio',
          name: '(GMT-3:00) America/Maceio (Brasilia Time)'
        },
        {
          timezone: 'America/Mendoza',
          name: '(GMT-3:00) America/Mendoza (Argentine Time)'
        },
        {
          timezone: 'America/Miquelon',
          name: '(GMT-3:00) America/Miquelon (Pierre & Miquelon Standard Time)'
        },
        {
          timezone: 'America/Montevideo',
          name: '(GMT-3:00) America/Montevideo (Uruguay Time)'
        },
        {
          timezone: 'America/Paramaribo',
          name: '(GMT-3:00) America/Paramaribo (Suriname Time)'
        },
        {
          timezone: 'America/Recife',
          name: '(GMT-3:00) America/Recife (Brasilia Time)'
        },
        {
          timezone: 'America/Rosario',
          name: '(GMT-3:00) America/Rosario (Argentine Time)'
        },
        {
          timezone: 'America/Santarem',
          name: '(GMT-3:00) America/Santarem (Brasilia Time)'
        },
        {
          timezone: 'America/Sao_Paulo',
          name: '(GMT-3:00) America/Sao_Paulo (Brasilia Time)'
        },
        {
          timezone: 'Antarctica/Rothera',
          name: '(GMT-3:00) Antarctica/Rothera (Rothera Time)'
        },
        {
          timezone: 'Brazil/East',
          name: '(GMT-3:00) Brazil/East (Brasilia Time)'
        },
        {
          timezone: 'America/Noronha',
          name: '(GMT-2:00) America/Noronha (Fernando de Noronha Time)'
        },
        {
          timezone: 'Atlantic/South_Georgia',
          name: '(GMT-2:00) Atlantic/South_Georgia (South Georgia Standard Time)'
        },
        {
          timezone: 'Brazil/DeNoronha',
          name: '(GMT-2:00) Brazil/DeNoronha (Fernando de Noronha Time)'
        },
        {
          timezone: 'America/Scoresbysund',
          name: '(GMT-1:00) America/Scoresbysund (Eastern Greenland Time)'
        },
        {
          timezone: 'Atlantic/Azores',
          name: '(GMT-1:00) Atlantic/Azores (Azores Time)'
        },
        {
          timezone: 'Atlantic/Cape_Verde',
          name: '(GMT-1:00) Atlantic/Cape_Verde (Cape Verde Time)'
        },
        {
          timezone: 'Africa/Abidjan',
          name: '(GMT+0:00) Africa/Abidjan (Greenwich Mean Time)'
        },
        {
          timezone: 'Africa/Accra',
          name: '(GMT+0:00) Africa/Accra (Ghana Mean Time)'
        },
        {
          timezone: 'Africa/Bamako',
          name: '(GMT+0:00) Africa/Bamako (Greenwich Mean Time)'
        },
        {
          timezone: 'Africa/Banjul',
          name: '(GMT+0:00) Africa/Banjul (Greenwich Mean Time)'
        },
        {
          timezone: 'Africa/Bissau',
          name: '(GMT+0:00) Africa/Bissau (Greenwich Mean Time)'
        },
        {
          timezone: 'Africa/Casablanca',
          name: '(GMT+0:00) Africa/Casablanca (Western European Time)'
        },
        {
          timezone: 'Africa/Conakry',
          name: '(GMT+0:00) Africa/Conakry (Greenwich Mean Time)'
        },
        {
          timezone: 'Africa/Dakar',
          name: '(GMT+0:00) Africa/Dakar (Greenwich Mean Time)'
        },
        {
          timezone: 'Africa/El_Aaiun',
          name: '(GMT+0:00) Africa/El_Aaiun (Western European Time)'
        },
        {
          timezone: 'Africa/Freetown',
          name: '(GMT+0:00) Africa/Freetown (Greenwich Mean Time)'
        },
        {
          timezone: 'Africa/Lome',
          name: '(GMT+0:00) Africa/Lome (Greenwich Mean Time)'
        },
        {
          timezone: 'Africa/Monrovia',
          name: '(GMT+0:00) Africa/Monrovia (Greenwich Mean Time)'
        },
        {
          timezone: 'Africa/Nouakchott',
          name: '(GMT+0:00) Africa/Nouakchott (Greenwich Mean Time)'
        },
        {
          timezone: 'Africa/Ouagadougou',
          name: '(GMT+0:00) Africa/Ouagadougou (Greenwich Mean Time)'
        },
        {
          timezone: 'Africa/Sao_Tome',
          name: '(GMT+0:00) Africa/Sao_Tome (Greenwich Mean Time)'
        },
        {
          timezone: 'Africa/Timbuktu',
          name: '(GMT+0:00) Africa/Timbuktu (Greenwich Mean Time)'
        },
        {
          timezone: 'America/Danmarkshavn',
          name: '(GMT+0:00) America/Danmarkshavn (Greenwich Mean Time)'
        },
        {
          timezone: 'Atlantic/Canary',
          name: '(GMT+0:00) Atlantic/Canary (Western European Time)'
        },
        {
          timezone: 'Atlantic/Faeroe',
          name: '(GMT+0:00) Atlantic/Faeroe (Western European Time)'
        },
        {
          timezone: 'Atlantic/Faroe',
          name: '(GMT+0:00) Atlantic/Faroe (Western European Time)'
        },
        {
          timezone: 'Atlantic/Madeira',
          name: '(GMT+0:00) Atlantic/Madeira (Western European Time)'
        },
        {
          timezone: 'Atlantic/Reykjavik',
          name: '(GMT+0:00) Atlantic/Reykjavik (Greenwich Mean Time)'
        },
        {
          timezone: 'Atlantic/St_Helena',
          name: '(GMT+0:00) Atlantic/St_Helena (Greenwich Mean Time)'
        },
        {
          timezone: 'Europe/Belfast',
          name: '(GMT+0:00) Europe/Belfast (Greenwich Mean Time)'
        },
        {
          timezone: 'Europe/Dublin',
          name: '(GMT+0:00) Europe/Dublin (Greenwich Mean Time)'
        },
        {
          timezone: 'Europe/Guernsey',
          name: '(GMT+0:00) Europe/Guernsey (Greenwich Mean Time)'
        },
        {
          timezone: 'Europe/Isle_of_Man',
          name: '(GMT+0:00) Europe/Isle_of_Man (Greenwich Mean Time)'
        },
        {
          timezone: 'Europe/Jersey',
          name: '(GMT+0:00) Europe/Jersey (Greenwich Mean Time)'
        },
        {
          timezone: 'Europe/Lisbon',
          name: '(GMT+0:00) Europe/Lisbon (Western European Time)'
        },
        {
          timezone: 'Europe/London',
          name: '(GMT+0:00) Europe/London (Greenwich Mean Time)'
        },
        {
          timezone: 'Africa/Algiers',
          name: '(GMT+1:00) Africa/Algiers (Central European Time)'
        },
        {
          timezone: 'Africa/Bangui',
          name: '(GMT+1:00) Africa/Bangui (Western African Time)'
        },
        {
          timezone: 'Africa/Brazzaville',
          name: '(GMT+1:00) Africa/Brazzaville (Western African Time)'
        },
        {
          timezone: 'Africa/Ceuta',
          name: '(GMT+1:00) Africa/Ceuta (Central European Time)'
        },
        {
          timezone: 'Africa/Douala',
          name: '(GMT+1:00) Africa/Douala (Western African Time)'
        },
        {
          timezone: 'Africa/Kinshasa',
          name: '(GMT+1:00) Africa/Kinshasa (Western African Time)'
        },
        {
          timezone: 'Africa/Lagos',
          name: '(GMT+1:00) Africa/Lagos (Western African Time)'
        },
        {
          timezone: 'Africa/Libreville',
          name: '(GMT+1:00) Africa/Libreville (Western African Time)'
        },
        {
          timezone: 'Africa/Luanda',
          name: '(GMT+1:00) Africa/Luanda (Western African Time)'
        },
        {
          timezone: 'Africa/Malabo',
          name: '(GMT+1:00) Africa/Malabo (Western African Time)'
        },
        {
          timezone: 'Africa/Ndjamena',
          name: '(GMT+1:00) Africa/Ndjamena (Western African Time)'
        },
        {
          timezone: 'Africa/Niamey',
          name: '(GMT+1:00) Africa/Niamey (Western African Time)'
        },
        {
          timezone: 'Africa/Porto-Novo',
          name: '(GMT+1:00) Africa/Porto-Novo (Western African Time)'
        },
        {
          timezone: 'Africa/Tunis',
          name: '(GMT+1:00) Africa/Tunis (Central European Time)'
        },
        {
          timezone: 'Africa/Windhoek',
          name: '(GMT+1:00) Africa/Windhoek (Western African Time)'
        },
        {
          timezone: 'Arctic/Longyearbyen',
          name: '(GMT+1:00) Arctic/Longyearbyen (Central European Time)'
        },
        {
          timezone: 'Atlantic/Jan_Mayen',
          name: '(GMT+1:00) Atlantic/Jan_Mayen (Central European Time)'
        },
        {
          timezone: 'Europe/Amsterdam',
          name: '(GMT+1:00) Europe/Amsterdam (Central European Time)'
        },
        {
          timezone: 'Europe/Andorra',
          name: '(GMT+1:00) Europe/Andorra (Central European Time)'
        },
        {
          timezone: 'Europe/Belgrade',
          name: '(GMT+1:00) Europe/Belgrade (Central European Time)'
        },
        {
          timezone: 'Europe/Berlin',
          name: '(GMT+1:00) Europe/Berlin (Central European Time)'
        },
        {
          timezone: 'Europe/Bratislava',
          name: '(GMT+1:00) Europe/Bratislava (Central European Time)'
        },
        {
          timezone: 'Europe/Brussels',
          name: '(GMT+1:00) Europe/Brussels (Central European Time)'
        },
        {
          timezone: 'Europe/Budapest',
          name: '(GMT+1:00) Europe/Budapest (Central European Time)'
        },
        {
          timezone: 'Europe/Copenhagen',
          name: '(GMT+1:00) Europe/Copenhagen (Central European Time)'
        },
        {
          timezone: 'Europe/Gibraltar',
          name: '(GMT+1:00) Europe/Gibraltar (Central European Time)'
        },
        {
          timezone: 'Europe/Ljubljana',
          name: '(GMT+1:00) Europe/Ljubljana (Central European Time)'
        },
        {
          timezone: 'Europe/Luxembourg',
          name: '(GMT+1:00) Europe/Luxembourg (Central European Time)'
        },
        {
          timezone: 'Europe/Madrid',
          name: '(GMT+1:00) Europe/Madrid (Central European Time)'
        },
        {
          timezone: 'Europe/Malta',
          name: '(GMT+1:00) Europe/Malta (Central European Time)'
        },
        {
          timezone: 'Europe/Monaco',
          name: '(GMT+1:00) Europe/Monaco (Central European Time)'
        },
        {
          timezone: 'Europe/Oslo',
          name: '(GMT+1:00) Europe/Oslo (Central European Time)'
        },
        {
          timezone: 'Europe/Paris',
          name: '(GMT+1:00) Europe/Paris (Central European Time)'
        },
        {
          timezone: 'Europe/Podgorica',
          name: '(GMT+1:00) Europe/Podgorica (Central European Time)'
        },
        {
          timezone: 'Europe/Prague',
          name: '(GMT+1:00) Europe/Prague (Central European Time)'
        },
        {
          timezone: 'Europe/Rome',
          name: '(GMT+1:00) Europe/Rome (Central European Time)'
        },
        {
          timezone: 'Europe/San_Marino',
          name: '(GMT+1:00) Europe/San_Marino (Central European Time)'
        },
        {
          timezone: 'Europe/Sarajevo',
          name: '(GMT+1:00) Europe/Sarajevo (Central European Time)'
        },
        {
          timezone: 'Europe/Skopje',
          name: '(GMT+1:00) Europe/Skopje (Central European Time)'
        },
        {
          timezone: 'Europe/Stockholm',
          name: '(GMT+1:00) Europe/Stockholm (Central European Time)'
        },
        {
          timezone: 'Europe/Tirane',
          name: '(GMT+1:00) Europe/Tirane (Central European Time)'
        },
        {
          timezone: 'Europe/Vaduz',
          name: '(GMT+1:00) Europe/Vaduz (Central European Time)'
        },
        {
          timezone: 'Europe/Vatican',
          name: '(GMT+1:00) Europe/Vatican (Central European Time)'
        },
        {
          timezone: 'Europe/Vienna',
          name: '(GMT+1:00) Europe/Vienna (Central European Time)'
        },
        {
          timezone: 'Europe/Warsaw',
          name: '(GMT+1:00) Europe/Warsaw (Central European Time)'
        },
        {
          timezone: 'Europe/Zagreb',
          name: '(GMT+1:00) Europe/Zagreb (Central European Time)'
        },
        {
          timezone: 'Europe/Zurich',
          name: '(GMT+1:00) Europe/Zurich (Central European Time)'
        },
        {
          timezone: 'Africa/Blantyre',
          name: '(GMT+2:00) Africa/Blantyre (Central African Time)'
        },
        {
          timezone: 'Africa/Bujumbura',
          name: '(GMT+2:00) Africa/Bujumbura (Central African Time)'
        },
        {
          timezone: 'Africa/Cairo',
          name: '(GMT+2:00) Africa/Cairo (Eastern European Time)'
        },
        {
          timezone: 'Africa/Gaborone',
          name: '(GMT+2:00) Africa/Gaborone (Central African Time)'
        },
        {
          timezone: 'Africa/Harare',
          name: '(GMT+2:00) Africa/Harare (Central African Time)'
        },
        {
          timezone: 'Africa/Johannesburg',
          name: '(GMT+2:00) Africa/Johannesburg (South Africa Standard Time)'
        },
        {
          timezone: 'Africa/Kigali',
          name: '(GMT+2:00) Africa/Kigali (Central African Time)'
        },
        {
          timezone: 'Africa/Lubumbashi',
          name: '(GMT+2:00) Africa/Lubumbashi (Central African Time)'
        },
        {
          timezone: 'Africa/Lusaka',
          name: '(GMT+2:00) Africa/Lusaka (Central African Time)'
        },
        {
          timezone: 'Africa/Maputo',
          name: '(GMT+2:00) Africa/Maputo (Central African Time)'
        },
        {
          timezone: 'Africa/Maseru',
          name: '(GMT+2:00) Africa/Maseru (South Africa Standard Time)'
        },
        {
          timezone: 'Africa/Mbabane',
          name: '(GMT+2:00) Africa/Mbabane (South Africa Standard Time)'
        },
        {
          timezone: 'Africa/Tripoli',
          name: '(GMT+2:00) Africa/Tripoli (Eastern European Time)'
        },
        {
          timezone: 'Asia/Amman',
          name: '(GMT+2:00) Asia/Amman (Eastern European Time)'
        },
        {
          timezone: 'Asia/Beirut',
          name: '(GMT+2:00) Asia/Beirut (Eastern European Time)'
        },
        {
          timezone: 'Asia/Damascus',
          name: '(GMT+2:00) Asia/Damascus (Eastern European Time)'
        },
        {
          timezone: 'Asia/Gaza',
          name: '(GMT+2:00) Asia/Gaza (Eastern European Time)'
        },
        {
          timezone: 'Asia/Istanbul',
          name: '(GMT+2:00) Asia/Istanbul (Eastern European Time)'
        },
        {
          timezone: 'Asia/Jerusalem',
          name: '(GMT+2:00) Asia/Jerusalem (Israel Standard Time)'
        },
        {
          timezone: 'Asia/Nicosia',
          name: '(GMT+2:00) Asia/Nicosia (Eastern European Time)'
        },
        {
          timezone: 'Asia/Tel_Aviv',
          name: '(GMT+2:00) Asia/Tel_Aviv (Israel Standard Time)'
        },
        {
          timezone: 'Europe/Athens',
          name: '(GMT+2:00) Europe/Athens (Eastern European Time)'
        },
        {
          timezone: 'Europe/Bucharest',
          name: '(GMT+2:00) Europe/Bucharest (Eastern European Time)'
        },
        {
          timezone: 'Europe/Chisinau',
          name: '(GMT+2:00) Europe/Chisinau (Eastern European Time)'
        },
        {
          timezone: 'Europe/Helsinki',
          name: '(GMT+2:00) Europe/Helsinki (Eastern European Time)'
        },
        {
          timezone: 'Europe/Istanbul',
          name: '(GMT+2:00) Europe/Istanbul (Eastern European Time)'
        },
        {
          timezone: 'Europe/Kaliningrad',
          name: '(GMT+2:00) Europe/Kaliningrad (Eastern European Time)'
        },
        {
          timezone: 'Europe/Kiev',
          name: '(GMT+2:00) Europe/Kiev (Eastern European Time)'
        },
        {
          timezone: 'Europe/Mariehamn',
          name: '(GMT+2:00) Europe/Mariehamn (Eastern European Time)'
        },
        {
          timezone: 'Europe/Minsk',
          name: '(GMT+2:00) Europe/Minsk (Eastern European Time)'
        },
        {
          timezone: 'Europe/Nicosia',
          name: '(GMT+2:00) Europe/Nicosia (Eastern European Time)'
        },
        {
          timezone: 'Europe/Riga',
          name: '(GMT+2:00) Europe/Riga (Eastern European Time)'
        },
        {
          timezone: 'Europe/Simferopol',
          name: '(GMT+2:00) Europe/Simferopol (Eastern European Time)'
        },
        {
          timezone: 'Europe/Sofia',
          name: '(GMT+2:00) Europe/Sofia (Eastern European Time)'
        },
        {
          timezone: 'Europe/Tallinn',
          name: '(GMT+2:00) Europe/Tallinn (Eastern European Time)'
        },
        {
          timezone: 'Europe/Tiraspol',
          name: '(GMT+2:00) Europe/Tiraspol (Eastern European Time)'
        },
        {
          timezone: 'Europe/Uzhgorod',
          name: '(GMT+2:00) Europe/Uzhgorod (Eastern European Time)'
        },
        {
          timezone: 'Europe/Vilnius',
          name: '(GMT+2:00) Europe/Vilnius (Eastern European Time)'
        },
        {
          timezone: 'Europe/Zaporozhye',
          name: '(GMT+2:00) Europe/Zaporozhye (Eastern European Time)'
        },
        {
          timezone: 'Africa/Addis_Ababa',
          name: '(GMT+3:00) Africa/Addis_Ababa (Eastern African Time)'
        },
        {
          timezone: 'Africa/Asmara',
          name: '(GMT+3:00) Africa/Asmara (Eastern African Time)'
        },
        {
          timezone: 'Africa/Asmera',
          name: '(GMT+3:00) Africa/Asmera (Eastern African Time)'
        },
        {
          timezone: 'Africa/Dar_es_Salaam',
          name: '(GMT+3:00) Africa/Dar_es_Salaam (Eastern African Time)'
        },
        {
          timezone: 'Africa/Djibouti',
          name: '(GMT+3:00) Africa/Djibouti (Eastern African Time)'
        },
        {
          timezone: 'Africa/Kampala',
          name: '(GMT+3:00) Africa/Kampala (Eastern African Time)'
        },
        {
          timezone: 'Africa/Khartoum',
          name: '(GMT+3:00) Africa/Khartoum (Eastern African Time)'
        },
        {
          timezone: 'Africa/Mogadishu',
          name: '(GMT+3:00) Africa/Mogadishu (Eastern African Time)'
        },
        {
          timezone: 'Africa/Nairobi',
          name: '(GMT+3:00) Africa/Nairobi (Eastern African Time)'
        },
        {
          timezone: 'Antarctica/Syowa',
          name: '(GMT+3:00) Antarctica/Syowa (Syowa Time)'
        },
        {
          timezone: 'Asia/Aden',
          name: '(GMT+3:00) Asia/Aden (Arabia Standard Time)'
        },
        {
          timezone: 'Asia/Baghdad',
          name: '(GMT+3:00) Asia/Baghdad (Arabia Standard Time)'
        },
        {
          timezone: 'Asia/Bahrain',
          name: '(GMT+3:00) Asia/Bahrain (Arabia Standard Time)'
        },
        {
          timezone: 'Asia/Kuwait',
          name: '(GMT+3:00) Asia/Kuwait (Arabia Standard Time)'
        },
        {
          timezone: 'Asia/Qatar',
          name: '(GMT+3:00) Asia/Qatar (Arabia Standard Time)'
        },
        {
          timezone: 'Europe/Moscow',
          name: '(GMT+3:00) Europe/Moscow (Moscow Standard Time)'
        },
        {
          timezone: 'Europe/Volgograd',
          name: '(GMT+3:00) Europe/Volgograd (Volgograd Time)'
        },
        {
          timezone: 'Indian/Antananarivo',
          name: '(GMT+3:00) Indian/Antananarivo (Eastern African Time)'
        },
        {
          timezone: 'Indian/Comoro',
          name: '(GMT+3:00) Indian/Comoro (Eastern African Time)'
        },
        {
          timezone: 'Indian/Mayotte',
          name: '(GMT+3:00) Indian/Mayotte (Eastern African Time)'
        },
        {
          timezone: 'Asia/Tehran',
          name: '(GMT+3:30) Asia/Tehran (Iran Standard Time)'
        },
        {
          timezone: 'Asia/Baku',
          name: '(GMT+4:00) Asia/Baku (Azerbaijan Time)'
        },
        {
          timezone: 'Asia/Dubai',
          name: '(GMT+4:00) Asia/Dubai (Gulf Standard Time)'
        },
        {
          timezone: 'Asia/Muscat',
          name: '(GMT+4:00) Asia/Muscat (Gulf Standard Time)'
        },
        {
          timezone: 'Asia/Tbilisi',
          name: '(GMT+4:00) Asia/Tbilisi (Georgia Time)'
        },
        {
          timezone: 'Asia/Yerevan',
          name: '(GMT+4:00) Asia/Yerevan (Armenia Time)'
        },
        {
          timezone: 'Europe/Samara',
          name: '(GMT+4:00) Europe/Samara (Samara Time)'
        },
        {
          timezone: 'Indian/Mahe',
          name: '(GMT+4:00) Indian/Mahe (Seychelles Time)'
        },
        {
          timezone: 'Indian/Mauritius',
          name: '(GMT+4:00) Indian/Mauritius (Mauritius Time)'
        },
        {
          timezone: 'Indian/Reunion',
          name: '(GMT+4:00) Indian/Reunion (Reunion Time)'
        },
        {
          timezone: 'Asia/Kabul',
          name: '(GMT+4:30) Asia/Kabul (Afghanistan Time)'
        },
        {
          timezone: 'Asia/Aqtau',
          name: '(GMT+5:00) Asia/Aqtau (Aqtau Time)'
        },
        {
          timezone: 'Asia/Aqtobe',
          name: '(GMT+5:00) Asia/Aqtobe (Aqtobe Time)'
        },
        {
          timezone: 'Asia/Ashgabat',
          name: '(GMT+5:00) Asia/Ashgabat (Turkmenistan Time)'
        },
        {
          timezone: 'Asia/Ashkhabad',
          name: '(GMT+5:00) Asia/Ashkhabad (Turkmenistan Time)'
        },
        {
          timezone: 'Asia/Dushanbe',
          name: '(GMT+5:00) Asia/Dushanbe (Tajikistan Time)'
        },
        {
          timezone: 'Asia/Karachi',
          name: '(GMT+5:00) Asia/Karachi (Pakistan Time)'
        },
        {
          timezone: 'Asia/Oral',
          name: '(GMT+5:00) Asia/Oral (Oral Time)'
        },
        {
          timezone: 'Asia/Samarkand',
          name: '(GMT+5:00) Asia/Samarkand (Uzbekistan Time)'
        },
        {
          timezone: 'Asia/Tashkent',
          name: '(GMT+5:00) Asia/Tashkent (Uzbekistan Time)'
        },
        {
          timezone: 'Asia/Yekaterinburg',
          name: '(GMT+5:00) Asia/Yekaterinburg (Yekaterinburg Time)'
        },
        {
          timezone: 'Indian/Kerguelen',
          name: '(GMT+5:00) Indian/Kerguelen (French Southern & Antarctic Lands Time)'
        },
        {
          timezone: 'Indian/Maldives',
          name: '(GMT+5:00) Indian/Maldives (Maldives Time)'
        },
        {
          timezone: 'Asia/Calcutta',
          name: '(GMT+5:30) Asia/Calcutta (India Standard Time)'
        },
        {
          timezone: 'Asia/Colombo',
          name: '(GMT+5:30) Asia/Colombo (India Standard Time)'
        },
        {
          timezone: 'Asia/Kolkata',
          name: '(GMT+5:30) Asia/Kolkata (India Standard Time)'
        },
        {
          timezone: 'Asia/Katmandu',
          name: '(GMT+5:45) Asia/Katmandu (Nepal Time)'
        },
        {
          timezone: 'Antarctica/Mawson',
          name: '(GMT+6:00) Antarctica/Mawson (Mawson Time)'
        },
        {
          timezone: 'Antarctica/Vostok',
          name: '(GMT+6:00) Antarctica/Vostok (Vostok Time)'
        },
        {
          timezone: 'Asia/Almaty',
          name: '(GMT+6:00) Asia/Almaty (Alma-Ata Time)'
        },
        {
          timezone: 'Asia/Bishkek',
          name: '(GMT+6:00) Asia/Bishkek (Kirgizstan Time)'
        },
        {
          timezone: 'Asia/Dacca',
          name: '(GMT+6:00) Asia/Dacca (Bangladesh Time)'
        },
        {
          timezone: 'Asia/Dhaka',
          name: '(GMT+6:00) Asia/Dhaka (Bangladesh Time)'
        },
        {
          timezone: 'Asia/Novosibirsk',
          name: '(GMT+6:00) Asia/Novosibirsk (Novosibirsk Time)'
        },
        {
          timezone: 'Asia/Omsk',
          name: '(GMT+6:00) Asia/Omsk (Omsk Time)'
        },
        {
          timezone: 'Asia/Qyzylorda',
          name: '(GMT+6:00) Asia/Qyzylorda (Qyzylorda Time)'
        },
        {
          timezone: 'Asia/Thimbu',
          name: '(GMT+6:00) Asia/Thimbu (Bhutan Time)'
        },
        {
          timezone: 'Asia/Thimphu',
          name: '(GMT+6:00) Asia/Thimphu (Bhutan Time)'
        },
        {
          timezone: 'Indian/Chagos',
          name: '(GMT+6:00) Indian/Chagos (Indian Ocean Territory Time)'
        },
        {
          timezone: 'Asia/Rangoon',
          name: '(GMT+6:30) Asia/Rangoon (Myanmar Time)'
        },
        {
          timezone: 'Indian/Cocos',
          name: '(GMT+6:30) Indian/Cocos (Cocos Islands Time)'
        },
        {
          timezone: 'Antarctica/Davis',
          name: '(GMT+7:00) Antarctica/Davis (Davis Time)'
        },
        {
          timezone: 'Asia/Bangkok',
          name: '(GMT+7:00) Asia/Bangkok (Indochina Time)'
        },
        {
          timezone: 'Asia/Ho_Chi_Minh',
          name: '(GMT+7:00) Asia/Ho_Chi_Minh (Indochina Time)'
        },
        {
          timezone: 'Asia/Hovd',
          name: '(GMT+7:00) Asia/Hovd (Hovd Time)'
        },
        {
          timezone: 'Asia/Jakarta',
          name: '(GMT+7:00) Asia/Jakarta (West Indonesia Time)'
        },
        {
          timezone: 'Asia/Krasnoyarsk',
          name: '(GMT+7:00) Asia/Krasnoyarsk (Krasnoyarsk Time)'
        },
        {
          timezone: 'Asia/Phnom_Penh',
          name: '(GMT+7:00) Asia/Phnom_Penh (Indochina Time)'
        },
        {
          timezone: 'Asia/Pontianak',
          name: '(GMT+7:00) Asia/Pontianak (West Indonesia Time)'
        },
        {
          timezone: 'Asia/Saigon',
          name: '(GMT+7:00) Asia/Saigon (Indochina Time)'
        },
        {
          timezone: 'Asia/Vientiane',
          name: '(GMT+7:00) Asia/Vientiane (Indochina Time)'
        },
        {
          timezone: 'Indian/Christmas',
          name: '(GMT+7:00) Indian/Christmas (Christmas Island Time)'
        },
        {
          timezone: 'Antarctica/Casey',
          name: '(GMT+8:00) Antarctica/Casey (Western Standard Time (Australia))'
        },
        {
          timezone: 'Asia/Brunei',
          name: '(GMT+8:00) Asia/Brunei (Brunei Time)'
        },
        {
          timezone: 'Asia/Choibalsan',
          name: '(GMT+8:00) Asia/Choibalsan (Choibalsan Time)'
        },
        {
          timezone: 'Asia/Chongqing',
          name: '(GMT+8:00) Asia/Chongqing (China Standard Time)'
        },
        {
          timezone: 'Asia/Chungking',
          name: '(GMT+8:00) Asia/Chungking (China Standard Time)'
        },
        {
          timezone: 'Asia/Harbin',
          name: '(GMT+8:00) Asia/Harbin (China Standard Time)'
        },
        {
          timezone: 'Asia/Hong_Kong',
          name: '(GMT+8:00) Asia/Hong_Kong (Hong Kong Time)'
        },
        {
          timezone: 'Asia/Irkutsk',
          name: '(GMT+8:00) Asia/Irkutsk (Irkutsk Time)'
        },
        {
          timezone: 'Asia/Kashgar',
          name: '(GMT+8:00) Asia/Kashgar (China Standard Time)'
        },
        {
          timezone: 'Asia/Kuala_Lumpur',
          name: '(GMT+8:00) Asia/Kuala_Lumpur (Malaysia Time)'
        },
        {
          timezone: 'Asia/Kuching',
          name: '(GMT+8:00) Asia/Kuching (Malaysia Time)'
        },
        {
          timezone: 'Asia/Macao',
          name: '(GMT+8:00) Asia/Macao (China Standard Time)'
        },
        {
          timezone: 'Asia/Macau',
          name: '(GMT+8:00) Asia/Macau (China Standard Time)'
        },
        {
          timezone: 'Asia/Makassar',
          name: '(GMT+8:00) Asia/Makassar (Central Indonesia Time)'
        },
        {
          timezone: 'Asia/Manila',
          name: '(GMT+8:00) Asia/Manila (Philippines Time)'
        },
        {
          timezone: 'Asia/Shanghai',
          name: '(GMT+8:00) Asia/Shanghai (China Standard Time)'
        },
        {
          timezone: 'Asia/Singapore',
          name: '(GMT+8:00) Asia/Singapore (Singapore Time)'
        },
        {
          timezone: 'Asia/Taipei',
          name: '(GMT+8:00) Asia/Taipei (China Standard Time)'
        },
        {
          timezone: 'Asia/Ujung_Pandang',
          name: '(GMT+8:00) Asia/Ujung_Pandang (Central Indonesia Time)'
        },
        {
          timezone: 'Asia/Ulaanbaatar',
          name: '(GMT+8:00) Asia/Ulaanbaatar (Ulaanbaatar Time)'
        },
        {
          timezone: 'Asia/Ulan_Bator',
          name: '(GMT+8:00) Asia/Ulan_Bator (Ulaanbaatar Time)'
        },
        {
          timezone: 'Asia/Urumqi',
          name: '(GMT+8:00) Asia/Urumqi (China Standard Time)'
        },
        {
          timezone: 'Australia/Perth',
          name: '(GMT+8:00) Australia/Perth (Western Standard Time (Australia))'
        },
        {
          timezone: 'Australia/West',
          name: '(GMT+8:00) Australia/West (Western Standard Time (Australia))'
        },
        {
          timezone: 'Australia/Eucla',
          name: '(GMT+8:45) Australia/Eucla (Central Western Standard Time (Australia))'
        },
        {
          timezone: 'Asia/Dili',
          name: '(GMT+9:00) Asia/Dili (Timor-Leste Time)'
        },
        {
          timezone: 'Asia/Jayapura',
          name: '(GMT+9:00) Asia/Jayapura (East Indonesia Time)'
        },
        {
          timezone: 'Asia/Pyongyang',
          name: '(GMT+9:00) Asia/Pyongyang (Korea Standard Time)'
        },
        {
          timezone: 'Asia/Seoul',
          name: '(GMT+9:00) Asia/Seoul (Korea Standard Time)'
        },
        {
          timezone: 'Asia/Tokyo',
          name: '(GMT+9:00) Asia/Tokyo (Japan Standard Time)'
        },
        {
          timezone: 'Asia/Yakutsk',
          name: '(GMT+9:00) Asia/Yakutsk (Yakutsk Time)'
        },
        {
          timezone: 'Australia/Adelaide',
          name: '(GMT+9:30) Australia/Adelaide (Central Standard Time (South Australia))'
        },
        {
          timezone: 'Australia/Broken_Hill',
          name: '(GMT+9:30) Australia/Broken_Hill (Central Standard Time (South Australia/New South Wales))'
        },
        {
          timezone: 'Australia/Darwin',
          name: '(GMT+9:30) Australia/Darwin (Central Standard Time (Northern Territory))'
        },
        {
          timezone: 'Australia/North',
          name: '(GMT+9:30) Australia/North (Central Standard Time (Northern Territory))'
        },
        {
          timezone: 'Australia/South',
          name: '(GMT+9:30) Australia/South (Central Standard Time (South Australia))'
        },
        {
          timezone: 'Australia/Yancowinna',
          name: '(GMT+9:30) Australia/Yancowinna (Central Standard Time (South Australia/New South Wales))'
        },
        {
          timezone: 'Antarctica/DumontDUrville',
          name: '(GMT+10:00) Antarctica/DumontDUrville (Dumont-d\'Urville Time)'
        },
        {
          timezone: 'Asia/Sakhalin',
          name: '(GMT+10:00) Asia/Sakhalin (Sakhalin Time)'
        },
        {
          timezone: 'Asia/Vladivostok',
          name: '(GMT+10:00) Asia/Vladivostok (Vladivostok Time)'
        },
        {
          timezone: 'Australia/ACT',
          name: '(GMT+10:00) Australia/ACT (Eastern Standard Time (New South Wales))'
        },
        {
          timezone: 'Australia/Brisbane',
          name: '(GMT+10:00) Australia/Brisbane (Eastern Standard Time (Queensland))'
        },
        {
          timezone: 'Australia/Canberra',
          name: '(GMT+10:00) Australia/Canberra (Eastern Standard Time (New South Wales))'
        },
        {
          timezone: 'Australia/Currie',
          name: '(GMT+10:00) Australia/Currie (Eastern Standard Time (New South Wales))'
        },
        {
          timezone: 'Australia/Hobart',
          name: '(GMT+10:00) Australia/Hobart (Eastern Standard Time (Tasmania))'
        },
        {
          timezone: 'Australia/Lindeman',
          name: '(GMT+10:00) Australia/Lindeman (Eastern Standard Time (Queensland))'
        },
        {
          timezone: 'Australia/Melbourne',
          name: '(GMT+10:00) Australia/Melbourne (Eastern Standard Time (Victoria))'
        },
        {
          timezone: 'Australia/NSW',
          name: '(GMT+10:00) Australia/NSW (Eastern Standard Time (New South Wales))'
        },
        {
          timezone: 'Australia/Queensland',
          name: '(GMT+10:00) Australia/Queensland (Eastern Standard Time (Queensland))'
        },
        {
          timezone: 'Australia/Sydney',
          name: '(GMT+10:00) Australia/Sydney (Eastern Standard Time (New South Wales))'
        },
        {
          timezone: 'Australia/Tasmania',
          name: '(GMT+10:00) Australia/Tasmania (Eastern Standard Time (Tasmania))'
        },
        {
          timezone: 'Australia/Victoria',
          name: '(GMT+10:00) Australia/Victoria (Eastern Standard Time (Victoria))'
        },
        {
          timezone: 'Australia/LHI',
          name: '(GMT+10:30) Australia/LHI (Lord Howe Standard Time)'
        },
        {
          timezone: 'Australia/Lord_Howe',
          name: '(GMT+10:30) Australia/Lord_Howe (Lord Howe Standard Time)'
        },
        {
          timezone: 'Asia/Magadan',
          name: '(GMT+11:00) Asia/Magadan (Magadan Time)'
        },
        {
          timezone: 'Antarctica/McMurdo',
          name: '(GMT+12:00) Antarctica/McMurdo (New Zealand Standard Time)'
        },
        {
          timezone: 'Antarctica/South_Pole',
          name: '(GMT+12:00) Antarctica/South_Pole (New Zealand Standard Time)'
        },
        {
          timezone: 'Asia/Anadyr',
          name: '(GMT+12:00) Asia/Anadyr (Anadyr Time)'
        },
        {
          timezone: 'Asia/Kamchatka',
          name: '(GMT+12:00) Asia/Kamchatka (Petropavlovsk-Kamchatski Time)'
        }
      ]
    }
  },
  computed: {
    selectedValue: function () {
      return this.localValue
    }
  },
  watch: {
    localValue: {
      handler(value, oldValue) {
        const vue = this
        if (value === oldValue) {
          return
        }
        vue.$emit('update:modelValue', vue.selectedValue)
      }
    },
    modelValue: {
      handler (value, oldValue) {
        const vue = this
        if (value === oldValue) {
          return
        }
        vue.localValue = value
        $(vue.$refs.select).val(value)
        $(vue.$refs.select).trigger('chosen:updated')
      }
    }
  },
  mounted: function () {
    const vue = this

    $(vue.$refs.select).chosen({
      allow_single_deselect: true,
      width: '100%'
    }).change(function () {
      vue.localValue = $(this).val()
    })
  }
}
</script>
