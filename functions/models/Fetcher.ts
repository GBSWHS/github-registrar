export class Fetcher {
  private url?: string
  private method: string = 'GET'
  private readonly headers = new Map<string, string>()
  private jsonBody: any

  public setURL (url: string): void {
    this.url = url
  }

  public setMethod (method: string): void {
    this.method = method
  }

  public setHeader (key: string, value: string): void {
    this.headers.set(key, value)
  }

  public setJSONBody (jsonBody: any): void {
    this.jsonBody = jsonBody
  }

  public async fetch (): Promise<any> {
    if (!this.isURLEntered())
      throw new Error('Fetcher url not defined')

    return await fetch(this.url ?? '', this.getFetchOption())
      .then(this.parseJSONResponse)
  }

  private isURLEntered (): boolean {
    return this.url !== undefined
  }

  private getFetchOption (): RequestInit<RequestInitCfProperties> {
    return {
      method: this.method,
      headers: this.headers,
      body: this.getJSONBodyOption()
    }
  }

  private getJSONBodyOption (): string | undefined {
    if (!this.isJSONBodyEntered())
      return undefined

    return JSON.stringify(this.jsonBody)
  }

  private isJSONBodyEntered (): boolean {
    return this.jsonBody === undefined
  }

  private async parseJSONResponse (res: Response): Promise<any> {
    return await res.json()
  }
}
