<script lang="ts">
  import { onMount } from 'svelte';

  import { derived, writable } from 'svelte/store';

  import { WithingsService } from '~/service/withings.service';
  import { WithingsSettings } from '~/settings/withings.settings';
  import { useI18n } from '~/utils/i18n.utils';

  const i18n = useI18n('login');

  const isLogged$ = WithingsService.isAuthorized$;

  // eslint-disable-next-line prefer-const -- bound to input
  let redirect = WithingsSettings.redirect_uri;
  const params$ = writable<URLSearchParams | undefined>();
  const code$ = derived(params$, $params => $params?.get('code'));
  const state$ = derived(params$, $params => $params?.get('state'));

  const updateParams = (search = new URLSearchParams(window.location.search)) => {
    params$.set(search);
    console.debug('Update params', search.values());
  };

  onMount(() => {
    if (!window.location.search?.length) return;
    updateParams();
  });

  const clearParams = () => {
    window.location.replace(window.location.href.substring(0, window.location.href.indexOf('?')));
  };

  const onAuthorize = async () => {
    await WithingsService.approve({ redirect_uri: redirect });
  };

  const onLogin = async () => {
    await WithingsService.login($code$, $state$);
    clearParams();
  };

  const onLogout = () => {
    WithingsService.logout();
    clearParams();
  };
</script>

<div class="container">
  {#if $isLogged$}
    <!-- Logged in -->
    <button class="button" on:click={onLogout}>{i18n('logout')}</button>
  {:else if !$code$}
    <!--  Logged out  -->
    <div class="field">
      <label for="redirect">{i18n('redirect')}</label>
      <input class="input" name="redirect" id="redirect" type="text" value={redirect} />
    </div>

    <div class="field">
      <button class="button" on:click={onAuthorize}>{i18n('authorize')}</button>
    </div>
  {:else}
    <!--  Authorized  -->
    <div class="field">
      <label for="code">{i18n('code')}</label>
      <input class="input" name="code" id="code" type="text" value={$code$} disabled />
    </div>
    <div class="field">
      <label for="state">{i18n('state')}</label>
      <input class="input" name="state" id="state" type="text" value={$state$} disabled />
    </div>

    <div class="field">
      <button class="button" on:click={onLogin}>Login</button>
    </div>
  {/if}
</div>

<style lang="scss">
  @import 'src/styles/field';

  .container {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    align-items: center;
    align-self: center;
    justify-content: center;
    padding: 4rem;

    .title {
      margin-bottom: 2rem;
    }

    .input {
      display: flex;
      flex: 1 1 auto;
      margin-bottom: 2rem;
    }

    .button {
      width: fit-content;
      height: 2.125rem;
      padding: 0 1rem;
      background-color: var(--color-secondary);
      border: none;
      border-radius: 1rem;
    }
  }
</style>
