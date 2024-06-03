<script lang="ts">
  import { onMount } from 'svelte';

  import withingLogoUrl from '~/assets/withings_1080x1080.png';
  import { WithingsService } from '~/service/withings.service';
  import { WithingsSettings } from '~/settings/withings.settings';
  import { useI18n } from '~/utils/i18n.utils';

  const i18n = useI18n('login');

  let params: URLSearchParams | null = null;

  onMount(() => {
    if (!window.location.search?.length) return;
    params = new URLSearchParams(window.location.search);
    console.info('params', params);
  });

  const redirect = WithingsSettings.redirect_uri;
  const onAuthorize = () => {
    return WithingsService.approve({ redirect_uri: redirect });
  };

  const onLogin = () => {
    WithingsService.authorize(params.get('code'), params.get('state'));
  };
</script>

<div class="text">
  <div class="img-container">
    <img src={withingLogoUrl} alt=" withings logo" />
  </div>
  <div class="title">{i18n('app_name', 'global')}</div>
  {#if !params?.has('code')}
    <input class="redirect" type="text" value={redirect} />
    <button class="button" on:click={onAuthorize}>Authorize</button>
  {:else}
    <div>Code: {params?.get('code')}</div>
    <div>State: {params?.get('state')}</div>
    <button class="button" on:click={onLogin}>Login</button>
  {/if}
</div>

<style lang="scss">
  .text {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    .title {
      margin-bottom: 2rem;
    }

    .redirect {
      max-width: 80%;
      margin-bottom: 2rem;
    }
  }

  .img-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    img {
      min-width: 128px;
      max-width: 25%;
    }
  }

  .button {
    border-radius: 1rem;
    height: 2.125rem;
    padding: 0 1rem;
    background-color: var(--color-secondary);
    border: none;
  }
</style>
