import { AxiosInstance } from 'axios';

abstract class MockBaseApiClient extends jest.requireActual('defender-base-client').BaseApiClient {
  // TODO: Relayer tests are too tightly coupled with the base client implementation
  private api: Promise<AxiosInstance> | undefined;
  protected async init(): Promise<AxiosInstance> {
    if (!this.api) {
      this.api = module.exports.createAuthenticatedApi();
    }
    return this.api!;
  }
}

module.exports = {
  authenticate: jest.fn(),
  createAuthenticatedApi: jest.fn(() => ({
    post: jest.fn(),
    get: jest.fn(),
  })),
  createApi: jest.fn(() => ({
    post: jest.fn(),
    get: jest.fn(),
  })),
  BaseApiClient: MockBaseApiClient,
};
