declare module "mpegts.js" {
  const mpegts: {
    isSupported: () => boolean;
    createPlayer: (
      mediaDataSource: { type: string; url: string; isLive?: boolean },
      config?: { enableWorker?: boolean },
    ) => {
      attachMediaElement: (video: HTMLVideoElement) => void;
      load: () => void;
      play: () => void;
      destroy: () => void;
      on: (event: string, callback: () => void) => void;
    };
    Events: { ERROR: string };
  };
  export default mpegts;
}
