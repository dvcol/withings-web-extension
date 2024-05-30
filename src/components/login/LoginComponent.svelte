<script lang="ts">
  import { onMount } from 'svelte';

  import withingLogoUrl from '~/assets/withings_1080x1080.png';
  import { WithingsService } from '~/service/withings.service';
  import { useI18n } from '~/utils/i18n.utils';

  const i18n = useI18n('login');

  let params: URLSearchParams | null = null;

  onMount(() => {
    if (!window.location.search?.length) return;
    params = new URLSearchParams(window.location.search);
    console.info('params', params);

    if (params.has('code')) {
      WithingsService.client.exchangeCode({
        code: params.get('code'),
        state: params.get('state'),
      });
    }
  });
</script>

<div class="text">
  <div class="img-container">
    <img src={withingLogoUrl} alt=" withings logo" />
  </div>
  <div class="title">{i18n('app_name', 'global')}</div>
  <button class="button">Button</button>
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
