import env from 'react-dotenv';
import { Buffer } from 'buffer';

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

  constructor(appKeyId: string | undefined, appKey: string | undefined) {
    if (typeof appKeyId !== 'string' || typeof appKey !== 'string') {
      console.log(`Erro na .env: B2_APP_KEY ou B2_KEY_ID`);
    }
    this.appKeyId = appKeyId!;
    this.appKey = appKey!;
  }

  private buildAuth(): string {
    const encoded = Buffer.from(this.appKeyId + ':' + this.appKey).toString('base64');
    return `Basic ${encoded}`;
  }

  /**
   * Refreshes account ID, authorization token, API URL and download URL
   */
  async refresh(): Promise<boolean> {
    if (typeof this.appKeyId !== 'string' || typeof this.appKey !== 'string')
      return false;
    const response = await fetch(`https://api.backblazeb2.com/${APIEXT}/b2_authorize_account`, {
      method: 'GET',
      headers: {
        'Authorization': this.buildAuth(),
      },
    });
    console.log(`HEADERS:`);
    response.headers.forEach((val, key) => {
      console.log(`${key} => ${val}`);
    });
    console.log(`${response.status} ${response.statusText}`);
    if (response.status !== 200)
      return false;
    const data: any = await response.json();
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
    const response = await fetch(`${this.apiUrl}/${APIEXT}/b2_get_upload_url`, {
      mode: 'no-cors',
      headers: {
        'Authorization': this.token as string,
      },
    });
    if (response.status === 401) {
      const success = await this.refresh();
      if (!success) return false;
      return await this.getNewUploadUrl(__tries+1);
    } else if (response.status !== 200)
      return false;
    const data: any = await response.json();
    this.uploadUrl = data.uploadUrl;
    return true;
  }
}

/**
 * Represents a file stored in Backblaze B2.
 */
export type BackblazeFile = {
  name: string,
  uploadedOn: number,
  size: number, // bytes
};

/**
 * Storage API with a Backblaze B2 backend
 */
export class Storage {
  private lifecycle: StorageLifecycle;

  private constructor(lifecycleData: StorageLifecycle) {
    this.lifecycle = lifecycleData;
  };

  /**
   * Asynchronously initializes the class with lifecycle data, returning `undefined` in case of failure.
   */
  static async init(): Promise<Storage | undefined> {
    const lifecycleData = new StorageLifecycle(env.B2_KEY_ID as string, env.B2_APP_KEY as string);
    let success = await lifecycleData.refresh();
    if (!success) return undefined;
    return new Storage(lifecycleData);
  }

  /**
   * Uploads a file, returning its `id` as a string in case of success and `undefiend` in case of failure.
   * The second argument, `__tries`, should not be used by the end user.
   */
  async uploadFile(file: File, __tries: number = 0): Promise<string | undefined> {
    //if (!this.lifecycle.uploadUrl)
      //await this.lifecycle.getNewUploadUrl();
    //if (__tries > 2) return undefined;
    //const response = await fetch(`${this.lifecycle.apiUrl}/${APIEXT}/b2_upload_file`, {
      //method: 'POST',
      //headers: {
        //'Authorization': this.lifecycle.token as string,
        //'X-Bz-File-Name': file.name,
        //'Content-Type': file.type,
        //'Content-Length': file.size.toString(),
        //'X-Bz-Content-Sha1': 'do_not_verify',
      //},
      //body: Buffer.from(await file.arrayBuffer()),
    //});
    //if (response.status === 401) {
      //const success = await this.lifecycle.getNewUploadUrl();
      //if (!success) return undefined;
      //return await this.uploadFile(file, __tries+1);
    //} else if (response.status !== 200) {
      //return undefined;
    //}
    //return (await response.json()).fileId;
    return;
  }

  /**
   * Downloads a file, returning a request string to be sent to the user
   */
  getDownloadLink(id: string, __tries: number = 0): string {
    return `${this.lifecycle.downloadUrl}/${APIEXT}/b2_download_file_by_id?fileId=${id}`;
  }
  
  /**
   * Returns an array of `BackblazeFile`s
   */
  async getManyDownloadLinks(ids: string[]) : Promise<string[]> {
    return ids.map(id => {
      return this.getDownloadLink(id);
    });
  }
}

const storage = Storage.init();
export { storage };
