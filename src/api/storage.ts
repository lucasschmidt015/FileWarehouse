import axios from 'axios';

const APIEXT: string = 'b2api/v2';

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
    this.accountId = data.accountId,
    this.token = data.authorizationToken,
    this.apiUrl = data.apiUrl,
    this.downloadUrl = data.downloadUrl;
    return true;
  }

  async getNewUploadUrl(tries: number = 0): Promise<boolean> {
    if (tries > 2) return false;
    const response = await axios.get(`${this.apiUrl}/${APIEXT}/b2_get_upload_url`, {
      headers: {
        'Authorization': this.token,
      },
    });
    if (response.status === 401) {
      const success = await this.refresh();
      if (!success) return false;
      return await this.getNewUploadUrl(tries+1);
    } else if (response.status !== 200)
      return false;
    const data = JSON.parse(response.data);
    this.uploadUrl = data.uploadUrl;
    return true;
  }
}

export type BackblazeFile = {
  id: string,
  name: string,
  uploadedOn: number,
  size: number, // bytes
};

export default class Storage {
  private lifecycle: StorageLifecycle;

  private constructor(lifecycleData: StorageLifecycle) {
    this.lifecycle = lifecycleData;
  };

  static async init(): Promise<Storage | undefined> {
    const lifecycleData = new StorageLifecycle(process.env.B2_KEY_ID as string, process.env.B2_APP_KEY as string);
    const success = await lifecycleData.refresh();
    if (!success) return undefined;
    return new Storage(lifecycleData);
  }

  // Upload file
  async uploadFile(file: File, tries: number = 0): Promise<boolean> {
    if (!this.lifecycle.uploadUrl)
      await this.lifecycle.getNewUploadUrl();
    if (tries > 2) return false;
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
      if (!success) return false;
      return await this.uploadFile(file, tries+1);
    }
    return true;
  }

  // Download file
  async downloadFile(url: string): Promise<File | undefined> {
    return undefined;
  }
  
  // Get files
  async getFiles() : Promise<BackblazeFile[]> {
    return [
      {
        id: '1',
        name: 'Example file 1',
        size: 1000,
        uploadedOn: 1,
      },
      {
        id: '2',
        name: 'Example file 2',
        size: 2000,
        uploadedOn: 2,
      },
      {
        id: '3',
        name: 'Example file 3',
        size: 3000,
        uploadedOn: 3,
      },
      {
        id: '4',
        name: 'Example file 4',
        size: 4000,
        uploadedOn: 4,
      },
    ];
  }
}
