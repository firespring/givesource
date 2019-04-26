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
    <div class="o-app o-app--no-nav o-app--centered">
        <main class="o-app__main o-app__main--compact">
            <div class="o-app_main-content o-app_main-content--xs">

                <section class="c-page-section c-page-section--border c-page-section--shadow">
                    <header class="c-page-section__header u-justify-center">
                        <a href="#"><img alt="Givesource Logo" src="../../../assets/img/logo-givesource.png" class="logo"></a>
                    </header>

                    <router-view></router-view>

                </section>

            </div>
        </main>
    </div>
</template>

<script>
	export default {
		beforeMount: function () {
			document.body.classList.remove('has-menubar', 'has-menubar--secondary');
			document.body.classList.add('login');
		}
    };
</script>