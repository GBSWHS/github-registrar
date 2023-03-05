import type { EnvVariables } from './models/EnvVariables'

export const onRequestGet: PagesFunction<EnvVariables> = ({ env }) =>
  Response.redirect(getAuthorizeURL(env.CLIENT_ID))

const getAuthorizeURL = (clientId: string): string =>
  `https://github.com/login/oauth/authorize?client_id=${clientId}`
