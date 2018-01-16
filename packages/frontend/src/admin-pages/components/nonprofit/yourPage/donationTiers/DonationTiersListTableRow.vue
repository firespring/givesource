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
    <tr>
        <td class="input">
            <div class="u-control-icon u-control-icon--dollar u-control-icon--has-error">
                <input v-model.lazy="localAmount" type="text" style="width: 10rem;" v-money="currencyOptions" :class="{ 'has-error': error}">
            </div>
            <div v-if="error" class="c-notes c-notes--below c-notes--bad c-form-control-error">
                    Minimum amount is $10.00
                </div>
            </div>
        </td>
        <td>
            <input v-model="localDescription" type="text" maxlength="100">
        </td>
    </tr>
</template>

<script>
    module.exports = {
    	data: function () {
    		return {
    			localAmount: this.amount || '',
                localDescription: this.description || '',
                error: null,

                currencyOptions: {
    				precision: 2,
                    masked: true,
                    thousands: '',
                }
            }
        },
    	props: [
    		'amount',
            'description',
            'index'
        ],
        watch: {
    		localAmount: function (value, oldValue) {
    			const vue = this;
    			if (value === oldValue) {
    				return;
                }
                vue.$emit('change', vue.index, {amount: value, description: vue.localDescription});
            },
            localDescription: function (value, oldValue) {
    			const vue = this;
	            if (value === oldValue) {
		            return;
	            }
	            vue.$emit('change', vue.index, {amount: vue.localAmount, description: value});
            },
            amount: function (value, oldValue) {
    			const vue = this;
                if (value === oldValue) {
                	return;
                }

                vue.error = (value < 10.00) ? true : false ;
                vue.error = false;
                vue.localAmount = vue.amount;
                vue.localDescription = vue.description;
            },
	        description: function (value, oldValue) {
    			const vue = this;
    			if (value === oldValue) {
    				return;
                }
		        vue.localAmount = vue.amount;
                vue.localDescription = vue.description;
            }
        }

    };
</script>