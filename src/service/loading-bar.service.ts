import { derived, writable } from 'svelte/store';

export class LoadingBarService {
  private static loading = writable<boolean>(false);
  private static error = writable<boolean>(false);

  static get isLoading() {
    return derived(this.loading, $loading => $loading);
  }

  static get hasError() {
    return derived(this.error, $error => $error);
  }

  static start() {
    this.error.set(false);
    this.loading.set(true);
  }

  static succeed() {
    this.error.set(false);
    this.loading.set(false);
  }

  static fail() {
    this.error.set(true);
    this.loading.set(false);
  }
}
