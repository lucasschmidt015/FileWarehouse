import axios from 'axios';

const APIEXT: string = 'b2api/v2';

type AuthData = {
  accountId: string | undefined,
  apiUrl: string | undefined,
  token: string | undefined,
};

type URLs = {
  downloadUrl: string | undefined,
  uploadUrl: string | undefined,
};

class BackblazeLifecycle {
  appKeyId: string;
  appKey: string;
  authData: AuthData;
  urls: URLs = {
    downloadUrl: undefined,
    uploadUrl: undefined,
  };

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
    this.authData = {
      accountId: data.accountId,
      token: data.authorizationToken,
      apiUrl: data.apiUrl,
    }
    this.urls.downloadUrl = data.downloadUrl;
    return true;
  }

  async getNewUploadUrl(tries: number = 0): Promise<boolean> {
    if (tries > 2) return false;
    const response = await axios.get(`${this.authData.apiUrl}/${APIEXT}/b2_get_upload_url`, {
      headers: {
        'Authorization': this.authData.token,
      },
    });
    if (response.status === 401) {
      const success = await this.refresh();
      if (!success) return false;
      return await this.getNewUploadUrl(tries+1);
    } else if (response.status !== 200)
      return false;
    const data = JSON.parse(response.data);
    this.urls.uploadUrl = data.uploadUrl;
    return true;
  }
}

class Backblaze {
  lifecycleData: BackblazeLifecycle;

  private constructor(lifecycleData: BackblazeLifecycle) {
    this.lifecycleData = lifecycleData;
  };

  async init(): Promise<Backblaze | undefined> {
    const lifecycleData = new BackblazeLifecycle(process.env.B2_KEY_ID as string, process.env.B2_APP_KEY as string);
    const success = await lifecycleData.refresh();
    if (!success) return undefined;
    return new Backblaze(lifecycleData);
  }

  // Upload file
  async uploadFile(file: File, tries: number = 0): Promise<boolean> {
    if (!this.lifecycleData.urls.uploadUrl)
      await this.lifecycleData.getNewUploadUrl();
    if (tries > 2) return false;
    const response = await axios.post(`${this.lifecycleData.authData.apiUrl}/${APIEXT}/b2_upload_file`, await file.arrayBuffer(), {
      headers: {
        'Authorization': this.lifecycleData.authData.token,
        'X-Bz-File-Name': file.name,
        'Content-Type': file.type,
        'Content-Length': file.size,
        'X-Bz-Content-Sha1': 'do_not_verify',
      }
    });
    if (response.status === 401) {
      const success = await this.lifecycleData.getNewUploadUrl();
      if (!success) return false;
      return await this.uploadFile(file, tries+1);
    }
    return true;
  }

  // Download file
  // Get files and pages
}

class Storage {

  async uploadFile(file: File) {
    const buf = file.arrayBuffer();
  }

  async getFile(id: string) {
  }

  async removeFile(id: string) {
  }
}

const storage = new Storage();
export default storage;
