import type {
  DownloadResult,
  ListOptions,
  ListResult,
  SignedUploadOptions,
  SignedUploadUrl,
  Storage,
  UploadResult,
} from "emdash";
import { EmDashStorageError } from "emdash";

export function createStorage(): Storage {
  return {
    async upload(_options): Promise<UploadResult> {
      throw new EmDashStorageError(
        "Media uploads are disabled for this NorTh installation.",
        "NOT_SUPPORTED",
      );
    },

    async download(key: string): Promise<DownloadResult> {
      throw new EmDashStorageError(
        `Media storage is disabled: ${key}`,
        "NOT_FOUND",
      );
    },

    async delete(_key: string): Promise<void> {
      return;
    },

    async exists(_key: string): Promise<boolean> {
      return false;
    },

    async list(_options?: ListOptions): Promise<ListResult> {
      return { files: [] };
    },

    async getSignedUploadUrl(_options: SignedUploadOptions): Promise<SignedUploadUrl> {
      throw new EmDashStorageError(
        "Media uploads are disabled for this NorTh installation.",
        "NOT_SUPPORTED",
      );
    },

    getPublicUrl(key: string): string {
      return `/_emdash/api/media/file/${encodeURIComponent(key)}`;
    },
  };
}
