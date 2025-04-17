import {
  // backButton,
  // themeParams,
  // miniApp,
  // initData,
  init as initSDK,
  postEvent,
} from "@telegram-apps/sdk-react";

/**
 * Initializes the application and configures its dependencies.
 */
export function init(): void {
  // Initialize special event handlers for Telegram Desktop, Android, iOS, etc.
  // Also, configure the package.
  initSDK();
  postEvent("web_app_setup_swipe_behavior", { allow_vertical_swipe: false });

  // // Check if all required components are supported.
  // if (!backButton.isSupported() || !miniApp.isSupported()) {
  //   throw new Error("ERR_NOT_SUPPORTED");
  // }

  // // Mount all components used in the project.
  // backButton.mount();
  // miniApp.mount();

  // themeParams.mount();
  // initData.restore();

  // miniApp.mount()
  // themeParams.mount()
}