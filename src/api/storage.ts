import axios from 'axios';
import fs from 'fs';

const APIEXT: string = 'b2api/v2';

/**
 * Stores persistent data relating to the Backblaze B2 API 
 */
class StorageLifecycle {
  appKeyId: string;
  appKey: string;
  accountId: string | undefined;
  apiUrl: string | undefined;
  token: string | undefined;
  downloadUrl: string | undefined;
  uploadUrl: string | undefined;

  constructor(appKeyId: string, appKey: string) {
    this.appKeyId = appKeyId;
    this.appKey = appKey;
  }

  private buildAuth(appKeyId: string, appKey: string): string {
    return 'Basic ' + Buffer.from(`${appKeyId}:${appKey}`);
  }

  /**
   * Refreshes account ID, authorization token, API URL and download URL
   */
  async refresh(): Promise<boolean> {
    const appKeyId = process.env.B2_KEY_ID;
    const appKey = process.env.B2_APP_KEY;
    if (typeof appKeyId !== 'string' || typeof appKey !== 'string')
      return false;
    const response = await axios.get(`https://api.backblazeb2.com/${APIEXT}/b2_authorize_account`, {
      headers: {
        'Authorization': this.buildAuth(appKeyId, appKey),
      }
    });
    if (response.status !== 200)
      return false;
    const data = JSON.parse(response.data);
    this.accountId = data.accountId;
    this.token = data.authorizationToken;
    this.apiUrl = data.apiUrl;
    this.downloadUrl = data.downloadUrl;
    return true;
  }

  /**
   * Refreshes the upload URL
   */
  async getNewUploadUrl(__tries: number = 0): Promise<boolean> {
    if (__tries > 2) return false;
    const response = await axios.get(`${this.apiUrl}/${APIEXT}/b2_get_upload_url`, {
      headers: {
        'Authorization': this.token,
      },
    });
    if (response.status === 401) {
      const success = await this.refresh();
      if (!success) return false;
      return await this.getNewUploadUrl(__tries+1);
    } else if (response.status !== 200)
      return false;
    const data = JSON.parse(response.data);
    this.uploadUrl = data.uploadUrl;
    return true;
  }
}

/**
 * Represents a file stored in Backblaze B2.
 */
export type BackblazeFile = {
  id: string,
  name: string,
  uploadedOn: number,
  size: number, // bytes
};

/**
 * Storage API with a Backblaze B2 backend
 */
export default class Storage {
  private lifecycle: StorageLifecycle;

  private constructor(lifecycleData: StorageLifecycle) {
    this.lifecycle = lifecycleData;
  };

  /**
   * Asynchronously initializes the class with lifecycle data, returning `undefined` in case of failure.
   */
  static async init(): Promise<Storage | undefined> {
    const lifecycleData = new StorageLifecycle(process.env.B2_KEY_ID as string, process.env.B2_APP_KEY as string);
    let success = await lifecycleData.refresh();
    if (!success) return undefined;
    return new Storage(lifecycleData);
  }

  /**
   * Uploads a file, returning its `id` as a string in case of success and `undefiend` in case of failure.
   * The second argument, `__tries`, should not be used by the end user.
   */
  async uploadFile(file: File, __tries: number = 0): Promise<string | undefined> {
    if (!this.lifecycle.uploadUrl)
      await this.lifecycle.getNewUploadUrl();
    if (__tries > 2) return undefined;
    const response = await axios.post(`${this.lifecycle.apiUrl}/${APIEXT}/b2_upload_file`, await file.arrayBuffer(), {
      headers: {
        'Authorization': this.lifecycle.token,
        'X-Bz-File-Name': file.name,
        'Content-Type': file.type,
        'Content-Length': file.size,
        'X-Bz-Content-Sha1': 'do_not_verify',
      }
    });
    if (response.status === 401) {
      const success = await this.lifecycle.getNewUploadUrl();
      if (!success) return undefined;
      return await this.uploadFile(file, __tries+1);
    } else if (response.status !== 200) {
      return undefined;
    }
    return response.data.fileId;
  }

  /**
   * Downloads a file, returning a request string to be sent to the user
   */
  downloadFile(id: string, __tries: number = 0): string {
    return `${this.lifecycle.downloadUrl}/${APIEXT}/b2_download_file_by_id?fileId=${id}`;
  }
  
  /**
   * Returns an array of `BackblazeFile`s
   */
  async getFiles(ids: string[]) : Promise<BackblazeFile[]> {
    return [
      {
        name: 'Example file 1',
        size: 1000,
        uploadedOn: 1,
      },
      {
        name: 'Example file 2',
        size: 2000,
        uploadedOn: 2,
      },
      {
        name: 'Example file 3',
        size: 3000,
        uploadedOn: 3,
      },
      {
        name: 'Example file 4',
        size: 4000,
        uploadedOn: 4,
      },
    ];
  }
}
