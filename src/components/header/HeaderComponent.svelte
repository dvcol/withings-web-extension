<script lang="ts">
  import { link, location } from 'svelte-spa-router';

  import withingLogoUrl from '~/assets/withings_1080x1080.png';
  import { routeMap } from '~/router/routes';
  import { useI18n } from '~/utils/i18n.utils';

  const i18n = useI18n('header');
</script>

<nav class="container">
  <div class="img-container">
    <img src={withingLogoUrl} alt=" withings logo" />
  </div>
  <ul class="navbar">
    {#each routeMap as route}
      <li>
        <a href={route.path} class:secondary={$location !== route.path} use:link>{i18n(route.name)}</a>
      </li>
    {/each}
  </ul>
</nav>

<style lang="scss">
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

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

    .navbar {
      margin-top: 0;
    }
  }
</style>
