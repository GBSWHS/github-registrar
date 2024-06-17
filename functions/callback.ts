import type { EnvVariables } from './models/EnvVariables'
import { FetcherProxy } from './models/FetcherProxy'

export const onRequestGet: PagesFunction<EnvVariables> = async ({ request, env }) => {
  if (!isWhitelistedIP(request, env.IP_WHITELIST))
    return createNotWhitelistedResponse(request, env.IP_WHITELIST)

  await createInvitationByUserId(
    await getUserIdFromAccessToken(
      await getAccessTokenFromCode(
        getCodeParam(request), env)), env)

  return createRedirectionResponse()
}

const isWhitelistedIP = (request: Request, whitelist: string): boolean =>
  request.headers.get('CF-Connecting-IP') === whitelist

const createNotWhitelistedResponse = (request: Request, whitelist: string): Response =>
  new Response(
    '인트라넷에 접속 할 수 없습니다. 코딩관 WIFI에 연결되어 있는지 확인해 주세요.\n'+
    `Expected: ${whitelist}, Found: ${request.headers.get('CF-Connecting-IP')}`)

const getCodeParam = (request: Request): string =>
  new URL(request.url).searchParams.get('code') ?? ''

const getAccessTokenFromCode = async (code: string, env: EnvVariables): Promise<string> =>
  await new FetcherProxy()
    .useBasicHeaders()
    .useGetAccessTokenEndpoint()
    .useJSONPostBody({
      client_id: env.CLIENT_ID,
      client_secret: env.CLIENT_SECRET,
      code
    })
    .getFetcher()
    .fetch()
    .then((res) => res.access_token)

const getUserIdFromAccessToken = async (accessToken: string): Promise<number> =>
  await new FetcherProxy()
    .useBasicHeaders()
    .useGetUserInfoEndpoint()
    .useBearerAuthorization(accessToken)
    .getFetcher()
    .fetch()
    .then((res) => res.id)

const createInvitationByUserId = async (userId: number, env: EnvVariables): Promise<void> =>
  await new FetcherProxy()
    .useBasicHeaders()
    .useCreateInvitationEndpoint()
    .useAPITokenAuthorization(env.GITHUB_TOKEN)
    .useJSONPostBody({
      invitee_id: userId
    })
    .getFetcher()
    .fetch()

const createRedirectionResponse = (): Response =>
  Response.redirect('https://github.com/orgs/GBSWHS/invitation')
